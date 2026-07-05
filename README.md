# Nourish

AI nutrition planner — tell Nourish your goal once, and it finds meals from nearby restaurants
that hit your calories, protein, and budget, then makes ordering effortless.

This repository is an early-stage **scaffold**, not a finished product: pages are placeholders
backed by mock data. Supabase has a live database with an initial schema, and Swiggy MCP has a
real OAuth 2.1 + PKCE integration (see below) — Gemini is configured but not implemented yet.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (`profiles`, `nutrition_goals`, `meal_entries`, `swiggy_oauth_sessions` tables + RLS;
  no Supabase Auth flows wired up yet)
- Gemini SDK (`@google/genai`, client configured, no prompts/flows yet)
- Swiggy Builders Club MCP (OAuth 2.1 + PKCE + Dynamic Client Registration; `get_addresses` and
  `search_restaurants` wired end-to-end; see below)
- TanStack React Query
- ESLint + Prettier

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local # fill in Supabase/Gemini keys when ready
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run lint          # ESLint
npm run format        # Prettier write
npm run format:check  # Prettier check
npm run build         # production build
```

## Project structure

```text
app/
  (marketing)/    # landing page, public
  (auth)/         # login, onboarding
  (app)/          # dashboard, plan, history, settings (shared sidebar shell)
  api/auth/swiggy/
    login/        # GET - starts the Swiggy OAuth + PKCE flow
    callback/     # GET - exchanges the auth code for an access token
components/
  ui/             # shadcn/ui primitives
  layout/         # headers, sidebar, app shell
  dashboard/      # dashboard-specific mock components
  shared/         # cross-page components (loading/error states, logo)
  providers/      # React Query provider, etc.
services/         # business logic, one file per domain (auth, ai, restaurant)
lib/
  ai/             # Gemini client + config (placeholder)
  swiggy/         # Swiggy MCP: OAuth, PKCE, session storage, tool-call client
  supabase/       # Supabase browser/server/admin (service-role) clients
  utils.ts        # shadcn `cn` helper
hooks/            # React Query hooks
types/            # shared TypeScript types
utils/            # formatting helpers
constants/        # nav config, app copy, mock data
supabase/
  config.toml     # Supabase CLI project config
  migrations/     # SQL migrations (applied via `supabase db push`)
```

## Database

The `nourish` Supabase project (ref `horueyxwuxpnsblxzyqi`) is linked and has two migrations
applied:

- `20260705180748_init_schema.sql`
  - `profiles` — one row per auth user, auto-created via an `on_auth_user_created` trigger
  - `nutrition_goals` — one goal per user (calories/protein/budget targets)
  - `meal_entries` — planned/ordered meals, used by the dashboard/plan/history pages
- `20260705184021_swiggy_oauth_sessions.sql`
  - `swiggy_oauth_sessions` — Swiggy OAuth access tokens (see below); RLS enabled with **no**
    anon/authenticated policies, so only the service-role client can read/write it

The first three tables have owner-only RLS policies (`auth.uid() = user_id`). To make further
schema changes: `supabase migration new <name>`, edit the SQL, then `supabase db push`.

## Swiggy MCP integration

Real OAuth 2.1 + PKCE + Dynamic Client Registration (RFC 7591) against the Swiggy Builders Club
MCP platform, verified against the live docs and endpoints on 2026-07-05 (not assumed):

```
GET  /api/auth/swiggy/login     start the flow (DCR -> PKCE -> redirect to Swiggy)
GET  /api/auth/swiggy/callback  exchange the code for a token, persist the session
```

- **Endpoints** (`lib/swiggy/config.ts`): OAuth at `mcp.swiggy.com/auth/{authorize,token,register}`
  (confirmed via `GET /.well-known/oauth-authorization-server`); MCP servers at `mcp.swiggy.com/food`,
  `/im`, `/dineout`.
- **No static API key.** `client_id` comes from Dynamic Client Registration at runtime
  (`lib/swiggy/oauth.ts`), never hardcoded. Bearer tokens are the only credential Swiggy tools see.
- **No refresh tokens in v1.0** (confirmed in the docs, despite the OAuth metadata technically
  advertising the grant type) — access tokens last 5 days; on expiry/401 the user must redo
  `/api/auth/swiggy/login`. `lib/swiggy/client.ts` detects this (HTTP 401 or JSON-RPC `-32001`),
  clears the dead session, and throws `SwiggyReauthRequiredError` for callers to redirect on.
- **Token storage**: the access token is stored server-side only, in the `swiggy_oauth_sessions`
  table (written via a service-role Supabase client, `lib/supabase/admin.ts`). The browser only
  ever holds an opaque, httpOnly session-id cookie — never the token itself.
- **Tools wired up**: `get_addresses` and `search_restaurants` (both on the Food server), exposed
  via `services/restaurant.service.ts`. Other tools (cart, checkout, Instamart, Dineout) aren't
  implemented — `callSwiggyTool()` in `lib/swiggy/client.ts` is generic and can call any tool by
  name once you know its arguments.

See `lib/swiggy/` for the full implementation and inline citations back to the specific doc pages
each piece is based on.

## What's implemented vs. not

**Implemented:** navigation between all pages, dark-mode-first design system, mock dashboard UI,
loading/error states, folder architecture, env var templates, client configs for Supabase/Gemini,
the Supabase schema above, and the Swiggy MCP OAuth integration above.

**Not implemented (by design):** Supabase Auth (no sign-up/login flow, so Swiggy sessions aren't
yet linked to a Nourish user — see `swiggy_oauth_sessions.user_id`), AI meal planning, and most
Swiggy tools beyond `get_addresses`/`search_restaurants` (cart, checkout, ordering, Instamart,
Dineout). The dashboard/plan/history pages still read from mock data in `constants/mock-data.ts`,
not from the new tables or live Swiggy data. See `services/*.ts` for the placeholder seams where
that logic will land.
