import { NextResponse, type NextRequest } from 'next/server';
import {
  SWIGGY_NEXT_COOKIE,
  SWIGGY_PKCE_COOKIE,
  SWIGGY_STATE_COOKIE,
} from '@/lib/swiggy/config';
import {
  clearSwiggyTransientCookies,
  setSwiggySessionCookieOnResponse,
} from '@/lib/swiggy/cookies';
import { exchangeSwiggyAuthorizationCode } from '@/lib/swiggy/oauth';
import { createSwiggySession } from '@/lib/swiggy/session';

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

  const storedState = request.cookies.get(SWIGGY_STATE_COOKIE)?.value;
  const codeVerifier = request.cookies.get(SWIGGY_PKCE_COOKIE)?.value;
  const nextPath = request.cookies.get(SWIGGY_NEXT_COOKIE)?.value;

  if (errorParam) {
    const response = NextResponse.json(
      { error: `Swiggy authorization was not completed: ${errorParam}` },
      { status: 400 },
    );
    clearSwiggyTransientCookies(response);
    return response;
  }

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    const response = NextResponse.json(
      { error: 'Invalid or expired Swiggy OAuth state - please try connecting again.' },
      { status: 400 },
    );
    clearSwiggyTransientCookies(response);
    return response;
  }

  try {
    const token = await exchangeSwiggyAuthorizationCode({ code, codeVerifier });
    const sessionId = await createSwiggySession(token);
    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();

    const redirectPath =
      nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
        ? nextPath
        : '/settings';
    const redirectUrl = new URL(redirectPath, request.url);
    redirectUrl.searchParams.set('swiggy', 'connected');

    const response = NextResponse.redirect(redirectUrl);
    setSwiggySessionCookieOnResponse(response, sessionId, expiresAt);
    clearSwiggyTransientCookies(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      {
        error: 'Failed to complete Swiggy sign-in.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
    clearSwiggyTransientCookies(response);
    return response;
  }
}
