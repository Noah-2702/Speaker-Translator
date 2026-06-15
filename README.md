# Real-Time Translation Platform

Phase 1 MVP: monorepo, Next.js web app, Supabase auth, and speaker event creation.

## Prerequisites

- Node.js 20+
- A Supabase project ([supabase.com](https://supabase.com))

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
copy .env.example apps\web\.env.local
```

3. Apply database migrations in the Supabase SQL editor (or via Supabase CLI):
   - `packages/db/migrations/001_initial_schema.sql`
   - `packages/db/migrations/002_rls_policies.sql`

4. Disable email confirmation for local testing (Supabase Dashboard → Authentication → Providers → Email).

5. Start the web app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Phase 1 scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build shared package + web app |
| `npm run test` | Run shared package unit tests |

## Environment variables

See `.env.example` for required Supabase keys.
