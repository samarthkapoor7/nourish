import type {
  SwiggyAddress,
  SwiggyMenuItem,
  SwiggyRestaurant,
  SwiggyRestaurantMenuResult,
  SwiggySearchMenuResult,
  SwiggySearchRestaurantsResult,
} from './types';

const ADDRESS_LABEL_KEYS = [
  'display_address',
  'displayAddress',
  'formattedAddress',
  'formatted_address',
  'address',
  'addressLine',
  'addressLine2',
  'address_line',
  'address_line2',
  'shortAddress',
  'short_address',
  'fullAddress',
  'full_address',
  'name',
  'title',
  'label',
  'annotation',
  'tag',
  'area',
  'locality',
  'subLocality',
  'sub_locality',
  'city',
  'cityName',
  'state',
  'landmark',
  'flat',
  'flatNo',
  'floor',
  'postalCode',
  'pincode',
] as const;

const SKIP_DEEP_SCAN_KEYS = /^(id|addressid|address_id|uuid|token|lat|lng|latitude|longitude|pin|coordinates)$/i;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed.toLowerCase())) continue;
    seen.add(trimmed.toLowerCase());
    result.push(trimmed);
  }
  return result;
}

function findArray(data: unknown, keys: string[]): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const record = data as Record<string, unknown>;
  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }

  const nested = record.data;
  if (nested && typeof nested === 'object') {
    const nestedRecord = nested as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(nestedRecord[key])) return nestedRecord[key] as unknown[];
    }
  }

  return [];
}

function collectReadableStrings(source: Record<string, unknown>, depth = 0): string[] {
  if (depth > 3) return [];

  const strings: string[] = [];
  for (const [key, value] of Object.entries(source)) {
    if (SKIP_DEEP_SCAN_KEYS.test(key)) continue;

    if (isNonEmptyString(value) && value.trim().length >= 8 && /[,\s]/.test(value)) {
      strings.push(value.trim());
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      strings.push(...collectReadableStrings(value as Record<string, unknown>, depth + 1));
    }
  }

  return strings;
}

function labelFromMessage(addressId: string, message?: string, textContent?: string): string | undefined {
  const haystack = [message, textContent].filter(Boolean).join('\n');
  if (!haystack) return undefined;

  const lines = haystack.split('\n').map((line) => line.trim()).filter(Boolean);
  const match = lines.find(
    (line) =>
      line.includes(addressId) ||
      line.toLowerCase().includes(addressId.toLowerCase()),
  );

  if (!match) return undefined;

  return match
    .replace(/^\d+[\).\s-]+/, '')
    .replace(new RegExp(addressId, 'gi'), '')
    .replace(/\baddress[_ ]?id\b\s*[:#-]?\s*[\w-]+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[,\s-]+$/g, '')
    .trim();
}

export function normalizeAddress(item: unknown): SwiggyAddress {
  const record = (item ?? {}) as Record<string, unknown>;
  const addressId = String(record.addressId ?? record.address_id ?? record.id ?? '');

  return {
    addressId,
    ...record,
  };
}

export function normalizeAddresses(data: unknown): SwiggyAddress[] {
  return findArray(data, ['addresses', 'locations', 'savedAddresses'])
    .map(normalizeAddress)
    .filter((address) => address.addressId.length > 0);
}

export function formatSwiggyAddressLabel(
  address: SwiggyAddress,
  options?: { message?: string; textContent?: string },
): string {
  const record = address as Record<string, unknown>;
  const addressId = address.addressId;

  const annotation = [record.annotation, record.tag, record.label, record.title, record.name]
    .filter(isNonEmptyString)
    .find((value) => value.length <= 24);

  const lineParts = uniqueStrings(
    ADDRESS_LABEL_KEYS.map((key) => record[key])
      .filter(isNonEmptyString)
      .flatMap((value) => value.split(',').map((part) => part.trim())),
  );

  const nestedObjects = [record.addressDetails, record.location, record.meta, record.details];
  for (const nested of nestedObjects) {
    if (nested && typeof nested === 'object') {
      lineParts.push(
        ...ADDRESS_LABEL_KEYS.map((key) => (nested as Record<string, unknown>)[key])
          .filter(isNonEmptyString),
      );
    }
  }

  const readable = uniqueStrings([
    ...lineParts,
    ...collectReadableStrings(record),
    labelFromMessage(addressId, options?.message, options?.textContent) ?? '',
  ]).filter((part) => !part.toLowerCase().includes(addressId.toLowerCase()));

  const body = readable.join(', ');
  if (annotation && body) return `${annotation} · ${body}`;
  if (body) return body;
  if (annotation) return annotation;

  const messageLabel = labelFromMessage(addressId, options?.message, options?.textContent);
  if (messageLabel) return messageLabel;

  return `Saved address (${addressId.slice(0, 12)}…)`;
}

function firstString(
  source: Record<string, unknown> | null | undefined,
  keys: string[],
): string | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (isNonEmptyString(value)) return value.trim();
  }
  return undefined;
}

function nestedRestaurantRecord(record: Record<string, unknown>): Record<string, unknown> | null {
  const nested = record.restaurant ?? record.outlet ?? record.vendor;
  return nested && typeof nested === 'object' ? (nested as Record<string, unknown>) : null;
}

function hasRestaurantSignals(record: Record<string, unknown>): boolean {
  return Boolean(
    record.cuisines ??
      record.cuisine ??
      record.cuisineTypes ??
      record.costForTwo ??
      record.costForTwoString ??
      record.rating ??
      record.avgRating ??
      record.distanceKm ??
      record.sla,
  );
}

function looksLikeDishOnly(record: Record<string, unknown>): boolean {
  const hasDishPrice =
    typeof record.price === 'number' ||
    typeof record.defaultPrice === 'number' ||
    typeof record.finalPrice === 'number';
  const hasRestaurantPrice = record.costForTwo != null || record.costForTwoString != null;
  const hasCuisine = record.cuisines != null || record.cuisine != null || record.cuisineTypes != null;

  return hasDishPrice && !hasRestaurantPrice && !hasCuisine;
}

function resolveRestaurantIdentity(record: Record<string, unknown>): {
  id: string;
  name: string;
} | null {
  const nested = nestedRestaurantRecord(record);

  const restaurantName =
    firstString(record, ['restaurantName', 'restaurant_name', 'outletName', 'brandName']) ??
    firstString(nested, ['name', 'restaurantName', 'restaurant_name', 'outletName']);

  const directName = firstString(record, ['name', 'title']);
  const restaurantId =
    firstString(record, ['restaurantId', 'restaurant_id', 'outletId']) ??
    firstString(nested, ['id', 'restaurantId', 'restaurant_id']) ??
    firstString(record, ['id']);

  if (restaurantName && directName && restaurantName !== directName) {
    return { id: restaurantId ?? '', name: restaurantName };
  }

  if (restaurantName && hasRestaurantSignals(record)) {
    return { id: restaurantId ?? firstString(record, ['id']) ?? '', name: restaurantName };
  }

  if (directName && hasRestaurantSignals(record) && !looksLikeDishOnly(record)) {
    return { id: restaurantId ?? firstString(record, ['id']) ?? '', name: directName };
  }

  if (restaurantName) {
    return { id: restaurantId ?? '', name: restaurantName };
  }

  if (looksLikeMenuItem(record) || looksLikeDishOnly(record)) {
    return null;
  }

  if (directName) {
    return { id: restaurantId ?? firstString(record, ['id']) ?? '', name: directName };
  }

  return null;
}

function looksLikeMenuItem(record: Record<string, unknown>): boolean {
  return Boolean(
    record.itemId ??
      record.item_id ??
      record.menu_item_id ??
      record.hasVariants ??
      record.hasAddons ??
      record.variants ??
      record.variantsV2,
  );
}

export function normalizeRestaurant(item: unknown): SwiggyRestaurant | null {
  const record = (item ?? {}) as Record<string, unknown>;
  const identity = resolveRestaurantIdentity(record);
  if (!identity?.id || !identity.name) return null;

  return {
    ...record,
    id: identity.id,
    name: identity.name,
    availabilityStatus: normalizeAvailability(
      record.availabilityStatus ?? record.availability ?? record.status,
    ),
  };
}

function normalizeAvailability(status: unknown): SwiggyRestaurant['availabilityStatus'] {
  const normalized = String(status ?? '').toUpperCase();
  if (!normalized) return 'OPEN';
  if (['OPEN', 'AVAILABLE', 'SERVICEABLE', 'ACTIVE'].includes(normalized)) return 'OPEN';
  if (normalized === 'CLOSED') return 'CLOSED';
  return 'UNAVAILABLE';
}

export function isRestaurantAvailable(restaurant: SwiggyRestaurant): boolean {
  const status = restaurant.availabilityStatus;
  return status === 'OPEN' || !status;
}

export function normalizeRestaurantsPayload(data: unknown): SwiggySearchRestaurantsResult {
  const seen = new Set<string>();
  const restaurants = findArray(data, ['restaurants', 'restaurantList'])
    .map(normalizeRestaurant)
    .filter((restaurant): restaurant is SwiggyRestaurant => restaurant !== null)
    .filter((restaurant) => {
      if (!restaurant.id || !restaurant.name) return false;
      if (seen.has(restaurant.id)) return false;
      seen.add(restaurant.id);
      return true;
    });

  const record = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  const nextOffset =
    typeof record.nextOffset === 'number'
      ? record.nextOffset
      : typeof (record.data as Record<string, unknown> | undefined)?.nextOffset === 'number'
        ? ((record.data as Record<string, unknown>).nextOffset as number)
        : undefined;

  return { restaurants, nextOffset };
}

export function normalizeMenuItem(item: unknown): SwiggyMenuItem {
  const record = (item ?? {}) as Record<string, unknown>;

  return {
    id: String(record.id ?? record.itemId ?? record.item_id ?? record.menu_item_id ?? ''),
    name: String(record.name ?? record.itemName ?? record.title ?? 'Dish'),
    price:
      typeof record.price === 'number'
        ? record.price
        : typeof record.defaultPrice === 'number'
          ? record.defaultPrice
          : undefined,
    ...record,
  };
}

export function normalizeMenuSearchPayload(data: unknown): SwiggySearchMenuResult {
  const items = findArray(data, ['items', 'menuItems', 'results', 'dishes', 'menu_items'])
    .map(normalizeMenuItem)
    .filter((item) => item.id.length > 0 && item.name.length > 0);

  const record = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  const nextOffset = typeof record.nextOffset === 'number' ? record.nextOffset : undefined;

  return { items, menuItems: items, nextOffset };
}

export function normalizeRestaurantMenuPayload(data: unknown): SwiggyRestaurantMenuResult {
  if (!data || typeof data !== 'object') return { categories: [] };

  const record = data as Record<string, unknown>;
  const categories = findArray(data, ['categories', 'menu', 'menuCategories']) as SwiggyRestaurantMenuResult['categories'];

  return {
    ...record,
    categories: categories && categories.length > 0 ? categories : undefined,
    menu: categories && categories.length > 0 ? categories : undefined,
  };
}
