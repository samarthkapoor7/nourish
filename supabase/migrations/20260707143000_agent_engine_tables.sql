create extension if not exists vector;

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  state text not null check (
    state in (
      'planning',
      'waiting_approval',
      'ordering',
      'monitoring_delivery',
      'meal_completed',
      'tracking_progress',
      'learning'
    )
  ),
  confidence numeric(5, 2) not null default 0,
  objective text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists agent_runs_user_created_idx on public.agent_runs (user_id, created_at desc);

alter table public.agent_runs enable row level security;

create policy "Users can view own agent runs"
  on public.agent_runs for select
  using (auth.uid() = user_id);

create policy "Service role can insert agent runs"
  on public.agent_runs for insert
  with check (true);

create table if not exists public.agent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  run_id uuid references public.agent_runs (id) on delete cascade,
  event_type text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists agent_events_user_created_idx on public.agent_events (user_id, created_at desc);

alter table public.agent_events enable row level security;

create policy "Users can view own agent events"
  on public.agent_events for select
  using (auth.uid() = user_id);

create policy "Service role can insert agent events"
  on public.agent_events for insert
  with check (true);

create table if not exists public.agent_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  memory_type text not null,
  memory_key text not null,
  memory_value text not null,
  confidence numeric(5, 2) not null default 0.5,
  source text not null default 'agent',
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists agent_memory_user_type_idx on public.agent_memory (user_id, memory_type);

alter table public.agent_memory enable row level security;

create policy "Users can view own memory"
  on public.agent_memory for select
  using (auth.uid() = user_id);

create policy "Service role can write memory"
  on public.agent_memory for insert
  with check (true);
