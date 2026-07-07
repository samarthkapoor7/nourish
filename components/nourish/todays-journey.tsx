'use client';

import Image from 'next/image';
import { Check, Clock, Flame, Timer } from 'lucide-react';
import type { MealEntry } from '@/types';
import { cn } from '@/lib/utils';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

const MEAL_LABEL: Record<MealEntry['type'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};

type JourneyStatus = 'completed' | 'current' | 'upcoming';

function getStatus(meals: MealEntry[], index: number): JourneyStatus {
  const firstIncomplete = meals.findIndex((m) => !m.ordered);
  if (meals[index].ordered) return 'completed';
  if (index === firstIncomplete) return 'current';
  return 'upcoming';
}

function MealTile({ meal, status }: { meal: MealEntry; status: JourneyStatus }) {
  return (
    <article
      className={cn(
        'nourish-glass group relative overflow-hidden rounded-[24px] transition-all duration-500',
        status === 'current' &&
          'shadow-[0_0_60px_rgba(252,128,25,0.15)] ring-1 ring-[#FC8019]/30',
        status === 'upcoming' && 'opacity-60 blur-[0.5px] saturate-75',
        status === 'completed' && 'opacity-90',
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {meal.imageUrl ? (
          <Image
            src={meal.imageUrl}
            alt={meal.title}
            fill
            className={cn(
              'object-cover transition-transform duration-700 group-hover:scale-105',
              status === 'upcoming' && 'scale-105 blur-sm',
            )}
            sizes="(max-width: 768px) 100vw, 640px"
            unoptimized
          />
        ) : (
          <div className="bg-[#202020] flex size-full items-center justify-center" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          {status === 'completed' && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#22C55E]/20 px-3 py-1 text-xs font-medium text-[#22C55E] backdrop-blur-md">
              <Check className="size-3" strokeWidth={3} />
              {MEAL_LABEL[meal.type]}
            </span>
          )}
          {status === 'current' && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#FC8019]/25 px-3 py-1 text-xs font-medium text-[#FC8019] backdrop-blur-md">
              <Flame className="size-3" />
              {MEAL_LABEL[meal.type]}
            </span>
          )}
          {status === 'upcoming' && (
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <Clock className="size-3" />
              {MEAL_LABEL[meal.type]}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-snug">{meal.title}</h3>
            <p className="text-muted-foreground mt-0.5 text-sm">{meal.restaurantName}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium">
            {meal.scheduledAt}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-white/80">{formatGrams(meal.proteinGrams)} protein</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-white/80">{formatCalories(meal.calories)}</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-medium">{formatCurrency(meal.price)}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Timer className="size-3.5" />
            25 min
          </span>
        </div>
      </div>
    </article>
  );
}

export function TodaysJourney({ meals }: { meals: MealEntry[] }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Today&apos;s Journey</h2>
        <p className="text-muted-foreground mt-1 text-sm">Your meals, guided through the day</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        {meals.map((meal, index) => (
          <MealTile key={meal.id} meal={meal} status={getStatus(meals, index)} />
        ))}
      </div>
    </section>
  );
}
