import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. Bypasses RLS - only use for tables that
 * intentionally have no anon/authenticated policies (e.g. swiggy_oauth_sessions).
 * Never import this outside server-only code (route handlers, server actions).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      ...(typeof globalThis.WebSocket !== 'undefined'
        ? { realtime: { transport: globalThis.WebSocket as never } }
        : {}),
    },
  );
}
