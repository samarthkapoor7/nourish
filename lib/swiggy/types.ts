/**
 * Types for the Swiggy Builders Club MCP integration.
 * Verified against https://mcp.swiggy.com/builders/llms-full.txt and live
 * requests against mcp.swiggy.com (2026-07-05) - see lib/swiggy/config.ts.
 */

// ---------------------------------------------------------------------------
// OAuth 2.1 + PKCE + Dynamic Client Registration (RFC 7591)
// ---------------------------------------------------------------------------

export interface SwiggyDynamicClientRegistration {
  client_id: string;
  client_secret?: string;
  client_name: string;
  redirect_uris: string[];
  grant_types: string[];
  response_types: string[];
  token_endpoint_auth_method: string;
  client_id_issued_at?: number;
}

export interface SwiggyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface SwiggyPkcePair {
  codeVerifier: string;
  codeChallenge: string;
}

/** An active, persisted Swiggy OAuth session (see lib/swiggy/session.ts). */
export interface SwiggySession {
  id: string;
  accessToken: string;
  tokenType: string;
  scope: string | null;
  expiresAt: string;
}

// ---------------------------------------------------------------------------
// MCP servers and the tools/call envelope
// ---------------------------------------------------------------------------

/** The three Swiggy MCP servers, keyed by their URL path segment. */
export type SwiggyServer = 'food' | 'im' | 'dineout';

/**
 * Every Swiggy MCP tool returns this envelope on success. The `data` shape
 * is tool-specific and not published as a strict JSON schema in the docs -
 * only described in prose per tool - so callers narrow it themselves.
 */
export interface SwiggyToolSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface SwiggyToolFailure {
  success: false;
  error: {
    message: string;
    reportLink?: string;
    reportHint?: string;
  };
}

export type SwiggyToolResult<T = unknown> = SwiggyToolSuccess<T> | SwiggyToolFailure;

// ---------------------------------------------------------------------------
// get_addresses (Food + Instamart)
// ---------------------------------------------------------------------------

/**
 * Docs guarantee `addressId` as the canonical identifier and that raw
 * coordinates are never returned. The remaining display fields aren't
 * pinned to an exact schema in the docs, so this is intentionally loose.
 */
export interface SwiggyAddress {
  addressId: string;
  [displayField: string]: unknown;
}

// ---------------------------------------------------------------------------
// search_restaurants (Food)
// ---------------------------------------------------------------------------

export interface SwiggySearchRestaurantsParams {
  /** Required. From get_addresses. */
  addressId: string;
  /** Required. Restaurant name or cuisine. */
  query: string;
  /** Pagination offset; use nextOffset from a previous response. Default 0. */
  offset?: number;
}

export type SwiggyRestaurantAvailability = 'OPEN' | 'CLOSED' | 'UNAVAILABLE';

export interface SwiggyRestaurant {
  id: string;
  name: string;
  availabilityStatus: SwiggyRestaurantAvailability;
  [field: string]: unknown;
}

export interface SwiggySearchRestaurantsResult {
  restaurants: SwiggyRestaurant[];
  nextOffset?: number;
}

// ---------------------------------------------------------------------------
// search_menu (Food)
// ---------------------------------------------------------------------------

export interface SwiggySearchMenuParams {
  addressId: string;
  query: string;
  restaurantIdOfAddedItem?: string;
  vegFilter?: 0 | 1;
  offset?: number;
}

export interface SwiggyMenuItem {
  id: string;
  name: string;
  price?: number;
  [field: string]: unknown;
}

export interface SwiggySearchMenuResult {
  items?: SwiggyMenuItem[];
  menuItems?: SwiggyMenuItem[];
  nextOffset?: number;
}

// ---------------------------------------------------------------------------
// get_restaurant_menu (Food)
// ---------------------------------------------------------------------------

export interface SwiggyGetRestaurantMenuParams {
  addressId: string;
  restaurantId: string;
  page?: number;
  pageSize?: number;
}

export interface SwiggyMenuCategory {
  name?: string;
  title?: string;
  items?: SwiggyMenuItem[];
  [field: string]: unknown;
}

export interface SwiggyRestaurantMenuResult {
  categories?: SwiggyMenuCategory[];
  menu?: SwiggyMenuCategory[];
  page?: number;
  totalPages?: number;
  restaurantName?: string;
  [field: string]: unknown;
}
