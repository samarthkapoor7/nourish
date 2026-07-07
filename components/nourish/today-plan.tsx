'use client';

import Image from 'next/image';
import { Check, Clock } from 'lucide-react';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { useSwiggyMenu, useSwiggyStatus } from '@/hooks/use-swiggy';
import type { SearchFilter } from '@/components/nourish/home-header';
import type { MealEntry, MenuItem } from '@/types';
import { cn } from '@/lib/utils';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

const MEAL_LABEL: Record<MealEntry['type'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};

type MealStatus = 'done' | 'next' | 'later';

const FILTER_TO_MENU_QUERY: Record<SearchFilter, string> = {
  all: 'healthy',
  'high-protein': 'high protein',
  'under-budget': 'value meal',
  vegetarian: 'veg',
  'quick-delivery': 'quick bite',
};

const SLOT_TYPES: MealEntry['type'][] = ['breakfast', 'lunch', 'snack', 'dinner'];
const SLOT_TIMES = ['08:00', '13:00', '16:30', '20:00'];

function mapMenuToTodayPlan(items: MenuItem[]): MealEntry[] {
  return items.slice(0, 4).map((item, index) => ({
    id: `today-${item.restaurantId}-${item.id}-${index}`,
    type: SLOT_TYPES[index] ?? 'dinner',
    title: item.name,
    restaurantName: item.restaurantName,
    calories: 280 + index * 90,
    proteinGrams: 22 + index * 6,
    price: item.price,
    scheduledAt: SLOT_TIMES[index] ?? '20:00',
    ordered: index < 2,
    imageUrl: item.imageUrl,
  }));
}

function getStatus(meals: MealEntry[], index: number): MealStatus {
  const nextIndex = meals.findIndex((m) => !m.ordered);
  if (meals[index].ordered) return 'done';
  if (index === nextIndex) return 'next';
  return 'later';
}

function StatusBadge({ status, type }: { status: MealStatus; type: MealEntry['type'] }) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#22C55E]">
        <Check className="size-3.5" />
        Done
      </span>
    );
  }
  if (status === 'next') {
    return (
      <span className="rounded-md bg-[#FC8019]/15 px-2 py-0.5 text-xs font-semibold text-[#FC8019]">
        Up next · {MEAL_LABEL[type]}
      </span>
    );
  }
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
      <Clock className="size-3.5" />
      {MEAL_LABEL[type]}
    </span>
  );
}

interface TodayPlanProps {
  meals: MealEntry[];
  searchQuery: string;
  activeFilter: SearchFilter;
}

export function TodayPlan({ meals: fallbackMeals, searchQuery, activeFilter }: TodayPlanProps) {
  const statusQuery = useSwiggyStatus();
  const connected = statusQuery.data?.connected ?? false;
  const menuQueryValue = searchQuery.trim() || FILTER_TO_MENU_QUERY[activeFilter];
  const menuQuery = useSwiggyMenu(connected, menuQueryValue);

  if (statusQuery.isLoading || (connected && menuQuery.isLoading)) {
    return <CardSkeleton />;
  }

  const liveMeals =
    connected && !menuQuery.isError ? mapMenuToTodayPlan(menuQuery.data?.items ?? []) : [];
  const meals = liveMeals.length > 0 ? liveMeals : fallbackMeals;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Today&apos;s plan</h2>
        <p className="text-muted-foreground text-sm">
          {meals.length} meals scheduled {connected ? '· live from Swiggy' : '· using saved plan'}
        </p>
      </div>

      <div className="divide-y divide-white/6 overflow-hidden rounded-xl ring-1 ring-white/6">
        {meals.map((meal, index) => {
          const status = getStatus(meals, index);
          return (
            <article
              key={meal.id}
              className={cn(
                'bg-card flex gap-4 p-4 transition-colors',
                status === 'next' && 'bg-[#FC8019]/[0.04]',
              )}
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                {meal.imageUrl ? (
                  <Image
                    src={meal.imageUrl}
                    alt={meal.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized
                  />
                ) : (
                  <div className="bg-muted size-full" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{meal.title}</p>
                    <p className="text-muted-foreground mt-0.5 truncate text-sm">
                      {meal.restaurantName} · {meal.scheduledAt}
                    </p>
                  </div>
                  <StatusBadge status={status} type={meal.type} />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  {formatGrams(meal.proteinGrams)} protein · {formatCalories(meal.calories)} ·{' '}
                  {formatCurrency(meal.price)}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
