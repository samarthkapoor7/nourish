import { NextResponse, type NextRequest } from 'next/server';
import { setSwiggyTransientCookies } from '@/lib/swiggy/cookies';
import { buildSwiggyAuthorizationUrl, registerSwiggyClient } from '@/lib/swiggy/oauth';
import { generatePkcePair, generateState } from '@/lib/swiggy/pkce';

function sanitizeNextPath(next: string | null): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return null;
  return next;
}

/**
 * Starts the Swiggy OAuth 2.1 + PKCE flow (step 1-2 of the docs' walkthrough):
 * register a client via DCR, generate a PKCE pair + CSRF state, stash them
 * in short-lived cookies on the redirect response, then redirect to Swiggy.
 */
export async function GET(request: NextRequest) {
  const next = sanitizeNextPath(request.nextUrl.searchParams.get('next'));
  const registration = await registerSwiggyClient();
  const { codeVerifier, codeChallenge } = generatePkcePair();
  const state = generateState();

  const authorizationUrl = buildSwiggyAuthorizationUrl({
    clientId: registration.client_id,
    codeChallenge,
    state,
  });

  const response = NextResponse.redirect(authorizationUrl);
  setSwiggyTransientCookies(response, {
    codeVerifier,
    state,
    clientId: registration.client_id,
    next,
  });

  return response;
}
