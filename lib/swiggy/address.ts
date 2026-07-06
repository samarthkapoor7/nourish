import 'server-only';
import { cookies } from 'next/headers';
import { SWIGGY_ADDRESS_COOKIE } from './config';

export async function getSwiggyAddressIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SWIGGY_ADDRESS_COOKIE)?.value ?? null;
}

export async function setSwiggyAddressCookie(addressId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SWIGGY_ADDRESS_COOKIE, addressId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSwiggyAddressCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SWIGGY_ADDRESS_COOKIE);
}
