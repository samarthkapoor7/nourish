import { NextResponse } from 'next/server';
import { handleSwiggyRouteError } from '@/lib/api/swiggy-route';
import { mapSwiggyMenuItem, mapSwiggyRestaurant } from '@/lib/swiggy/mappers';
import { isRestaurantAvailable } from '@/lib/swiggy/normalize';
import type { SwiggyMenuItem } from '@/lib/swiggy/types';
import {
  getSwiggyAddressOptions,
  getSwiggyRestaurantMenu,
  resolveSwiggyAddressId,
  searchSwiggyMenu,
  searchSwiggyRestaurantsWithFallback,
} from '@/services/restaurant.service';
import { getSwiggyAddressIdFromCookies, setSwiggyAddressCookie } from '@/lib/swiggy/address';

const MENU_FALLBACK_QUERIES = ['healthy', 'popular', 'biryani', 'pizza', 'thali'];

function defaultRestaurantQuery(): string {
  return 'popular';
}

function collectMenuItems(
  raw: { items?: SwiggyMenuItem[]; menuItems?: SwiggyMenuItem[] },
  restaurant: { id: string; name: string },
) {
  const source = raw.items ?? raw.menuItems ?? [];
  return source.map((item) => mapSwiggyMenuItem(item, restaurant));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');

    if (resource === 'addresses') {
      const addresses = await getSwiggyAddressOptions();
      const selectedAddressId =
        (await getSwiggyAddressIdFromCookies()) ?? addresses[0]?.addressId ?? null;

      if (!selectedAddressId && addresses[0]) {
        await setSwiggyAddressCookie(addresses[0].addressId);
      }

      return NextResponse.json({
        addresses,
        selectedAddressId: selectedAddressId ?? addresses[0]?.addressId ?? null,
      });
    }

    if (resource === 'restaurants') {
      const addressId = await resolveSwiggyAddressId();
      const requestedQuery = searchParams.get('query') ?? defaultRestaurantQuery();
      const { result, query } = await searchSwiggyRestaurantsWithFallback(
        addressId,
        requestedQuery,
      );

      const restaurants = result.restaurants
        .filter(isRestaurantAvailable)
        .slice(0, 6)
        .map(mapSwiggyRestaurant);

      return NextResponse.json({ restaurants, query });
    }

    if (resource === 'menu') {
      const addressId = await resolveSwiggyAddressId();
      const requestedQuery = searchParams.get('query') ?? 'healthy';
      const restaurantId = searchParams.get('restaurantId');

      if (restaurantId) {
        const menu = await getSwiggyRestaurantMenu({ addressId, restaurantId, pageSize: 4 });
        const restaurantName =
          typeof menu.restaurantName === 'string' ? menu.restaurantName : 'Restaurant';
        const categories = menu.categories ?? menu.menu ?? [];
        const items = categories.flatMap((category) =>
          (category.items ?? []).map((item) =>
            mapSwiggyMenuItem(item, { id: restaurantId, name: restaurantName }),
          ),
        );

        return NextResponse.json({
          items: items.slice(0, 12),
          query: requestedQuery,
          restaurantId,
        });
      }

      const { result: restaurantResult } = await searchSwiggyRestaurantsWithFallback(
        addressId,
        requestedQuery,
      );
      const openRestaurants = restaurantResult.restaurants.filter(isRestaurantAvailable);

      for (const query of [requestedQuery, ...MENU_FALLBACK_QUERIES]) {
        const directMenu = await searchSwiggyMenu({ addressId, query });
        const directItems = (directMenu.items ?? directMenu.menuItems ?? [])
          .map((item) => mapSwiggyMenuItem(item, { id: 'mixed', name: 'Nearby' }))
          .slice(0, 12);

        if (directItems.length > 0) {
          return NextResponse.json({ items: directItems, query });
        }
      }

      const menuResults = await Promise.all(
        openRestaurants.slice(0, 3).map(async (restaurant) => {
          for (const query of [requestedQuery, ...MENU_FALLBACK_QUERIES]) {
            const menuSearch = await searchSwiggyMenu({
              addressId,
              query,
              restaurantIdOfAddedItem: restaurant.id,
            });
            const items = collectMenuItems(menuSearch, { id: restaurant.id, name: restaurant.name });
            if (items.length > 0) return items;
          }
          return [];
        }),
      );

      const items = menuResults.flat().slice(0, 12);
      return NextResponse.json({ items, query: requestedQuery });
    }

    return NextResponse.json({ error: 'Unknown resource' }, { status: 400 });
  } catch (error) {
    return handleSwiggyRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { addressId?: string };
    if (!body.addressId) {
      return NextResponse.json({ error: 'addressId is required' }, { status: 400 });
    }

    await setSwiggyAddressCookie(body.addressId);
    return NextResponse.json({ ok: true, addressId: body.addressId });
  } catch (error) {
    return handleSwiggyRouteError(error);
  }
}
