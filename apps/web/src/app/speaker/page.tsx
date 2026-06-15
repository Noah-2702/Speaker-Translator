import { redirect } from "next/navigation";
import Link from "next/link";
import { SpeakerNav } from "@/components/speaker-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { mapEventRow, mapProfileRow } from "@/lib/mappers";
import { LANGUAGE_LABELS } from "@rt/shared";

export default async function SpeakerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/speaker");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profileRow || (profileRow.role !== "speaker" && profileRow.role !== "admin")) {
    redirect("/login?next=/speaker");
  }

  const profile = mapProfileRow(profileRow);

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("organization_id", profile.organizationId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <SpeakerNav displayName={profile.displayName} />
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your events</h1>
            <p className="text-[var(--color-muted-foreground)]">
              Create events and share room codes with listeners.
            </p>
          </div>
          <Button asChild>
            <Link href="/speaker/events/new">Create event</Link>
          </Button>
        </div>

        {!events?.length ? (
          <Card>
            <CardHeader>
              <CardTitle>No events yet</CardTitle>
              <CardDescription>
                Create your first event to generate a room code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/speaker/events/new">Create event</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => {
              const mapped = mapEventRow(event);
              return (
                <Card key={mapped.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle>{mapped.title}</CardTitle>
                        <CardDescription>
                          Room code:{" "}
                          <span className="font-mono font-semibold text-[var(--color-foreground)]">
                            {mapped.roomCode}
                          </span>
                        </CardDescription>
                      </div>
                      <span className="rounded-full bg-[var(--color-secondary)] px-3 py-1 text-xs font-medium uppercase">
                        {mapped.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-muted-foreground)]">
                    <p>
                      Targets:{" "}
                      {mapped.targetLanguages
                        .map((code) => LANGUAGE_LABELS[code])
                        .join(", ")}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/speaker/events/${mapped.id}`}>View details</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
