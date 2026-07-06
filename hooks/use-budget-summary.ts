'use client';

import { useQuery } from '@tanstack/react-query';
import { MOCK_BUDGET } from '@/constants/mock-data';
import { useUserSettings } from '@/hooks/use-user-settings';
import type { BudgetTarget } from '@/types';

export function useBudgetSummary() {
  const { goals } = useUserSettings();

  return useQuery<BudgetTarget>({
    queryKey: ['budget-summary', goals.dailyBudget],
    queryFn: async () => ({
      ...MOCK_BUDGET,
      dailyLimit: goals.dailyBudget,
    }),
  });
}
