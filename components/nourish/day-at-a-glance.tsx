'use client';

import { useBudgetSummary } from '@/hooks/use-budget-summary';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

export function DayAtAGlance() {
  const nutrition = useNutritionSummary();
  const budget = useBudgetSummary();

  const caloriesTarget = nutrition.data?.calories ?? 2200;
  const proteinTarget = nutrition.data?.proteinGrams ?? 160;
  const budgetTarget = budget.data?.dailyLimit ?? 500;
  const caloriesDone = nutrition.data?.consumedCalories ?? 0;
  const progressPct = Math.min(100, Math.round((caloriesDone / caloriesTarget) * 100));

  return (
    <section className="bg-card rounded-xl p-5 ring-1 ring-white/6">
      <h2 className="text-lg font-semibold">Your day at a glance</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-muted-foreground text-xs">Calories target</p>
          <p className="mt-1 text-sm font-semibold">{formatCalories(caloriesTarget)}</p>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-muted-foreground text-xs">Protein target</p>
          <p className="mt-1 text-sm font-semibold">{formatGrams(proteinTarget)}</p>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-muted-foreground text-xs">Budget</p>
          <p className="mt-1 text-sm font-semibold">{formatCurrency(budgetTarget)}</p>
        </div>
        <div className="rounded-lg bg-[#22C55E]/10 p-3">
          <p className="text-xs text-[#22C55E]">Status</p>
          <p className="mt-1 text-sm font-semibold text-[#22C55E]">Plan ready</p>
        </div>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        You&apos;re {progressPct}% of the way to today&apos;s nutrition goal.
      </p>
    </section>
  );
}
