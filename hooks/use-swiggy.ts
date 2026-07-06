'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MenuItem, Restaurant } from '@/types';

interface SwiggyAddressesResponse {
  addresses: { addressId: string; label: string }[];
  selectedAddressId: string | null;
}

interface SwiggyRestaurantsResponse {
  restaurants: Restaurant[];
  query: string;
}

interface SwiggyMenuResponse {
  items: MenuItem[];
  query: string;
  restaurantId?: string;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data.message === 'string' ? data.message : 'Failed to load Swiggy data.';
    const error = new Error(message) as Error & { code?: string };
    error.code = data.error;
    throw error;
  }

  return data as T;
}

export function useSwiggyStatus() {
  return useQuery({
    queryKey: ['swiggy', 'status'],
    queryFn: () => fetchJson<{ connected: boolean }>('/api/swiggy/status'),
  });
}

export function useSwiggyAddresses(enabled: boolean) {
  return useQuery({
    queryKey: ['swiggy', 'addresses'],
    queryFn: () => fetchJson<SwiggyAddressesResponse>('/api/swiggy?resource=addresses'),
    enabled,
  });
}

export function useSwiggyRestaurants(enabled: boolean, query?: string) {
  const params = new URLSearchParams({ resource: 'restaurants' });
  if (query) params.set('query', query);

  return useQuery({
    queryKey: ['swiggy', 'restaurants', query ?? 'default'],
    queryFn: () => fetchJson<SwiggyRestaurantsResponse>(`/api/swiggy?${params}`),
    enabled,
  });
}

export function useSwiggyMenu(enabled: boolean, query?: string, restaurantId?: string) {
  const params = new URLSearchParams({ resource: 'menu' });
  if (query) params.set('query', query);
  if (restaurantId) params.set('restaurantId', restaurantId);

  return useQuery({
    queryKey: ['swiggy', 'menu', query ?? 'default', restaurantId ?? 'all'],
    queryFn: () => fetchJson<SwiggyMenuResponse>(`/api/swiggy?${params}`),
    enabled,
  });
}

export function useSelectSwiggyAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      fetchJson<{ ok: boolean }>('/api/swiggy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swiggy'] });
    },
  });
}

export function useSwiggyLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchJson<{ ok: boolean }>('/api/swiggy/logout', {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swiggy'] });
    },
  });
}

export function isSwiggyReauthError(error: unknown): boolean {
  return (
    error instanceof Error &&
    'code' in error &&
    (error as Error & { code?: string }).code === 'reauth_required'
  );
}
