'use client';

import { Progress } from '@/components/ui/progress';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useBudgetSummary } from '@/hooks/use-budget-summary';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

export function DailyStats() {
  const nutrition = useNutritionSummary();
  const budget = useBudgetSummary();

  if (nutrition.isLoading || budget.isLoading) return <CardSkeleton />;
  if (nutrition.isError || !nutrition.data)
    return <ErrorState onRetry={() => nutrition.refetch()} />;
  if (budget.isError || !budget.data) return <ErrorState onRetry={() => budget.refetch()} />;

  const macros = nutrition.data;
  const budgetData = budget.data;

  const items = [
    {
      label: 'Calories',
      value: macros.consumedCalories,
      target: macros.calories,
      display: formatCalories(macros.consumedCalories),
      targetDisplay: formatCalories(macros.calories),
      remaining: formatCalories(Math.max(0, macros.calories - macros.consumedCalories)),
    },
    {
      label: 'Protein',
      value: macros.consumedProteinGrams,
      target: macros.proteinGrams,
      display: formatGrams(macros.consumedProteinGrams),
      targetDisplay: formatGrams(macros.proteinGrams),
      remaining: formatGrams(Math.max(0, macros.proteinGrams - macros.consumedProteinGrams)),
    },
    {
      label: 'Budget',
      value: budgetData.spent,
      target: budgetData.dailyLimit,
      display: formatCurrency(budgetData.spent),
      targetDisplay: formatCurrency(budgetData.dailyLimit),
      remaining: formatCurrency(Math.max(0, budgetData.dailyLimit - budgetData.spent)),
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => {
        const pct = item.target > 0 ? Math.min(100, Math.round((item.value / item.target) * 100)) : 0;
        return (
          <div key={item.label} className="bg-card rounded-xl p-4 ring-1 ring-white/6">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium">{item.label}</p>
              <p className="text-xs font-medium tabular-nums">{pct}%</p>
            </div>
            <p className="mt-2 text-xl font-semibold tabular-nums">
              {item.display}
              <span className="text-muted-foreground text-sm font-normal"> / {item.targetDisplay}</span>
            </p>
            <Progress value={pct} className="mt-3 h-1.5" />
            <p className="text-muted-foreground mt-2 text-xs">{item.remaining} left</p>
          </div>
        );
      })}
    </section>
  );
}
