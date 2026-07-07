'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, ChevronDown, UtensilsCrossed } from 'lucide-react';
import type { MealEntry } from '@/types';
import { cn } from '@/lib/utils';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

const MEAL_TYPE_LABEL: Record<MealEntry['type'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};

type MealStatus = 'completed' | 'current' | 'upcoming';

function getMealStatus(meals: MealEntry[], index: number): MealStatus {
  const firstIncomplete = meals.findIndex((m) => !m.ordered);
  if (meals[index].ordered) return 'completed';
  if (index === firstIncomplete) return 'current';
  return 'upcoming';
}

function StatusDot({ status }: { status: MealStatus }) {
  if (status === 'completed') {
    return (
      <span className="flex size-7 items-center justify-center rounded-full bg-[#22C55E]/20 text-[#22C55E]">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (status === 'current') {
    return (
      <span className="relative flex size-7 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#FC8019]/40" />
        <span className="relative size-4 rounded-full bg-[#FC8019]" />
      </span>
    );
  }
  return <span className="size-4 rounded-full border-2 border-white/20 bg-transparent" />;
}

function MealRow({ meal, status }: { meal: MealEntry; status: MealStatus }) {
  const [expanded, setExpanded] = useState(status === 'current');

  return (
    <li className="relative">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'group w-full rounded-2xl p-4 text-left transition-all duration-300',
          status === 'current'
            ? 'bg-[#FC8019]/10 shadow-[0_0_24px_rgba(252,128,25,0.1)]'
            : 'hover:bg-[#202020]',
        )}
      >
        <div className="flex items-center gap-4">
          <StatusDot status={status} />
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
            {meal.imageUrl ? (
              <Image
                src={meal.imageUrl}
                alt={meal.title}
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex size-full items-center justify-center">
                <UtensilsCrossed className="size-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium">{meal.title}</p>
              <ChevronDown
                className={cn(
                  'text-muted-foreground size-4 shrink-0 transition-transform',
                  expanded && 'rotate-180',
                )}
              />
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {meal.restaurantName} · {meal.scheduledAt}
            </p>
          </div>
          <div className="hidden shrink-0 text-right text-xs sm:block">
            <p className="font-medium">{formatGrams(meal.proteinGrams)}</p>
            <p className="text-muted-foreground">{formatCalories(meal.calories)}</p>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 ml-11 space-y-2 border-t border-white/5 pt-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-[#252525] px-3 py-1">
                {MEAL_TYPE_LABEL[meal.type]}
              </span>
              <span className="text-muted-foreground">{formatCalories(meal.calories)}</span>
              <span className="text-muted-foreground">{formatGrams(meal.proteinGrams)} protein</span>
              <span className="font-medium">{formatCurrency(meal.price)}</span>
            </div>
            <p className="text-muted-foreground text-xs">
              {status === 'completed'
                ? 'Delivered and logged to your nutrition tracker.'
                : status === 'current'
                  ? 'Up next — tap to order when ready.'
                  : 'Scheduled for later today.'}
            </p>
          </div>
        )}
      </button>
    </li>
  );
}

export function ActivityTimeline({ meals }: { meals: MealEntry[] }) {
  return (
    <section className="dashboard-card animate-fade-in-up stagger-3 p-6">
      <h2 className="text-muted-foreground mb-6 text-sm font-medium tracking-wide uppercase">
        Today&apos;s Timeline
      </h2>
      <ol className="relative space-y-1">
        <div className="absolute top-4 bottom-4 left-[13px] w-px bg-gradient-to-b from-[#22C55E] via-[#FC8019] to-white/10" />
        {meals.map((meal, index) => (
          <MealRow key={meal.id} meal={meal} status={getMealStatus(meals, index)} />
        ))}
      </ol>
    </section>
  );
}
