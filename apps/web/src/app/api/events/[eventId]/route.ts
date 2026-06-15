import { jsonData, jsonError } from "@/lib/api-response";
import { requireUserProfile } from "@/lib/auth-helpers";
import { mapEventRow } from "@/lib/mappers";

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await requireUserProfile();
  if ("error" in auth) {
    return auth.error;
  }

  const { eventId } = await params;

  const { data, error } = await auth.supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error || !data) {
    return jsonError(404, "NOT_FOUND", "Event not found");
  }

  return jsonData(mapEventRow(data));
}
