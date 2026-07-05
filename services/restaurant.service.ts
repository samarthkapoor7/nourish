import 'server-only';
import { callSwiggyTool } from '@/lib/swiggy/client';
import { SwiggyReauthRequiredError } from '@/lib/swiggy/errors';
import { deleteSwiggySession, getCurrentSwiggySession } from '@/lib/swiggy/session';
import type {
  SwiggyAddress,
  SwiggySearchRestaurantsParams,
  SwiggySearchRestaurantsResult,
} from '@/lib/swiggy/types';

/**
 * Resolves the caller's Swiggy session and clears it if Swiggy reports it
 * as expired/invalid, so a dead session id never lingers in cookies or the
 * database. Throws SwiggyReauthRequiredError either way when there's no
 * valid session - callers (route handlers, server actions) should catch
 * this and redirect to /api/auth/swiggy/login.
 */
async function withSwiggySession<T>(fn: (accessToken: string) => Promise<T>): Promise<T> {
  const session = await getCurrentSwiggySession();
  if (!session) {
    throw new SwiggyReauthRequiredError('No active Swiggy session - sign in with Swiggy first.');
  }

  try {
    return await fn(session.accessToken);
  } catch (error) {
    if (error instanceof SwiggyReauthRequiredError) {
      await deleteSwiggySession(session.id);
    }
    throw error;
  }
}

/**
 * get_addresses (Food/Instamart): the user's saved delivery addresses.
 * No parameters - per docs, agents must let the user choose one before
 * calling any tool that needs an addressId.
 */
export async function getSwiggyAddresses(): Promise<SwiggyAddress[]> {
  return withSwiggySession((accessToken) =>
    callSwiggyTool<SwiggyAddress[]>('food', 'get_addresses', {}, accessToken),
  );
}

/**
 * search_restaurants (Food): addressId and query are both required by the
 * docs. Only surface restaurants with availabilityStatus "OPEN" to users,
 * per the tools' own agent guidance.
 */
export async function searchSwiggyRestaurants(
  params: SwiggySearchRestaurantsParams,
): Promise<SwiggySearchRestaurantsResult> {
  return withSwiggySession((accessToken) =>
    callSwiggyTool<SwiggySearchRestaurantsResult>(
      'food',
      'search_restaurants',
      { addressId: params.addressId, query: params.query, offset: params.offset },
      accessToken,
    ),
  );
}
