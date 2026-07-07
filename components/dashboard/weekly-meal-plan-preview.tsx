'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_WEEKLY_MEAL_PLAN } from '@/constants/mock-data';
import { formatCurrency, formatGrams } from '@/utils/format';
import { cn } from '@/lib/utils';

export function WeeklyMealPlanPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  return (
    <section className="animate-fade-in-up space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Weekly Meal Plan</h2>
          <p className="text-muted-foreground mt-1 text-sm">Swipe through your week</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="flex size-9 items-center justify-center rounded-full bg-[#252525] transition-colors hover:bg-[#303030]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="flex size-9 items-center justify-center rounded-full bg-[#252525] transition-colors hover:bg-[#303030]"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MOCK_WEEKLY_MEAL_PLAN.map((day) => (
          <div
            key={day.day}
            className={cn(
              'dashboard-card w-72 shrink-0 p-5',
              day.isToday && 'ring-2 ring-[#FC8019]/40',
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className={cn('font-semibold', day.isToday && 'text-[#FC8019]')}>{day.day}</p>
                <p className="text-muted-foreground text-xs">{day.date}</p>
              </div>
              {day.isToday && (
                <span className="rounded-full bg-[#FC8019]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#FC8019] uppercase">
                  Today
                </span>
              )}
            </div>

            <div className="space-y-3">
              {[
                { label: 'Breakfast', meal: day.breakfast },
                { label: 'Lunch', meal: day.lunch },
                { label: 'Dinner', meal: day.dinner },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-[#0f0f0f]/60 px-3 py-2.5">
                  <p className="text-muted-foreground text-[10px] font-medium uppercase">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm">{item.meal || '—'}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
              <span className="text-muted-foreground">
                {day.proteinGrams > 0 ? formatGrams(day.proteinGrams) : '—'} protein
              </span>
              <span className="font-medium">
                {day.budget > 0 ? formatCurrency(day.budget) : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
