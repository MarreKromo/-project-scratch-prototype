
-- AF-06A.4: Initial database schema
-- All private tables use Row Level Security.

create table public.profiles (
  id uuid primary key
    references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.rounds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null
    references public.profiles(id) on delete cascade,
  course_name text,
  played_at timestamptz,
  round_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null
    references public.profiles(id) on delete cascade,
  activity_type text,
  duration_minutes integer
    check (duration_minutes >= 0),
  performed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.golf_dna (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique
    references public.profiles(id) on delete cascade,
  profile_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.rounds enable row level security;
alter table public.training_sessions enable row level security;
alter table public.golf_dna enable row level security;

-- Profiles: account owner only
create policy "profiles_select_own"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "profiles_insert_own"
on public.profiles for insert to authenticated
with check (id = (select auth.uid()));

create policy "profiles_update_own"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Rounds: account owner only
create policy "rounds_select_own"
on public.rounds for select to authenticated
using (user_id = (select auth.uid()));

create policy "rounds_insert_own"
on public.rounds for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "rounds_update_own"
on public.rounds for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "rounds_delete_own"
on public.rounds for delete to authenticated
using (user_id = (select auth.uid()));

-- Training: account owner only
create policy "training_select_own"
on public.training_sessions for select to authenticated
using (user_id = (select auth.uid()));

create policy "training_insert_own"
on public.training_sessions for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "training_update_own"
on public.training_sessions for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "training_delete_own"
on public.training_sessions for delete to authenticated
using (user_id = (select auth.uid()));

-- Golf DNA: account owner only
create policy "golf_dna_select_own"
on public.golf_dna for select to authenticated
using (user_id = (select auth.uid()));

create policy "golf_dna_insert_own"
on public.golf_dna for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "golf_dna_update_own"
on public.golf_dna for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "golf_dna_delete_own"
on public.golf_dna for delete to authenticated
using (user_id = (select auth.uid()));

