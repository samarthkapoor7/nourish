import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SWIGGY_CLIENT_ID_COOKIE,
  SWIGGY_PKCE_COOKIE,
  SWIGGY_STATE_COOKIE,
} from '@/lib/swiggy/config';
import { buildSwiggyAuthorizationUrl, registerSwiggyClient } from '@/lib/swiggy/oauth';
import { generatePkcePair, generateState } from '@/lib/swiggy/pkce';

/**
 * Starts the Swiggy OAuth 2.1 + PKCE flow (step 1-2 of the docs' walkthrough):
 * register a client via DCR, generate a PKCE pair + CSRF state, stash them
 * in short-lived cookies, then redirect to Swiggy's /auth/authorize.
 */
export async function GET() {
  const registration = await registerSwiggyClient();
  const { codeVerifier, codeChallenge } = generatePkcePair();
  const state = generateState();

  const authorizationUrl = buildSwiggyAuthorizationUrl({
    clientId: registration.client_id,
    codeChallenge,
    state,
  });

  const cookieStore = await cookies();
  const transientCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // Must be "lax", not "strict": these cookies need to survive the
    // top-level cross-site GET redirect back from mcp.swiggy.com.
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 600, // 10 minutes - generous room for phone + OTP entry.
  };

  cookieStore.set(SWIGGY_PKCE_COOKIE, codeVerifier, transientCookieOptions);
  cookieStore.set(SWIGGY_STATE_COOKIE, state, transientCookieOptions);
  cookieStore.set(SWIGGY_CLIENT_ID_COOKIE, registration.client_id, transientCookieOptions);

  return NextResponse.redirect(authorizationUrl);
}
