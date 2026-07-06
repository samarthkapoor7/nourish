import 'server-only';
import { getSwiggyAddressIdFromCookies, setSwiggyAddressCookie } from '@/lib/swiggy/address';
import { callSwiggyTool, callSwiggyToolDetailed } from '@/lib/swiggy/client';
import { SwiggyReauthRequiredError } from '@/lib/swiggy/errors';
import {
  formatSwiggyAddressLabel,
  isRestaurantAvailable,
  normalizeAddresses,
  normalizeMenuSearchPayload,
  normalizeRestaurantMenuPayload,
  normalizeRestaurantsPayload,
} from '@/lib/swiggy/normalize';
import { deleteSwiggySession, getCurrentSwiggySession } from '@/lib/swiggy/session';
import type {
  SwiggyAddress,
  SwiggyGetRestaurantMenuParams,
  SwiggyRestaurantMenuResult,
  SwiggySearchMenuParams,
  SwiggySearchMenuResult,
  SwiggySearchRestaurantsParams,
  SwiggySearchRestaurantsResult,
} from '@/lib/swiggy/types';

function uniqueQueries(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed.toLowerCase())) return false;
    seen.add(trimmed.toLowerCase());
    return true;
  });
}

export interface SwiggyAddressOption {
  addressId: string;
  label: string;
}

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
export async function getSwiggyAddressOptions(): Promise<SwiggyAddressOption[]> {
  return withSwiggySession(async (accessToken) => {
    const response = await callSwiggyToolDetailed<unknown>(
      'food',
      'get_addresses',
      {},
      accessToken,
    );

    const addresses = normalizeAddresses(response.data);
    return addresses.map((address) => ({
      addressId: address.addressId,
      label: formatSwiggyAddressLabel(address, {
        message: response.message,
        textContent: response.textContent,
      }),
    }));
  });
}

export async function getSwiggyAddresses(): Promise<SwiggyAddress[]> {
  return withSwiggySession(async (accessToken) => {
    const response = await callSwiggyToolDetailed<unknown>(
      'food',
      'get_addresses',
      {},
      accessToken,
    );
    return normalizeAddresses(response.data);
  });
}

/**
 * search_restaurants (Food): addressId and query are both required by the
 * docs. Only surface restaurants with availabilityStatus "OPEN" to users,
 * per the tools' own agent guidance.
 */
export async function searchSwiggyRestaurants(
  params: SwiggySearchRestaurantsParams,
): Promise<SwiggySearchRestaurantsResult> {
  return withSwiggySession(async (accessToken) => {
    const data = await callSwiggyTool<unknown>(
      'food',
      'search_restaurants',
      { addressId: params.addressId, query: params.query, offset: params.offset },
      accessToken,
    );
    return normalizeRestaurantsPayload(data);
  });
}

export async function searchSwiggyRestaurantsWithFallback(
  addressId: string,
  query: string,
): Promise<{ result: SwiggySearchRestaurantsResult; query: string }> {
  const restaurantQueries = uniqueQueries([
    query,
    'popular',
    'nearby',
    'best rated',
    'biryani',
    'pizza',
    'north indian',
  ]);

  for (const candidateQuery of restaurantQueries) {
    const result = await searchSwiggyRestaurants({ addressId, query: candidateQuery });
    const viable = result.restaurants.filter(isRestaurantAvailable);
    if (viable.length > 0) {
      return { result: { ...result, restaurants: viable }, query: candidateQuery };
    }
  }

  return searchSwiggyRestaurants({ addressId, query: 'popular' }).then((result) => ({
    result,
    query: 'popular',
  }));
}

/**
 * search_menu (Food): find dishes by name. Returns items with customization
 * details when available. Use restaurantIdOfAddedItem to scope to one outlet.
 */
export async function searchSwiggyMenu(
  params: SwiggySearchMenuParams,
): Promise<SwiggySearchMenuResult> {
  return withSwiggySession(async (accessToken) => {
    const data = await callSwiggyTool<unknown>(
      'food',
      'search_menu',
      {
        addressId: params.addressId,
        query: params.query,
        restaurantIdOfAddedItem: params.restaurantIdOfAddedItem,
        vegFilter: params.vegFilter,
        offset: params.offset,
      },
      accessToken,
    );
    return normalizeMenuSearchPayload(data);
  });
}

/**
 * get_restaurant_menu (Food): browse a restaurant's menu by category.
 */
export async function getSwiggyRestaurantMenu(
  params: SwiggyGetRestaurantMenuParams,
): Promise<SwiggyRestaurantMenuResult> {
  return withSwiggySession(async (accessToken) => {
    const data = await callSwiggyTool<unknown>(
      'food',
      'get_restaurant_menu',
      {
        addressId: params.addressId,
        restaurantId: params.restaurantId,
        page: params.page,
        pageSize: params.pageSize,
      },
      accessToken,
    );
    return normalizeRestaurantMenuPayload(data);
  });
}

/**
 * Resolves the delivery address for Swiggy tool calls. Uses the cookie if
 * set; otherwise picks the first saved address (sorted by last order date
 * per Swiggy docs) and persists it for subsequent requests.
 */
export async function resolveSwiggyAddressId(): Promise<string> {
  const stored = await getSwiggyAddressIdFromCookies();
  if (stored) return stored;

  const addresses = await getSwiggyAddresses();
  if (addresses.length === 0) {
    throw new SwiggyReauthRequiredError(
      'No delivery addresses found on your Swiggy account. Add one in the Swiggy app first.',
    );
  }

  const addressId = addresses[0].addressId;
  await setSwiggyAddressCookie(addressId);
  return addressId;
}
