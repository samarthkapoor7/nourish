'use client';

import Image from 'next/image';
import { Star, Timer, MapPin, Plus, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MOCK_MEAL_RECOMMENDATIONS } from '@/constants/mock-data';
import type { MealRecommendation } from '@/types';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';
import { cn } from '@/lib/utils';

function HealthScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? 'text-[#22C55E]' : score >= 75 ? 'text-[#FC8019]' : 'text-[#EF4444]';
  return (
    <span className={cn('flex items-center gap-1.5 text-xs font-medium', color)}>
      <span className={cn('size-2 rounded-full', score >= 90 ? 'bg-[#22C55E]' : score >= 75 ? 'bg-[#FC8019]' : 'bg-[#EF4444]')} />
      Health Score {score}
    </span>
  );
}

function MealRecommendationCard({ meal }: { meal: MealRecommendation }) {
  return (
    <article className="dashboard-card-lift group overflow-hidden transition-transform duration-300 hover:[transform:perspective(800px)_rotateY(-2deg)_translateY(-4px)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={meal.imageUrl}
          alt={meal.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase',
              meal.isVeg ? 'bg-[#22C55E] text-black' : 'bg-[#EF4444] text-white',
            )}
          >
            {meal.isVeg ? 'Veg' : 'Non Veg'}
          </span>
        </div>
        <div className="absolute right-3 bottom-3 left-3">
          <p className="text-lg font-semibold text-white drop-shadow-lg">{meal.name}</p>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#252525]">
              <UtensilsCrossed className="text-muted-foreground size-3.5" />
            </div>
            <div>
              <p className="text-sm font-medium">{meal.restaurantName}</p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5">
                  <MapPin className="size-3" />
                  {meal.distanceKm} km
                </span>
                <span className="flex items-center gap-0.5">
                  <Timer className="size-3" />
                  {meal.etaMinutes} min
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="size-3.5 fill-[#FC8019] text-[#FC8019]" />
            {meal.rating.toFixed(1)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-[#252525] px-3 py-1">{formatCalories(meal.calories)}</span>
          <span className="rounded-full bg-[#252525] px-3 py-1">
            {formatGrams(meal.proteinGrams)} protein
          </span>
          <span className="rounded-full bg-[#252525] px-3 py-1 font-medium">
            {formatCurrency(meal.price)}
          </span>
        </div>

        <HealthScoreBadge score={meal.healthScore} />

        <Button
          className="w-full rounded-full bg-[#FC8019] font-semibold text-black transition-transform hover:scale-[1.02] hover:bg-[#FF9A3C]"
          onClick={() => toast.success(`${meal.name} added to today's plan!`)}
        >
          <Plus className="size-4" />
          Add to Today&apos;s Plan
        </Button>
      </div>
    </article>
  );
}

export function MealRecommendations() {
  return (
    <section className="animate-fade-in-up space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Meal Recommendations</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Curated for your macros, budget, and taste
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
        {MOCK_MEAL_RECOMMENDATIONS.map((meal) => (
          <MealRecommendationCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
}
