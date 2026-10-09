
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
