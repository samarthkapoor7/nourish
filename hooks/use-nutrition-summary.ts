'use client';

import { useQuery } from '@tanstack/react-query';
import { MOCK_MACROS } from '@/constants/mock-data';
import { useUserSettings } from '@/hooks/use-user-settings';
import type { MacroProgress } from '@/types';

/**
 * Placeholder hook demonstrating the React Query wiring. Replace the mock
 * resolver with a call into services/ once nutrition tracking is built.
 */
export function useNutritionSummary() {
  const { goals } = useUserSettings();

  return useQuery<MacroProgress>({
    queryKey: ['nutrition-summary', goals.dailyCalories, goals.dailyProtein],
    queryFn: async () => ({
      ...MOCK_MACROS,
      calories: goals.dailyCalories,
      proteinGrams: goals.dailyProtein,
    }),
  });
}
