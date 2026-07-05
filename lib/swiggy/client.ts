import type {
  SwiggyMenuItem,
  SwiggyOrderRequest,
  SwiggyOrderResult,
  SwiggyRestaurantResult,
  SwiggySearchParams,
} from './types';

/**
 * Interface for the Swiggy MCP integration. No implementation yet -
 * this is scaffolding for a future MCP client (or direct API client)
 * that will back restaurant search, menu lookup, and ordering.
 */
export interface SwiggyClient {
  searchRestaurants(params: SwiggySearchParams): Promise<SwiggyRestaurantResult[]>;
  getMenu(restaurantId: string): Promise<SwiggyMenuItem[]>;
  placeOrder(request: SwiggyOrderRequest): Promise<SwiggyOrderResult>;
}

export function createSwiggyClient(): SwiggyClient {
  throw new Error('Not implemented: Swiggy MCP client');
}
