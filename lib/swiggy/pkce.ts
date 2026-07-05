import 'server-only';
import { createHash, randomBytes } from 'crypto';
import type { SwiggyPkcePair } from './types';

/**
 * PKCE (RFC 7636) verifier + S256 challenge, per the worked example in
 * https://mcp.swiggy.com/builders/docs/start/authenticate.md - Swiggy's
 * OAuth metadata only advertises "S256" in code_challenge_methods_supported,
 * so the plain method is intentionally not implemented here.
 */
export function generatePkcePair(): SwiggyPkcePair {
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
  return { codeVerifier, codeChallenge };
}

/** CSRF state token to bind the authorize request to its callback. */
export function generateState(): string {
  return randomBytes(16).toString('base64url');
}
