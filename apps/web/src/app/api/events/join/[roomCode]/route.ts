import { isValidRoomCode } from "@rt/shared";
import { jsonData, jsonError } from "@/lib/api-response";
import { requireUserProfile } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{ roomCode: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await requireUserProfile();
  if ("error" in auth) {
    return auth.error;
  }

  const { roomCode } = await params;
  const normalizedCode = roomCode.toUpperCase();

  if (!isValidRoomCode(normalizedCode)) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid room code format");
  }

  const { data, error } = await auth.supabase
    .from("events")
    .select("id, title, status, target_languages, created_by")
    .eq("room_code", normalizedCode)
    .in("status", ["scheduled", "live", "ended"])
    .single();

  if (error || !data) {
    return jsonError(404, "NOT_FOUND", "Event not found or not joinable");
  }

  const { data: speakerProfile } = await auth.supabase
    .from("profiles")
    .select("display_name")
    .eq("id", data.created_by)
    .maybeSingle();

  return jsonData({
    eventId: data.id,
    title: data.title,
    status: data.status,
    targetLanguages: data.target_languages,
    speakerDisplayName: speakerProfile?.display_name ?? undefined,
  });
}
