'use client';

import Image from 'next/image';
import { Plus, Star, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_MEAL_RECOMMENDATIONS } from '@/constants/mock-data';
import type { MealRecommendation } from '@/types';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';
import { cn } from '@/lib/utils';

function MealCard({ meal }: { meal: MealRecommendation }) {
  return (
    <article className="nourish-glass group overflow-hidden rounded-[20px] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={meal.imageUrl}
          alt={meal.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={cn(
              'rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              meal.isVeg ? 'bg-[#22C55E] text-black' : 'bg-white/90 text-black',
            )}
          >
            {meal.isVeg ? 'Veg' : 'Non Veg'}
          </span>
          <span className="rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
            Score {meal.healthScore}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">{meal.restaurantName}</span>
              <span className="flex items-center gap-0.5 text-xs">
                <Star className="size-3 fill-[#FC8019] text-[#FC8019]" />
                {meal.rating.toFixed(1)}
              </span>
            </div>
            <h3 className="mt-1 text-lg font-semibold leading-snug">{meal.name}</h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
          <span>{formatCalories(meal.calories)}</span>
          <span className="text-white/25">·</span>
          <span>{formatGrams(meal.proteinGrams)} protein</span>
          <span className="text-white/25">·</span>
          <span className="font-medium text-white">{formatCurrency(meal.price)}</span>
          <span className="text-white/25">·</span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Timer className="size-3.5" />
            {meal.etaMinutes} min
          </span>
        </div>

        <button
          type="button"
          onClick={() => toast.success(`${meal.name} added to your plan`)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FC8019] py-2.5 text-sm font-semibold text-[#0B0B0B] transition-all hover:bg-[#FF9A3C]"
        >
          <Plus className="size-4" />
          Add to Today
        </button>
      </div>
    </article>
  );
}

export function RecommendedMeals() {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recommended Meals</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Curated for your macros, budget, and taste
          </p>
        </div>
        <button
          type="button"
          className="text-muted-foreground hidden text-sm font-medium transition-colors hover:text-[#FC8019] sm:block"
        >
          See all
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_MEAL_RECOMMENDATIONS.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
}
