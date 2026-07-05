'use client';

import { useQuery } from '@tanstack/react-query';
import { MOCK_MACROS } from '@/constants/mock-data';
import type { MacroProgress } from '@/types';

/**
 * Placeholder hook demonstrating the React Query wiring. Replace the mock
 * resolver with a call into services/ once nutrition tracking is built.
 */
export function useNutritionSummary() {
  return useQuery<MacroProgress>({
    queryKey: ['nutrition-summary'],
    queryFn: async () => MOCK_MACROS,
  });
}
