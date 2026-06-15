-- Phase 1 core schema: organizations, profiles, events, participants

create extension if not exists "pgcrypto";

create type public.user_role as enum ('speaker', 'listener', 'admin');
create type public.event_status as enum ('draft', 'scheduled', 'live', 'ended', 'archived');
create type public.supported_language as enum ('en', 'id', 'zh-CN');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.user_role not null default 'listener',
  organization_id uuid references public.organizations (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  title text not null check (char_length(title) between 3 and 120),
  description text,
  status public.event_status not null default 'draft',
  source_language public.supported_language not null default 'en',
  target_languages public.supported_language[] not null,
  eleven_labs_voice_id text not null,
  context_summary text,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_target_languages_not_empty check (cardinality(target_languages) >= 1)
);

create index events_organization_id_idx on public.events (organization_id);
create index events_created_by_idx on public.events (created_by);
create index events_room_code_idx on public.events (room_code);

create table public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.user_role not null default 'listener',
  language public.supported_language,
  joined_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index event_participants_event_id_idx on public.event_participants (event_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- Auto-create profile + default org on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  requested_role public.user_role;
  requested_name text;
begin
  requested_role := coalesce(
    (new.raw_user_meta_data ->> 'role')::public.user_role,
    'listener'::public.user_role
  );
  requested_name := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');

  insert into public.organizations (name)
  values (coalesce(requested_name, split_part(new.email, '@', 1)) || ' Organization')
  returning id into new_org_id;

  insert into public.profiles (id, display_name, role, organization_id)
  values (
    new.id,
    requested_name,
    requested_role,
    new_org_id
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
