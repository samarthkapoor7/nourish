'use client';

import { useBudgetSummary } from '@/hooks/use-budget-summary';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { formatCalories, formatGrams } from '@/utils/format';

export function NutritionGuide() {
  const nutrition = useNutritionSummary();
  const budget = useBudgetSummary();

  const remainingProtein = Math.max(
    0,
    (nutrition.data?.proteinGrams ?? 160) - (nutrition.data?.consumedProteinGrams ?? 0),
  );
  const remainingCalories = Math.max(
    0,
    (nutrition.data?.calories ?? 2200) - (nutrition.data?.consumedCalories ?? 0),
  );
  const remainingBudget = Math.max(0, (budget.data?.dailyLimit ?? 500) - (budget.data?.spent ?? 0));

  return (
    <section className="bg-card rounded-xl p-5 ring-1 ring-white/6">
      <h3 className="text-sm font-semibold">Your nutrition guide</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        You still need {formatGrams(remainingProtein)} and {formatCalories(remainingCalories)} today.
      </p>
      <p className="text-muted-foreground mt-1 text-sm">
        Dinner has been optimized to help you hit both while keeping ₹{remainingBudget} in budget.
      </p>
    </section>
  );
}
