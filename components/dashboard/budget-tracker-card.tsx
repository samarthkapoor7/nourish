import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { BudgetTarget } from '@/types';
import { formatCurrency } from '@/utils/format';

export function BudgetTrackerCard({ budget }: { budget: BudgetTarget }) {
  const percent = Math.min(100, Math.round((budget.spent / budget.dailyLimit) * 100));
  const remaining = budget.dailyLimit - budget.spent;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">Budget Tracker</CardTitle>
        <Wallet className="text-primary size-4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">
            {formatCurrency(budget.spent, budget.currency)}
          </span>
          <span className="text-muted-foreground text-sm">
            / {formatCurrency(budget.dailyLimit, budget.currency)}
          </span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-muted-foreground text-xs">
          {formatCurrency(Math.max(remaining, 0), budget.currency)} left today
        </p>
      </CardContent>
    </Card>
  );
}
