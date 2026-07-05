# Nourish

AI nutrition planner — tell Nourish your goal once, and it finds meals from nearby restaurants
that hit your calories, protein, and budget, then makes ordering effortless.

This repository is an early-stage **scaffold**, not a finished product: pages are placeholders
backed by mock data, and most integrations (Gemini, Swiggy) are configured but not implemented.
Supabase has a live database with an initial schema (see below).

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (`profiles`, `nutrition_goals`, `meal_entries` tables + RLS; no auth flows wired up yet)
- Gemini SDK (`@google/genai`, client configured, no prompts/flows yet)
- Swiggy MCP integration (interfaces only, no implementation)
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
components/
  ui/             # shadcn/ui primitives
  layout/         # headers, sidebar, app shell
  dashboard/      # dashboard-specific mock components
  shared/         # cross-page components (loading/error states, logo)
  providers/      # React Query provider, etc.
services/         # business logic, one file per domain (auth, ai, restaurant)
lib/
  ai/             # Gemini client + config (placeholder)
  swiggy/         # Swiggy MCP client interface (no implementation)
  supabase/       # Supabase browser/server clients
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

The `nourish` Supabase project (ref `horueyxwuxpnsblxzyqi`) is linked and has one migration
applied: `supabase/migrations/20260705180748_init_schema.sql`, which creates:

- `profiles` — one row per auth user, auto-created via an `on_auth_user_created` trigger
- `nutrition_goals` — one goal per user (calories/protein/budget targets)
- `meal_entries` — planned/ordered meals, used by the dashboard/plan/history pages

All three tables have RLS enabled with owner-only policies (`auth.uid() = user_id`). To make
further schema changes: `supabase migration new <name>`, edit the SQL, then `supabase db push`.

## What's implemented vs. not

**Implemented:** navigation between all pages, dark-mode-first design system, mock dashboard UI,
loading/error states, folder architecture, env var templates, client configs for Supabase/Gemini,
and the initial Supabase schema above.

**Not implemented (by design):** auth flows (no sign-up/login wired to Supabase Auth yet), AI meal
planning, Swiggy ordering/MCP calls, and any real backend logic. The dashboard/plan/history pages
still read from mock data in `constants/mock-data.ts`, not from the new tables. See `services/*.ts`
and `lib/swiggy/client.ts` for the placeholder seams where that logic will land.
