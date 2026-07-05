import 'server-only';
import { SWIGGY_CLIENT_NAME, SWIGGY_OAUTH_CONFIG, SWIGGY_REDIRECT_URI } from './config';
import type { SwiggyDynamicClientRegistration, SwiggyTokenResponse } from './types';

/**
 * In-process cache so we don't call Dynamic Client Registration on every
 * login click. Per-instance only (no cross-instance persistence) - cheap
 * to re-register on cold start, and per the docs "you never see the step"
 * either way. Never hardcode a client_id; always go through this path.
 */
let registrationPromise: Promise<SwiggyDynamicClientRegistration> | null = null;

/**
 * Dynamic Client Registration (RFC 7591) at POST /auth/register - confirmed
 * live in v1.0 by a direct test call (2026-07-05), despite one stale
 * changelog line in the docs listing it as a v1.1 roadmap item.
 */
export async function registerSwiggyClient(): Promise<SwiggyDynamicClientRegistration> {
  if (!registrationPromise) {
    registrationPromise = (async () => {
      const response = await fetch(SWIGGY_OAUTH_CONFIG.registrationEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: SWIGGY_CLIENT_NAME,
          redirect_uris: [SWIGGY_REDIRECT_URI],
          grant_types: ['authorization_code'],
          response_types: ['code'],
          token_endpoint_auth_method: 'none',
        }),
      });

      if (!response.ok) {
        registrationPromise = null;
        throw new Error(`Swiggy Dynamic Client Registration failed: HTTP ${response.status}`);
      }

      return (await response.json()) as SwiggyDynamicClientRegistration;
    })();
  }

  return registrationPromise;
}

/**
 * Builds the /auth/authorize redirect URL. Query params match the worked
 * example in mcp.swiggy.com/builders/docs/start/authenticate.md exactly.
 */
export function buildSwiggyAuthorizationUrl(params: {
  clientId: string;
  codeChallenge: string;
  state: string;
}): string {
  const url = new URL(SWIGGY_OAUTH_CONFIG.authorizationEndpoint);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', params.clientId);
  url.searchParams.set('redirect_uri', SWIGGY_REDIRECT_URI);
  url.searchParams.set('code_challenge', params.codeChallenge);
  url.searchParams.set('code_challenge_method', SWIGGY_OAUTH_CONFIG.codeChallengeMethod);
  url.searchParams.set('state', params.state);
  url.searchParams.set('scope', SWIGGY_OAUTH_CONFIG.scope);
  return url.toString();
}

/**
 * Exchanges an authorization code for an access token. Body shape matches
 * the docs' literal curl example - notably no client_id/client_secret,
 * since registration used token_endpoint_auth_method "none".
 */
export async function exchangeSwiggyAuthorizationCode(params: {
  code: string;
  codeVerifier: string;
}): Promise<SwiggyTokenResponse> {
  const response = await fetch(SWIGGY_OAUTH_CONFIG.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: params.code,
      code_verifier: params.codeVerifier,
      redirect_uri: SWIGGY_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Swiggy token exchange failed: HTTP ${response.status} ${body}`);
  }

  return (await response.json()) as SwiggyTokenResponse;
}
