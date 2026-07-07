'use client';

import { Flame, IndianRupee, Dumbbell, TrendingUp, TrendingDown } from 'lucide-react';
import { CircularProgress } from '@/components/dashboard/circular-progress';
import { CountUp } from '@/components/dashboard/count-up';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { MOCK_YESTERDAY } from '@/constants/mock-data';
import { useBudgetSummary } from '@/hooks/use-budget-summary';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

function TrendBadge({
  current,
  previous,
  label,
  invert = false,
}: {
  current: number;
  previous: number;
  label: string;
  invert?: boolean;
}) {
  const diff = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
  const isPositive = invert ? diff < 0 : diff > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <p
      className={`flex items-center gap-1 text-xs ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}
    >
      <Icon className="size-3" />
      {Math.abs(diff)}% {label} than yesterday
    </p>
  );
}

export function NutritionProgressCard() {
  const nutrition = useNutritionSummary();
  const budget = useBudgetSummary();

  if (nutrition.isLoading || budget.isLoading) return <CardSkeleton />;
  if (nutrition.isError || !nutrition.data)
    return <ErrorState onRetry={() => nutrition.refetch()} />;
  if (budget.isError || !budget.data) return <ErrorState onRetry={() => budget.refetch()} />;

  const macros = nutrition.data;
  const budgetData = budget.data;

  const caloriePct = Math.min(100, Math.round((macros.consumedCalories / macros.calories) * 100));
  const proteinPct = Math.min(
    100,
    Math.round((macros.consumedProteinGrams / macros.proteinGrams) * 100),
  );
  const budgetPct = Math.min(100, Math.round((budgetData.spent / budgetData.dailyLimit) * 100));

  const calorieRemaining = macros.calories - macros.consumedCalories;
  const proteinRemaining = macros.proteinGrams - macros.consumedProteinGrams;
  const budgetRemaining = budgetData.dailyLimit - budgetData.spent;

  return (
    <section className="dashboard-card animate-fade-in-up stagger-2 p-6 sm:p-8">
      <h2 className="text-muted-foreground mb-8 text-sm font-medium tracking-wide uppercase">
        Today&apos;s Progress
      </h2>
      <div className="grid gap-10 sm:grid-cols-3">
        <div className="space-y-4 text-center sm:text-left">
          <CircularProgress
            value={caloriePct}
            icon={<Flame className="text-[#FC8019] mb-0.5 size-5" />}
            delay={100}
          />
          <div className="space-y-1">
            <p className="font-medium">Calories</p>
            <p className="text-lg font-semibold tabular-nums">
              <CountUp value={macros.consumedCalories} /> / {formatCalories(macros.calories)}
            </p>
            <p className="text-muted-foreground text-sm">
              {calorieRemaining > 0 ? `${formatCalories(calorieRemaining)} remaining` : 'Goal reached'}
            </p>
            <TrendBadge
              current={macros.consumedCalories}
              previous={MOCK_YESTERDAY.calories}
              label="better"
            />
          </div>
        </div>

        <div className="space-y-4 text-center sm:text-left">
          <CircularProgress
            value={proteinPct}
            icon={<Dumbbell className="text-[#FC8019] mb-0.5 size-5" />}
            delay={200}
          />
          <div className="space-y-1">
            <p className="font-medium">Protein</p>
            <p className="text-lg font-semibold tabular-nums">
              <CountUp value={macros.consumedProteinGrams} suffix="g" /> /{' '}
              {formatGrams(macros.proteinGrams)}
            </p>
            <p className="text-muted-foreground text-sm">
              {proteinRemaining > 0 ? `${formatGrams(proteinRemaining)} remaining` : 'Goal reached'}
            </p>
            <TrendBadge
              current={macros.consumedProteinGrams}
              previous={MOCK_YESTERDAY.proteinGrams}
              label="better"
            />
          </div>
        </div>

        <div className="space-y-4 text-center sm:text-left">
          <CircularProgress
            value={budgetPct}
            icon={<IndianRupee className="text-[#FC8019] mb-0.5 size-5" />}
            delay={300}
          />
          <div className="space-y-1">
            <p className="font-medium">Budget</p>
            <p className="text-lg font-semibold tabular-nums">
              <CountUp value={budgetData.spent} suffix="" /> /{' '}
              {formatCurrency(budgetData.dailyLimit)}
            </p>
            <p className="text-muted-foreground text-sm">
              {budgetRemaining > 0
                ? `${formatCurrency(budgetRemaining)} remaining`
                : 'Budget exceeded'}
            </p>
            <TrendBadge
              current={budgetData.spent}
              previous={MOCK_YESTERDAY.budgetSpent}
              label="better"
              invert
            />
          </div>
        </div>
      </div>
    </section>
  );
}
