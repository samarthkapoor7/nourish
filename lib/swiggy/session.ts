import 'server-only';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { SWIGGY_SESSION_COOKIE } from './config';
import type { SwiggySession, SwiggyTokenResponse } from './types';

const TABLE = 'swiggy_oauth_sessions';

/**
 * Persists a Swiggy access token server-side and returns the opaque row id
 * to store in the user's cookie. The token itself never reaches the browser.
 */
export async function createSwiggySession(
  token: SwiggyTokenResponse,
  userId?: string | null,
): Promise<string> {
  const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();

  const { data, error } = await createAdminClient()
    .from(TABLE)
    .insert({
      user_id: userId ?? null,
      access_token: token.access_token,
      token_type: token.token_type,
      scope: token.scope,
      expires_at: expiresAt,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Failed to persist Swiggy session: ${error?.message ?? 'unknown error'}`);
  }

  return data.id as string;
}

/** Looks up a session by id. Returns null if missing or past expiry. */
export async function getSwiggySession(sessionId: string): Promise<SwiggySession | null> {
  const { data, error } = await createAdminClient()
    .from(TABLE)
    .select('id, access_token, token_type, scope, expires_at')
    .eq('id', sessionId)
    .maybeSingle();

  if (error || !data) return null;

  if (new Date(data.expires_at).getTime() <= Date.now()) {
    await deleteSwiggySession(sessionId);
    return null;
  }

  return {
    id: data.id,
    accessToken: data.access_token,
    tokenType: data.token_type,
    scope: data.scope,
    expiresAt: data.expires_at,
  };
}

export async function deleteSwiggySession(sessionId: string): Promise<void> {
  await createAdminClient().from(TABLE).delete().eq('id', sessionId);
}

/** Reads the session id from the request's cookies, if any. */
export async function getSwiggySessionIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SWIGGY_SESSION_COOKIE)?.value ?? null;
}

/** Reads and resolves the caller's Swiggy session from cookies in one step. */
export async function getCurrentSwiggySession(): Promise<SwiggySession | null> {
  const sessionId = await getSwiggySessionIdFromCookies();
  if (!sessionId) return null;
  return getSwiggySession(sessionId);
}

export async function setSwiggySessionCookie(sessionId: string, expiresAt: string) {
  const cookieStore = await cookies();
  cookieStore.set(SWIGGY_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  });
}

export async function clearSwiggySessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SWIGGY_SESSION_COOKIE);
}
