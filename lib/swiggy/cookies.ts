import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import {
  SWIGGY_CLIENT_ID_COOKIE,
  SWIGGY_NEXT_COOKIE,
  SWIGGY_PKCE_COOKIE,
  SWIGGY_SESSION_COOKIE,
  SWIGGY_STATE_COOKIE,
} from './config';

/** Short-lived OAuth cookies that must survive the cross-site redirect to Swiggy. */
export const SWIGGY_TRANSIENT_COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // Must be "lax", not "strict": these cookies need to survive the
  // top-level cross-site GET redirect back from mcp.swiggy.com.
  sameSite: 'lax',
  path: '/',
  maxAge: 600,
};

export const SWIGGY_SESSION_COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

/** Clears the short-lived OAuth cookies on a NextResponse. */
export function clearSwiggyTransientCookies(response: {
  cookies: { delete: (name: string) => void };
}) {
  response.cookies.delete(SWIGGY_PKCE_COOKIE);
  response.cookies.delete(SWIGGY_STATE_COOKIE);
  response.cookies.delete(SWIGGY_CLIENT_ID_COOKIE);
  response.cookies.delete(SWIGGY_NEXT_COOKIE);
}

export function setSwiggyTransientCookies(
  response: { cookies: { set: (name: string, value: string, options?: Partial<ResponseCookie>) => void } },
  values: {
    codeVerifier: string;
    state: string;
    clientId: string;
    next?: string | null;
  },
) {
  response.cookies.set(SWIGGY_PKCE_COOKIE, values.codeVerifier, SWIGGY_TRANSIENT_COOKIE_OPTIONS);
  response.cookies.set(SWIGGY_STATE_COOKIE, values.state, SWIGGY_TRANSIENT_COOKIE_OPTIONS);
  response.cookies.set(SWIGGY_CLIENT_ID_COOKIE, values.clientId, SWIGGY_TRANSIENT_COOKIE_OPTIONS);
  if (values.next) {
    response.cookies.set(SWIGGY_NEXT_COOKIE, values.next, SWIGGY_TRANSIENT_COOKIE_OPTIONS);
  }
}

export function setSwiggySessionCookieOnResponse(
  response: { cookies: { set: (name: string, value: string, options?: Partial<ResponseCookie>) => void } },
  sessionId: string,
  expiresAt: string,
) {
  response.cookies.set(SWIGGY_SESSION_COOKIE, sessionId, {
    ...SWIGGY_SESSION_COOKIE_OPTIONS,
    expires: new Date(expiresAt),
  });
}
