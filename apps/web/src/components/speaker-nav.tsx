"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

interface SpeakerNavProps {
  displayName?: string | null;
}

export function SpeakerNav({ displayName }: SpeakerNavProps) {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearSession();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <Link href="/speaker" className="text-lg font-semibold">
            Speaker Dashboard
          </Link>
          {displayName ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Signed in as {displayName}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/speaker/events/new">New event</Link>
          </Button>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
