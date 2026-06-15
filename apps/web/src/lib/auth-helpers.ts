import { createClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/api-response";
import { mapProfileRow } from "@/lib/mappers";

export async function requireUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: jsonError(401, "UNAUTHORIZED", "Authentication required"),
    } as const;
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profileRow) {
    return {
      error: jsonError(403, "FORBIDDEN", "Profile not found"),
    } as const;
  }

  return {
    supabase,
    user,
    profile: mapProfileRow(profileRow),
  } as const;
}

export function requireSpeakerOrAdmin(role: string) {
  if (role !== "speaker" && role !== "admin") {
    return jsonError(
      403,
      "FORBIDDEN",
      "Only speakers and admins can perform this action",
    );
  }
  return null;
}
