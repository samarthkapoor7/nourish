'use client';

import { useState } from 'react';
import { MOCK_WEEK, MOCK_WEEKLY_MEAL_PLAN } from '@/constants/mock-data';
import { cn } from '@/lib/utils';
import { formatCurrency, formatGrams } from '@/utils/format';

export function WeekOverview() {
  const [selected, setSelected] = useState(MOCK_WEEK.findIndex((d) => d.isToday) ?? 5);
  const day = MOCK_WEEKLY_MEAL_PLAN[selected];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">This week</h2>
        <p className="text-muted-foreground text-sm">Tap a day to view meals</p>
      </div>

      <div className="bg-card overflow-hidden rounded-xl ring-1 ring-white/6">
        <div className="grid grid-cols-7 divide-x divide-white/6 border-b border-white/6">
          {MOCK_WEEK.map((item, index) => {
            const pct =
              item.targetCalories > 0
                ? Math.min(100, Math.round((item.calories / item.targetCalories) * 100))
                : 0;
            const active = index === selected;

            return (
              <button
                key={item.day}
                type="button"
                onClick={() => setSelected(index)}
                className={cn(
                  'px-2 py-3 text-center transition-colors hover:bg-white/[0.03]',
                  active && 'bg-white/[0.04]',
                )}
              >
                <p
                  className={cn(
                    'text-[11px] font-medium',
                    item.isToday ? 'text-[#FC8019]' : 'text-muted-foreground',
                  )}
                >
                  {item.day}
                </p>
                <p className="mt-1 text-sm font-semibold tabular-nums">{pct}%</p>
              </button>
            );
          })}
        </div>

        {day && (
          <div className="grid gap-4 p-4 sm:grid-cols-3">
            {[
              { label: 'Breakfast', value: day.breakfast },
              { label: 'Lunch', value: day.lunch },
              { label: 'Dinner', value: day.dinner },
            ].map((meal) => (
              <div key={meal.label}>
                <p className="text-muted-foreground text-xs">{meal.label}</p>
                <p className="mt-1 text-sm font-medium">{meal.value || '—'}</p>
              </div>
            ))}
            {day.proteinGrams > 0 && (
              <div className="text-muted-foreground col-span-full flex justify-between border-t border-white/6 pt-3 text-sm">
                <span>{formatGrams(day.proteinGrams)} protein</span>
                <span className="text-foreground font-medium">{formatCurrency(day.budget)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
