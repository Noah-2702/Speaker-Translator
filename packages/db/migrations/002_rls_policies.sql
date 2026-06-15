alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;

-- Profiles
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can view profiles in org"
on public.profiles for select
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
      and admin_profile.organization_id = profiles.organization_id
  )
);

-- Organizations
create policy "Members can view own organization"
on public.organizations for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.organization_id = organizations.id
  )
);

create policy "Admins can update own organization"
on public.organizations for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.organization_id = organizations.id
  )
);

-- Events
create policy "Org members can view events"
on public.events for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.organization_id = events.organization_id
  )
);

create policy "Speakers and admins can create events"
on public.events for insert
with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.organization_id = events.organization_id
      and p.role in ('speaker', 'admin')
  )
);

create policy "Event creators and admins can update events"
on public.events for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.organization_id = events.organization_id
      and (events.created_by = auth.uid() or p.role = 'admin')
  )
);

-- Public join metadata by room code (listener flow in later phases)
create policy "Authenticated users can read join metadata by room code"
on public.events for select
using (
  auth.uid() is not null
  and status in ('scheduled', 'live', 'ended')
);

-- Event participants
create policy "Users can view own participation"
on public.event_participants for select
using (user_id = auth.uid());

create policy "Users can join events"
on public.event_participants for insert
with check (user_id = auth.uid());

create policy "Org members can view event participants"
on public.event_participants for select
using (
  exists (
    select 1
    from public.events e
    join public.profiles p on p.organization_id = e.organization_id
    where e.id = event_participants.event_id
      and p.id = auth.uid()
      and p.role in ('speaker', 'admin')
  )
);
