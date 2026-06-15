import { jsonData, jsonError } from "@/lib/api-response";
import { requireUserProfile } from "@/lib/auth-helpers";

export async function GET() {
  const auth = await requireUserProfile();
  if ("error" in auth) {
    return auth.error;
  }

  return jsonData(auth.profile);
}
