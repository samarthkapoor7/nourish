import 'server-only';
import { cookies } from 'next/headers';
import { SWIGGY_MCP_SESSION_COOKIE } from './mcp-config';

export async function getMcpSessionIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SWIGGY_MCP_SESSION_COOKIE)?.value ?? null;
}

export async function setMcpSessionCookie(sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SWIGGY_MCP_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
}

export async function clearMcpSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SWIGGY_MCP_SESSION_COOKIE);
}
