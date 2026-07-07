'use client';

import { Sparkles, Check, Dumbbell, Flame } from 'lucide-react';

const COACH_MESSAGE =
  "Today's lunch was already protein heavy, so dinner focuses on complex carbs while staying inside your budget.";

const STILL_NEED = [
  { label: '68g protein', Icon: Dumbbell },
  { label: '720 kcal', Icon: Flame },
];

const RECOMMENDATIONS = ['Paneer Tikka Bowl', 'Greek Yogurt', 'Protein Shake'];

export function AiCoachCard() {
  return (
    <section className="dashboard-card orange-glow animate-fade-in-up stagger-4 relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FC8019]/10 via-transparent to-[#FC8019]/5" />
      <div className="relative space-y-5">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#FC8019]/20">
            <Sparkles className="text-[#FC8019] size-4" />
          </div>
          <h2 className="text-base font-semibold">AI Nutrition Coach</h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-[#0f0f0f]/60 p-4">
            <p className="text-sm leading-relaxed">{COACH_MESSAGE}</p>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              You still need
            </p>
            <div className="flex flex-wrap gap-2">
              {STILL_NEED.map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-1.5 rounded-full bg-[#252525] px-3 py-1.5 text-sm"
                >
                  <item.Icon className="text-[#FC8019] size-3.5" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Recommended
            </p>
            <ul className="space-y-2">
              {RECOMMENDATIONS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-[#252525]/80 px-4 py-2.5 text-sm transition-colors hover:bg-[#2a2a2a]"
                >
                  <Check className="text-[#22C55E] size-3.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
