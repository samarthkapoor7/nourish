-- Initial schema for Nourish: profiles, nutrition goals, and meal entries.
-- Mirrors the TypeScript types in types/user.ts and types/nutrition.ts.

create extension if not exists "pgcrypto";

-- Shared trigger function to keep updated_at current on row updates.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles: one row per auth user, created automatically on signup.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- nutrition_goals: one active goal per user.
create table public.nutrition_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  daily_calories integer not null,
  daily_protein_grams integer not null,
  daily_budget numeric(10, 2) not null,
  currency text not null default 'INR',
  goal_type text not null check (goal_type in ('lose_weight', 'maintain', 'gain_muscle', 'custom')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.nutrition_goals enable row level security;

create policy "Users can manage their own nutrition goal"
  on public.nutrition_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger nutrition_goals_set_updated_at
  before update on public.nutrition_goals
  for each row execute function public.set_updated_at();

-- meal_entries: a user's planned/ordered meals (dashboard, weekly plan, history).
create table public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('breakfast', 'lunch', 'snack', 'dinner')),
  title text not null,
  restaurant_name text,
  calories integer not null,
  protein_grams integer not null,
  price numeric(10, 2) not null,
  scheduled_at timestamptz not null,
  ordered boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.meal_entries enable row level security;

create policy "Users can manage their own meal entries"
  on public.meal_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger meal_entries_set_updated_at
  before update on public.meal_entries
  for each row execute function public.set_updated_at();

create index meal_entries_user_scheduled_idx
  on public.meal_entries (user_id, scheduled_at);
