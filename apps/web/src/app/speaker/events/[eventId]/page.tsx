import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/speaker/events/${eventId}`);
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profileRow) {
    redirect("/login");
  }

  const profile = mapProfileRow(profileRow);
  const { data: eventRow } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (!eventRow) {
    notFound();
  }

  const event = mapEventRow(eventRow);

  return (
    <div>
      <SpeakerNav displayName={profile.displayName} />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <Button variant="outline" asChild>
          <Link href="/speaker">Back to events</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.description ?? "No description provided."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Room code</p>
              <p className="font-mono text-2xl tracking-widest">{event.roomCode}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className="uppercase">{event.status}</p>
            </div>
            <div>
              <p className="font-medium">Target languages</p>
              <p>
                {event.targetLanguages.map((code) => LANGUAGE_LABELS[code]).join(", ")}
              </p>
            </div>
            <div>
              <p className="font-medium">ElevenLabs voice ID</p>
              <p className="font-mono">{event.elevenLabsVoiceId}</p>
            </div>
            <p className="text-[var(--color-muted-foreground)]">
              Live streaming controls arrive in Phase 2+. Share this room code with listeners
              once the realtime service is connected.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
