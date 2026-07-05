import type { Restaurant } from '@/types';

/**
 * Placeholder restaurant discovery service. Wire this up to
 * @/lib/swiggy/client once the Swiggy MCP integration is implemented.
 */
export async function findNearbyRestaurants(
  _latitude: number,
  _longitude: number,
): Promise<Restaurant[]> {
  throw new Error('Not implemented: findNearbyRestaurants');
}
