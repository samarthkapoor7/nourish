import { NextResponse } from 'next/server';
import { getCurrentSwiggySession } from '@/lib/swiggy/session';

export async function GET() {
  const session = await getCurrentSwiggySession();
  return NextResponse.json({ connected: Boolean(session) });
}
