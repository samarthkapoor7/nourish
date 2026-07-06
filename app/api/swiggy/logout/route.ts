import { NextResponse } from 'next/server';
import { clearMcpSessionCookie } from '@/lib/swiggy/mcp-session';
import { clearSwiggyAddressCookie } from '@/lib/swiggy/address';
import { clearSwiggySessionCookie, deleteSwiggySession, getCurrentSwiggySession } from '@/lib/swiggy/session';

export async function POST() {
  const session = await getCurrentSwiggySession();
  if (session) {
    await deleteSwiggySession(session.id);
  }

  await clearSwiggySessionCookie();
  await clearSwiggyAddressCookie();
  await clearMcpSessionCookie();

  return NextResponse.json({ ok: true });
}
