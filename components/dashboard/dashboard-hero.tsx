'use client';

import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { useUserSettings } from '@/hooks/use-user-settings';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardHero() {
  const { settings } = useUserSettings();
  const { data } = useNutritionSummary();

  const name = settings.name || 'Aryan';
  const caloriePct = data
    ? Math.round((data.consumedCalories / data.calories) * 100)
    : 65;
  const proteinPct = data
    ? Math.round((data.consumedProteinGrams / data.proteinGrams) * 100)
    : 61;
  const overallPct = Math.round((caloriePct + proteinPct) / 2);

  return (
    <section className="animate-fade-in-up stagger-1 relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1a1a1a] via-[#171717] to-[#0f0f0f] p-8 sm:p-10">
      <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {getGreeting()}, {name}
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl">
              You&apos;re{' '}
              <span className="text-gradient-orange font-semibold">{overallPct}%</span> towards
              today&apos;s nutrition goal.
            </p>
            <p className="text-muted-foreground text-sm">Keep this streak alive.</p>
          </div>
          <Button
            size="lg"
            className="h-14 rounded-full bg-[#FC8019] px-8 text-base font-semibold text-black shadow-[0_8px_32px_rgba(252,128,25,0.4)] transition-transform hover:scale-105 hover:bg-[#FF9A3C]"
            onClick={() => toast("Ordering isn't wired up yet — this is a placeholder.")}
          >
            <ShoppingBag className="size-5" />
            Order Today&apos;s Meals
          </Button>
        </div>

        <div className="relative hidden h-48 lg:block lg:h-56">
          <div className="animate-pulse-glow absolute top-1/2 right-0 size-56 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FC8019]/40 via-[#FF9A3C]/20 to-transparent blur-3xl" />
          <div className="absolute top-1/2 right-8 size-40 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#FC8019] to-[#FF6B00] opacity-80" />
          <div className="absolute top-1/2 right-16 size-24 -translate-y-1/2 rounded-full bg-gradient-to-bl from-[#FF9A3C]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
