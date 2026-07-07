'use client';

import { ArrowRightLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const COACH_TEXT = [
  'Lunch already covered most of your carbs.',
  "Tonight I'll recommend something lighter with 35g protein.",
  "You'll finish exactly inside your ₹500 budget.",
];

const SUGGESTED = [
  { name: 'Paneer Tikka Bowl', restaurant: 'The Green Bowl', protein: '34g' },
  { name: 'Grilled Fish Plate', restaurant: 'MealFit Kitchen', protein: '42g' },
  { name: 'Greek Yogurt Parfait', restaurant: 'Snack Lab', protein: '28g' },
];

export function AiCoachSection({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="relative">
      <div className="nourish-glass-orange animate-pulse-glow absolute -inset-4 rounded-[32px] opacity-50 blur-2xl" />
      <div className="nourish-glass-orange relative overflow-hidden rounded-[28px] p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 size-60 rounded-full bg-[#FC8019]/20 blur-3xl" />

        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#FC8019]/20">
              <Sparkles className="text-[#FC8019] size-5" />
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">AI Coach</h2>
          </div>

          <div className="space-y-3">
            {COACH_TEXT.map((line) => (
              <p key={line} className="text-base leading-relaxed text-white/85 sm:text-lg">
                {line}
              </p>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Suggested for tonight
            </p>
            {SUGGESTED.map((meal) => (
              <button
                key={meal.name}
                type="button"
                onClick={() => toast.success(`Replaced with ${meal.name}`)}
                className="group flex w-full items-center justify-between rounded-2xl bg-[#0B0B0B]/50 px-5 py-4 text-left transition-all duration-300 hover:bg-[#0B0B0B]/80 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] active:scale-[0.99]"
              >
                <div>
                  <p className="font-medium">{meal.name}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {meal.restaurant} · {meal.protein} protein
                  </p>
                </div>
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRightLeft className="size-3.5" />
                  Replace
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
