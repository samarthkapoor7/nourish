'use client';

import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { formatCalories } from '@/utils/format';

export function CaloriesCard() {
  const { data, isLoading, isError, refetch } = useNutritionSummary();

  if (isLoading) return <CardSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const remaining = data.calories - data.consumedCalories;
  const percentConsumed = Math.min(100, Math.round((data.consumedCalories / data.calories) * 100));

  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Today&apos;s Calories
        </CardTitle>
        <Flame className="text-primary size-4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">
            {formatCalories(data.consumedCalories)}
          </span>
          <span className="text-muted-foreground text-sm">/ {formatCalories(data.calories)}</span>
        </div>
        <Progress value={percentConsumed} className="h-2" />
        <p className="text-muted-foreground text-xs">
          {remaining > 0 ? `${formatCalories(remaining)} remaining` : 'Goal reached'}
        </p>
      </CardContent>
    </Card>
  );
}
