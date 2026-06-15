import { createEventSchema, generateRoomCode, isValidRoomCode } from "@rt/shared";
import { jsonData, jsonError } from "@/lib/api-response";
import {
  requireSpeakerOrAdmin,
  requireUserProfile,
} from "@/lib/auth-helpers";
import { mapEventRow } from "@/lib/mappers";
import { DEFAULT_SOURCE_LANGUAGE } from "@rt/shared";

const MAX_ROOM_CODE_ATTEMPTS = 8;

export async function GET() {
  const auth = await requireUserProfile();
  if ("error" in auth) {
    return auth.error;
  }

  const roleError = requireSpeakerOrAdmin(auth.profile.role);
  if (roleError) {
    return roleError;
  }

  const { data, error } = await auth.supabase
    .from("events")
    .select("*")
    .eq("organization_id", auth.profile.organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    return jsonError(500, "INTERNAL_ERROR", "Failed to load events", {
      message: error.message,
    });
  }

  return jsonData((data ?? []).map(mapEventRow));
}

export async function POST(request: Request) {
  const auth = await requireUserProfile();
  if ("error" in auth) {
    return auth.error;
  }

  const roleError = requireSpeakerOrAdmin(auth.profile.role);
  if (roleError) {
    return roleError;
  }

  if (!auth.profile.organizationId) {
    return jsonError(403, "FORBIDDEN", "User is not assigned to an organization");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "VALIDATION_ERROR", "Invalid JSON body");
  }

  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid event payload", {
      issues: parsed.error.flatten(),
    });
  }

  if (parsed.data.organizationId !== auth.profile.organizationId) {
    return jsonError(403, "FORBIDDEN", "Cannot create events for another organization");
  }

  const payload = parsed.data;
  let createdEvent = null;

  for (let attempt = 0; attempt < MAX_ROOM_CODE_ATTEMPTS; attempt += 1) {
    const roomCode = generateRoomCode();
    if (!isValidRoomCode(roomCode)) {
      continue;
    }

    const { data, error } = await auth.supabase
      .from("events")
      .insert({
        room_code: roomCode,
        title: payload.title,
        description: payload.description ?? null,
        status: payload.scheduledAt ? "scheduled" : "draft",
        source_language: payload.sourceLanguage ?? DEFAULT_SOURCE_LANGUAGE,
        target_languages: payload.targetLanguages,
        eleven_labs_voice_id: payload.elevenLabsVoiceId,
        organization_id: payload.organizationId,
        created_by: auth.user.id,
        scheduled_at: payload.scheduledAt ?? null,
      })
      .select("*")
      .single();

    if (!error && data) {
      createdEvent = data;
      break;
    }

    if (error?.code !== "23505") {
      return jsonError(500, "INTERNAL_ERROR", "Failed to create event", {
        message: error?.message,
      });
    }
  }

  if (!createdEvent) {
    return jsonError(500, "INTERNAL_ERROR", "Unable to generate a unique room code");
  }

  return jsonData(mapEventRow(createdEvent), 201);
}
