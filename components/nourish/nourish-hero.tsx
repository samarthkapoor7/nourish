'use client';

import Image from 'next/image';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_MEALS } from '@/constants/mock-data';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { useUserSettings } from '@/hooks/use-user-settings';
import { formatCalories, formatGrams } from '@/utils/format';
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getNextMealPrompt(): { label: string; cta: string } {
  const hour = new Date().getHours();
  if (hour < 11) return { label: 'Ready for breakfast?', cta: 'Order Breakfast' };
  if (hour < 15) return { label: 'Ready for lunch?', cta: 'Order Lunch' };
  if (hour < 18) return { label: 'Time for a snack?', cta: 'Order Snack' };
  return { label: 'Ready for dinner?', cta: 'Order Dinner' };
}

function getCurrentMeal() {
  const firstIncomplete = MOCK_MEALS.find((m) => !m.ordered);
  return firstIncomplete ?? MOCK_MEALS[MOCK_MEALS.length - 1];
}

export function NourishHero() {
  const { settings, goals } = useUserSettings();
  const { data } = useNutritionSummary();
  const name = settings.name || 'Aryan';
  const prompt = getNextMealPrompt();
  const currentMeal = getCurrentMeal();

  const proteinRemaining = data
    ? Math.max(0, data.proteinGrams - data.consumedProteinGrams)
    : 68;

  const chips = [
    `${goals.dailyCalories.toLocaleString()} kcal`,
    `₹${goals.dailyBudget} budget`,
    `${goals.dailyProtein}g protein`,
    'Vegetarian',
  ];

  return (
    <section className="grid items-center gap-10 pb-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-6">
      <div className="space-y-7">
        <div className="space-y-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
            Your nutrition companion
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {getGreeting()}, {name}
          </h1>
          <p className="text-xl font-medium text-white/90 sm:text-2xl">{prompt.label}</p>
          <p className="text-muted-foreground max-w-lg text-base leading-relaxed">
            You still need{' '}
            <span className="text-gradient-orange font-semibold">
              {formatGrams(proteinRemaining)}
            </span>{' '}
            to hit today&apos;s goal. Here&apos;s what we recommend next.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => toast.success(`${prompt.cta} — coming soon`)}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-[#FC8019] px-6 py-3.5 text-sm font-semibold text-[#0B0B0B] shadow-[0_8px_32px_rgba(252,128,25,0.35)] transition-all duration-300 hover:bg-[#FF9A3C] hover:shadow-[0_12px_40px_rgba(252,128,25,0.45)]"
          >
            <ShoppingBag className="size-4" />
            {prompt.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            className="nourish-glass rounded-xl px-5 py-3.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            View full plan
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="nourish-chip text-muted-foreground">
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="nourish-glass relative overflow-hidden rounded-[24px]">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-[#FC8019]/15 blur-3xl" />
        <div className="relative grid sm:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-between gap-6 p-6 sm:p-7">
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                Up next
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-snug">{currentMeal.title}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{currentMeal.restaurantName}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{formatGrams(currentMeal.proteinGrams)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{formatCalories(currentMeal.calories)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">~25 min</span>
              </div>
            </div>
          </div>
          <div className="relative min-h-[200px] sm:min-h-[260px]">
            {currentMeal.imageUrl && (
              <Image
                src={currentMeal.imageUrl}
                alt={currentMeal.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#151515] via-transparent to-transparent sm:from-[#151515]/80" />
          </div>
        </div>
      </div>
    </section>
  );
}
