import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

/**
 * Service-role Supabase client. Bypasses RLS - only use for tables that
 * intentionally have no anon/authenticated policies (e.g. swiggy_oauth_sessions).
 * Never import this outside server-only code (route handlers, server actions).
 *
 * The `ws` transport is required because @supabase/supabase-js always
 * constructs a Realtime client (even though we never use realtime here),
 * and that constructor throws immediately on Node < 22, which lacks a
 * native `WebSocket` global.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { transport: WebSocket as never },
    },
  );
}
