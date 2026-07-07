'use client';

import { useState } from 'react';
import { MOCK_WEEK, MOCK_WEEKLY_MEAL_PLAN } from '@/constants/mock-data';
import { FitnessRing } from '@/components/nourish/fitness-ring';
import { cn } from '@/lib/utils';
import { formatCurrency, formatGrams } from '@/utils/format';

export function WeeklyGoals() {
  const [selectedDay, setSelectedDay] = useState(
    MOCK_WEEK.findIndex((d) => d.isToday) ?? 5,
  );

  const selected = MOCK_WEEKLY_MEAL_PLAN[selectedDay];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Weekly Goals</h2>
        <p className="text-muted-foreground mt-1 text-sm">Your week at a glance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
        <div className="nourish-glass rounded-[24px] p-6">
          <p className="text-muted-foreground mb-5 text-xs font-semibold tracking-widest uppercase">
            This week
          </p>
          <div className="grid grid-cols-7 gap-2">
            {MOCK_WEEK.map((day, index) => {
              const pct =
                day.targetCalories > 0
                  ? Math.min(100, Math.round((day.calories / day.targetCalories) * 100))
                  : 0;
              const isSelected = index === selectedDay;
              const isFuture = day.mealsPlanned === 0 && !day.isToday;

              return (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => setSelectedDay(index)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl p-2 transition-all duration-300',
                    isSelected && 'bg-white/5',
                    !isFuture && 'hover:bg-white/[0.03]',
                  )}
                >
                  <FitnessRing
                    value={isFuture ? 0 : pct}
                    size={44}
                    strokeWidth={3.5}
                    gradientId={`week-${day.day}`}
                    delay={index * 40}
                  >
                    <span
                      className={cn(
                        'text-[9px] font-semibold',
                        day.isToday ? 'text-[#FC8019]' : 'text-white/70',
                      )}
                    >
                      {day.day.slice(0, 1)}
                    </span>
                  </FitnessRing>
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      day.isToday ? 'text-[#FC8019]' : 'text-muted-foreground',
                    )}
                  >
                    {day.day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selected && (
          <div className="nourish-glass rounded-[24px] p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selected.day}</h3>
                <p className="text-muted-foreground text-sm">{selected.date}</p>
              </div>
              {selected.isToday && (
                <span className="rounded-lg bg-[#FC8019]/15 px-3 py-1 text-xs font-semibold text-[#FC8019]">
                  Today
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Breakfast', value: selected.breakfast },
                { label: 'Lunch', value: selected.lunch },
                { label: 'Dinner', value: selected.dinner },
              ].map((meal) => (
                <div
                  key={meal.label}
                  className="rounded-xl bg-[#0B0B0B]/40 px-4 py-4"
                >
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    {meal.label}
                  </p>
                  <p className="mt-1.5 text-sm font-medium">{meal.value || 'Not planned'}</p>
                </div>
              ))}
            </div>

            {selected.proteinGrams > 0 && (
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-5 text-sm">
                <span className="text-muted-foreground">
                  {formatGrams(selected.proteinGrams)} protein
                </span>
                <span className="font-medium">{formatCurrency(selected.budget)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
