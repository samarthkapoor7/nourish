'use client';

import { FitnessRing } from '@/components/nourish/fitness-ring';
import { CountUp } from '@/components/dashboard/count-up';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useBudgetSummary } from '@/hooks/use-budget-summary';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

export function NutritionRings() {
  const nutrition = useNutritionSummary();
  const budget = useBudgetSummary();

  if (nutrition.isLoading || budget.isLoading) return <CardSkeleton />;
  if (nutrition.isError || !nutrition.data)
    return <ErrorState onRetry={() => nutrition.refetch()} />;
  if (budget.isError || !budget.data) return <ErrorState onRetry={() => budget.refetch()} />;

  const macros = nutrition.data;
  const budgetData = budget.data;

  const rings = [
    {
      id: 'ring-calories',
      label: 'Calories',
      value: Math.min(100, Math.round((macros.consumedCalories / macros.calories) * 100)),
      primary: macros.consumedCalories,
      secondary: macros.calories,
      format: (n: number) => formatCalories(n),
      story:
        macros.consumedCalories < macros.calories
          ? `${formatCalories(macros.calories - macros.consumedCalories)} left today`
          : 'Daily goal reached',
    },
    {
      id: 'ring-protein',
      label: 'Protein',
      value: Math.min(100, Math.round((macros.consumedProteinGrams / macros.proteinGrams) * 100)),
      primary: macros.consumedProteinGrams,
      secondary: macros.proteinGrams,
      format: (n: number) => formatGrams(n),
      story:
        macros.consumedProteinGrams < macros.proteinGrams
          ? 'One meal away from your protein goal'
          : 'Protein goal reached',
    },
    {
      id: 'ring-budget',
      label: 'Budget',
      value: Math.min(100, Math.round((budgetData.spent / budgetData.dailyLimit) * 100)),
      primary: budgetData.spent,
      secondary: budgetData.dailyLimit,
      format: (n: number) => formatCurrency(n),
      story:
        budgetData.spent < budgetData.dailyLimit
          ? `${formatCurrency(budgetData.dailyLimit - budgetData.spent)} remaining`
          : 'Budget limit reached',
    },
  ];

  return (
    <section className="nourish-glass rounded-[24px] p-6 sm:p-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nutrition Progress</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            You&apos;re on track — one more balanced meal closes the gap
          </p>
        </div>
      </div>

      <div className="grid gap-10 sm:grid-cols-3">
        {rings.map((ring, i) => (
          <div
            key={ring.id}
            className="flex flex-col items-center gap-4 sm:items-start sm:gap-5"
          >
            <FitnessRing
              value={ring.value}
              size={140}
              strokeWidth={10}
              gradientId={ring.id}
              delay={i * 120}
            >
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                {ring.label}
              </span>
              <span className="mt-1 text-2xl font-bold tabular-nums">
                <CountUp value={ring.primary} />
              </span>
              <span className="text-muted-foreground text-xs">of {ring.format(ring.secondary)}</span>
            </FitnessRing>
            <p className="text-muted-foreground max-w-[200px] text-center text-sm leading-relaxed sm:text-left">
              {ring.story}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
