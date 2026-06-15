"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { EventResponse, Profile, SupportedLanguage } from "@rt/shared";
import { SUPPORTED_LANGUAGES } from "@rt/shared";
import { SpeakerNav } from "@/components/speaker-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateEventPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [targetLanguages, setTargetLanguages] = useState<SupportedLanguage[]>(["id"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/profile")
      .then((response) => response.json())
      .then((json) => setProfile(json.data ?? null));
  }, []);

  function toggleLanguage(code: SupportedLanguage, checked: boolean) {
    setTargetLanguages((current) => {
      if (checked) {
        return current.includes(code) ? current : [...current, code];
      }
      return current.filter((value) => value !== code);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile?.organizationId) {
      setError("Organization not found for this account.");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || undefined,
        targetLanguages,
        elevenLabsVoiceId: voiceId,
        organizationId: profile.organizationId,
      }),
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error?.message ?? "Failed to create event");
      setLoading(false);
      return;
    }

    const created = json.data as EventResponse;
    router.push(`/speaker/events/${created.id}`);
    router.refresh();
  }

  return (
    <div>
      <SpeakerNav displayName={profile?.displayName} />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create event</CardTitle>
            <CardDescription>
              Configure target languages and an enrolled ElevenLabs voice ID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Event title</Label>
                <Input
                  id="title"
                  required
                  minLength={3}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voiceId">ElevenLabs voice ID</Label>
                <Input
                  id="voiceId"
                  required
                  placeholder="voice_abc123"
                  value={voiceId}
                  onChange={(event) => setVoiceId(event.target.value)}
                />
              </div>
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">Target languages</legend>
                {SUPPORTED_LANGUAGES.map((language) => (
                  <label
                    key={language.code}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Checkbox
                      checked={targetLanguages.includes(language.code)}
                      onCheckedChange={(checked) =>
                        toggleLanguage(language.code, checked === true)
                      }
                    />
                    {language.label}
                  </label>
                ))}
              </fieldset>
              {error ? (
                <p className="text-sm text-[var(--color-destructive)]" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create event"}
                </Button>
                <Button variant="outline" type="button" asChild>
                  <Link href="/speaker">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
