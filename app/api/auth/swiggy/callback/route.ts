import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {
  SWIGGY_CLIENT_ID_COOKIE,
  SWIGGY_PKCE_COOKIE,
  SWIGGY_STATE_COOKIE,
} from '@/lib/swiggy/config';
import { exchangeSwiggyAuthorizationCode } from '@/lib/swiggy/oauth';
import { createSwiggySession, setSwiggySessionCookie } from '@/lib/swiggy/session';

/**
 * Handles Swiggy's redirect back after phone + OTP (step 3-4 of the docs'
 * walkthrough): validates state, exchanges the code for an access token,
 * persists it, and drops the transient PKCE/state cookies.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const errorParam = url.searchParams.get('error');

  const cookieStore = await cookies();
  const storedState = cookieStore.get(SWIGGY_STATE_COOKIE)?.value;
  const codeVerifier = cookieStore.get(SWIGGY_PKCE_COOKIE)?.value;

  const clearTransientCookies = () => {
    cookieStore.delete(SWIGGY_PKCE_COOKIE);
    cookieStore.delete(SWIGGY_STATE_COOKIE);
    cookieStore.delete(SWIGGY_CLIENT_ID_COOKIE);
  };

  if (errorParam) {
    clearTransientCookies();
    return NextResponse.json(
      { error: `Swiggy authorization was not completed: ${errorParam}` },
      { status: 400 },
    );
  }

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    clearTransientCookies();
    return NextResponse.json(
      { error: 'Invalid or expired Swiggy OAuth state - please try connecting again.' },
      { status: 400 },
    );
  }

  try {
    const token = await exchangeSwiggyAuthorizationCode({ code, codeVerifier });
    const sessionId = await createSwiggySession(token);
    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();
    await setSwiggySessionCookie(sessionId, expiresAt);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to complete Swiggy sign-in.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  } finally {
    clearTransientCookies();
  }

  return NextResponse.redirect(new URL('/settings?swiggy=connected', request.url));
}
