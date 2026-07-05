-- Secure storage for Swiggy MCP OAuth access tokens.
--
-- Swiggy issues a 5-day bearer access token with no refresh-token grant in
-- v1.0 (see mcp.swiggy.com/builders docs). The token never reaches the
-- browser: the row id here is the only thing stored in the user's cookie,
-- and only the service-role key (server-side only) can read/write this
-- table, since RLS has no policies defined for anon/authenticated roles.
--
-- user_id is nullable because Supabase Auth isn't wired into this app yet;
-- once it is, new sessions can be linked to a real user.

create table public.swiggy_oauth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  access_token text not null,
  token_type text not null default 'Bearer',
  scope text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.swiggy_oauth_sessions enable row level security;

create trigger swiggy_oauth_sessions_set_updated_at
  before update on public.swiggy_oauth_sessions
  for each row execute function public.set_updated_at();

create index swiggy_oauth_sessions_expires_at_idx
  on public.swiggy_oauth_sessions (expires_at);
