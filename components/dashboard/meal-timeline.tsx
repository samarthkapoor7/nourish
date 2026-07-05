import { Check, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MealEntry } from '@/types';
import { cn } from '@/lib/utils';
import { formatCalories, formatCurrency } from '@/utils/format';

const MEAL_TYPE_LABEL: Record<MealEntry['type'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};

export function MealTimeline({ meals }: { meals: MealEntry[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">Meal Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {meals.map((meal) => (
            <li key={meal.id} className="flex items-start gap-4">
              <span
                className={cn(
                  'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border',
                  meal.ordered
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground',
                )}
              >
                {meal.ordered ? <Check className="size-4" /> : <Clock className="size-4" />}
              </span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{meal.title}</p>
                  <Badge variant="secondary" className="shrink-0">
                    {MEAL_TYPE_LABEL[meal.type]}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  {meal.restaurantName} · {meal.scheduledAt} · {formatCalories(meal.calories)} ·{' '}
                  {formatCurrency(meal.price)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
