import type { Restaurant } from '@/types';

export interface SwiggySearchParams {
  latitude: number;
  longitude: number;
  query?: string;
  maxPrice?: number;
}

export interface SwiggyMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  calories?: number;
  proteinGrams?: number;
  isVeg: boolean;
}

export interface SwiggyRestaurantResult extends Restaurant {
  menu: SwiggyMenuItem[];
}

export interface SwiggyOrderRequest {
  restaurantId: string;
  itemIds: string[];
  deliveryAddressId: string;
}

export interface SwiggyOrderResult {
  orderId: string;
  status: 'placed' | 'failed';
  etaMinutes?: number;
}
