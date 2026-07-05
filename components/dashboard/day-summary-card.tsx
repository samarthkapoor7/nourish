import { Progress } from '@/components/ui/progress';
import type { MockDaySummary } from '@/constants/mock-data';
import { cn } from '@/lib/utils';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

export function DaySummaryCard({ day }: { day: MockDaySummary }) {
  const percent =
    day.targetCalories > 0
      ? Math.min(100, Math.round((day.calories / day.targetCalories) * 100))
      : 0;

  return (
    <div
      className={cn(
        'border-border/60 flex flex-col gap-3 rounded-2xl border p-4',
        day.isToday && 'border-primary/50 bg-primary/5',
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{day.day}</p>
          <p className="text-muted-foreground text-xs">{day.date}</p>
        </div>
        {day.isToday && (
          <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium">
            Today
          </span>
        )}
      </div>

      {day.mealsPlanned > 0 ? (
        <>
          <div>
            <p className="text-lg font-semibold tracking-tight">{formatCalories(day.calories)}</p>
            <Progress value={percent} className="mt-1.5 h-1.5" />
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>{formatGrams(day.proteinGrams)} protein</span>
            <span>{formatCurrency(day.spent)}</span>
          </div>
          <p className="text-muted-foreground text-xs">{day.mealsPlanned} meals planned</p>
        </>
      ) : (
        <p className="text-muted-foreground text-xs">No meals planned yet</p>
      )}
    </div>
  );
}
