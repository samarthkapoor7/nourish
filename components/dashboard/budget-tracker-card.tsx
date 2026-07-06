'use client';

import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useBudgetSummary } from '@/hooks/use-budget-summary';
import { formatCurrency } from '@/utils/format';

export function BudgetTrackerCard() {
  const { data, isLoading, isError, refetch } = useBudgetSummary();

  if (isLoading) return <CardSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const percent = Math.min(100, Math.round((data.spent / data.dailyLimit) * 100));
  const remaining = data.dailyLimit - data.spent;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">Budget Tracker</CardTitle>
        <Wallet className="text-primary size-4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">
            {formatCurrency(data.spent, data.currency)}
          </span>
          <span className="text-muted-foreground text-sm">
            / {formatCurrency(data.dailyLimit, data.currency)}
          </span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-muted-foreground text-xs">
          {formatCurrency(Math.max(remaining, 0), data.currency)} left today
        </p>
      </CardContent>
    </Card>
  );
}
