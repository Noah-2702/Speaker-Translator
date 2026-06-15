import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-8 px-6 py-12">
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-primary)]">Phase 1 MVP</p>
        <h1 className="text-4xl font-bold tracking-tight">
          Real-Time Translation Platform
        </h1>
        <p className="max-w-2xl text-[var(--color-muted-foreground)]">
          Create live translation events, share room codes with listeners, and prepare
          for streaming ASR, translation, and voice-cloned audio in later phases.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/signup">Create speaker account</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phase 1 scope</CardTitle>
          <CardDescription>
            Monorepo setup, Supabase auth, and speaker event creation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
          <p>• Email/password authentication with role-aware profiles</p>
          <p>• Organization-scoped event creation with unique room codes</p>
          <p>• Speaker dashboard to list and create events</p>
        </CardContent>
      </Card>
    </main>
  );
}
