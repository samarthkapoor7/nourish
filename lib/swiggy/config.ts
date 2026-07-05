import 'server-only';
import type { SwiggyServer } from './types';

/**
 * Swiggy Builders Club MCP config. Endpoint values below are verified
 * against the live OAuth metadata document and the docs at
 * https://mcp.swiggy.com/builders/llms-full.txt (fetched 2026-07-05):
 *
 *   curl https://mcp.swiggy.com/.well-known/oauth-authorization-server
 *   -> { authorization_endpoint, token_endpoint, registration_endpoint, ... }
 *
 * These are public discovery URLs, not secrets - safe to hardcode. Only the
 * per-registration `client_id` (from Dynamic Client Registration) and the
 * user's access token are dynamic/secret.
 */
export const SWIGGY_OAUTH_CONFIG = {
  issuer: 'https://mcp.swiggy.com/auth',
  authorizationEndpoint: 'https://mcp.swiggy.com/auth/authorize',
  tokenEndpoint: 'https://mcp.swiggy.com/auth/token',
  registrationEndpoint: 'https://mcp.swiggy.com/auth/register',
  /** Space-separated, per the docs' worked example. */
  scope: 'mcp:tools mcp:resources mcp:prompts',
  codeChallengeMethod: 'S256',
} as const;

export const SWIGGY_MCP_SERVERS: Record<SwiggyServer, string> = {
  food: 'https://mcp.swiggy.com/food',
  im: 'https://mcp.swiggy.com/im',
  dineout: 'https://mcp.swiggy.com/dineout',
};

/**
 * Where Swiggy redirects back after the user completes phone+OTP.
 * Must be registered with Dynamic Client Registration at login time and
 * exactly match what's passed to the token exchange. `http://localhost`
 * is explicitly allowed by the docs for local development.
 */
export const SWIGGY_REDIRECT_URI =
  process.env.SWIGGY_REDIRECT_URI ?? 'http://localhost:3000/api/auth/swiggy/callback';

/** Cosmetic only - shown nowhere except inside the DCR request body. */
export const SWIGGY_CLIENT_NAME = process.env.SWIGGY_CLIENT_NAME ?? 'Nourish';

/** Cookie holding the opaque session id; see lib/swiggy/session.ts. */
export const SWIGGY_SESSION_COOKIE = 'swiggy_session_id';

/** Short-lived cookies used only across the login -> callback round trip. */
export const SWIGGY_PKCE_COOKIE = 'swiggy_pkce_verifier';
export const SWIGGY_STATE_COOKIE = 'swiggy_oauth_state';
export const SWIGGY_CLIENT_ID_COOKIE = 'swiggy_oauth_client_id';
