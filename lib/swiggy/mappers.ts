import type { MenuItem, Restaurant } from '@/types';
import type { SwiggyMenuItem, SwiggyRestaurant } from './types';

const SWIGGY_IMAGE_HOSTS = ['media-assets.swiggy.com', 'res.cloudinary.com'];

function isHttpUrl(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

function toCloudinaryUrl(imageId: string): string {
  if (imageId.startsWith('http')) return imageId;
  return `https://media-assets.swiggy.com/swiggy/image/upload/${imageId}`;
}

/** Pull an image URL from Swiggy's loosely-typed payloads. */
export function extractSwiggyImageUrl(source: Record<string, unknown>): string | undefined {
  const directKeys = [
    'imageUrl',
    'imageURL',
    'image',
    'mediaUrl',
    'thumbnail',
    'thumb',
    'cloudinaryImageId',
    'imageId',
  ] as const;

  for (const key of directKeys) {
    const value = source[key];
    if (isHttpUrl(value)) return value;
    if (typeof value === 'string' && value.length > 0 && key.includes('image')) {
      return toCloudinaryUrl(value);
    }
  }

  const gallery = source.mediaGallery ?? source.images ?? source.imageGallery;
  if (Array.isArray(gallery)) {
    for (const entry of gallery) {
      if (entry && typeof entry === 'object') {
        const record = entry as Record<string, unknown>;
        const url = record.mediaUrl ?? record.imageUrl ?? record.url;
        if (isHttpUrl(url)) return url;
      }
    }
  }

  const nestedImage = source.image;
  if (nestedImage && typeof nestedImage === 'object') {
    const record = nestedImage as Record<string, unknown>;
    const url = record.url ?? record.src ?? record.mediaUrl;
    if (isHttpUrl(url)) return url;
  }

  return undefined;
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function parseEtaMinutes(value: unknown): number {
  if (typeof value === 'number') return Math.round(value);
  if (typeof value === 'string') {
    const match = value.match(/(\d+)/);
    if (match) return Number.parseInt(match[1], 10);
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return parseEtaMinutes(record.min ?? record.max ?? record.deliveryTime);
  }
  return 30;
}

function formatCuisines(value: unknown): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(' · ');
  if (typeof value === 'string' && value.length > 0) return value;
  return 'Restaurant';
}

function formatPriceForOne(value: unknown): number {
  if (typeof value === 'number') return Math.round(value / 2);
  if (typeof value === 'string') {
    const match = value.match(/(\d+)/);
    if (match) return Math.round(Number.parseInt(match[1], 10) / 2);
  }
  return parseNumber(value, 200);
}

export function mapSwiggyRestaurant(restaurant: SwiggyRestaurant): Restaurant {
  const record = restaurant as Record<string, unknown>;
  const distanceKm = parseNumber(record.distanceKm, 0);
  const rating = parseNumber(record.rating ?? record.avgRating ?? record.customerScore, 0);
  const displayName = String(restaurant.name);

  return {
    id: restaurant.id,
    name: displayName,
    cuisine: formatCuisines(record.cuisines ?? record.cuisine ?? record.cuisineTypes),
    rating,
    etaMinutes: parseEtaMinutes(record.sla ?? record.deliveryTime ?? record.etaMinutes),
    priceForOne: formatPriceForOne(record.costForTwo ?? record.priceForOne ?? record.costForTwoString),
    imageUrl: extractSwiggyImageUrl(record),
    matchReason:
      distanceKm > 0
        ? `${distanceKm.toFixed(1)} km away · ${rating > 0 ? `${rating.toFixed(1)}★` : 'Open now'}`
        : 'Available for delivery near you',
  };
}

export function mapSwiggyMenuItem(
  item: SwiggyMenuItem,
  restaurant: { id: string; name: string },
): MenuItem {
  const record = item as Record<string, unknown>;
  const price = parseNumber(record.price ?? record.defaultPrice ?? record.finalPrice, 0);

  return {
    id: String(item.id),
    name: item.name,
    description:
      typeof record.description === 'string'
        ? record.description
        : typeof record.itemDescription === 'string'
          ? record.itemDescription
          : undefined,
    price,
    imageUrl: extractSwiggyImageUrl(record),
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    isVeg:
      record.isVeg === true ||
      record.veg === true ||
      (record.itemAttribute &&
        typeof record.itemAttribute === 'object' &&
        (record.itemAttribute as Record<string, unknown>).vegClassifier === 'VEG')
        ? true
        : undefined,
  };
}

export function isSwiggyImageHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return SWIGGY_IMAGE_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}
