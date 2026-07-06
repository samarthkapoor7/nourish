'use client';

import { Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { formatGrams } from '@/utils/format';

export function ProteinProgressCard() {
  const { data, isLoading, isError, refetch } = useNutritionSummary();

  if (isLoading) return <CardSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const percent = Math.min(
    100,
    Math.round((data.consumedProteinGrams / data.proteinGrams) * 100),
  );

  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Protein Progress
        </CardTitle>
        <Dumbbell className="text-primary size-4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">
            {formatGrams(data.consumedProteinGrams)}
          </span>
          <span className="text-muted-foreground text-sm">
            / {formatGrams(data.proteinGrams)}
          </span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-muted-foreground text-xs">{percent}% of daily target</p>
      </CardContent>
    </Card>
  );
}
