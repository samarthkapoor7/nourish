# Nourish

AI nutrition planner — tell Nourish your goal once, and it finds meals from nearby restaurants
that hit your calories, protein, and budget, then makes ordering effortless.

This repository is an early-stage **scaffold**, not a finished product: pages are placeholders
backed by mock data, and integrations (Supabase, OpenAI, Swiggy) are configured but not
implemented.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (client/server setup only, no schema or auth flows yet)
- OpenAI SDK (client configured, no prompts/flows yet)
- Swiggy MCP integration (interfaces only, no implementation)
- TanStack React Query
- ESLint + Prettier

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local # fill in Supabase/OpenAI keys when ready
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
  ai/             # OpenAI client + config (placeholder)
  swiggy/         # Swiggy MCP client interface (no implementation)
  supabase/       # Supabase browser/server clients (no schema yet)
  utils.ts        # shadcn `cn` helper
hooks/            # React Query hooks
types/            # shared TypeScript types
utils/            # formatting helpers
constants/        # nav config, app copy, mock data
```

## What's implemented vs. not

**Implemented:** navigation between all pages, dark-mode-first design system, mock dashboard UI,
loading/error states, folder architecture, env var templates, client configs for Supabase/OpenAI.

**Not implemented (by design):** auth flows, database schema, AI meal planning, Swiggy
ordering/MCP calls, and any real backend logic. See `services/*.ts` and `lib/swiggy/client.ts`
for the placeholder seams where that logic will land.
