import { Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { MacroProgress } from '@/types';
import { formatGrams } from '@/utils/format';

export function ProteinProgressCard({ macros }: { macros: MacroProgress }) {
  const percent = Math.min(
    100,
    Math.round((macros.consumedProteinGrams / macros.proteinGrams) * 100),
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
            {formatGrams(macros.consumedProteinGrams)}
          </span>
          <span className="text-muted-foreground text-sm">
            / {formatGrams(macros.proteinGrams)}
          </span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-muted-foreground text-xs">{percent}% of daily target</p>
      </CardContent>
    </Card>
  );
}
