'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { CircularProgress } from '@/components/dashboard/circular-progress';
import { useBudgetSummary } from '@/hooks/use-budget-summary';
import { useNutritionSummary } from '@/hooks/use-nutrition-summary';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';
import { cn } from '@/lib/utils';

export function FloatingNutritionRing() {
  const [expanded, setExpanded] = useState(false);
  const { data: macros } = useNutritionSummary();
  const { data: budget } = useBudgetSummary();

  if (!macros || !budget) return null;

  const caloriePct = Math.round((macros.consumedCalories / macros.calories) * 100);
  const proteinPct = Math.round((macros.consumedProteinGrams / macros.proteinGrams) * 100);
  const budgetPct = Math.round((budget.spent / budget.dailyLimit) * 100);
  const overallPct = Math.round((caloriePct + proteinPct + (100 - budgetPct)) / 3);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="fixed right-6 bottom-6 z-50 flex size-16 items-center justify-center rounded-full bg-[#171717] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_24px_rgba(252,128,25,0.2)] transition-transform hover:scale-110 active:scale-95"
        aria-label="View today's nutrition stats"
      >
        <svg width={56} height={56} className="-rotate-90">
          <circle cx={28} cy={28} r={24} fill="none" stroke="white" strokeOpacity={0.08} strokeWidth={4} />
          <circle
            cx={28}
            cy={28}
            r={24}
            fill="none"
            stroke="#FC8019"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - overallPct / 100)}
            className="transition-[stroke-dashoffset] duration-1000"
          />
        </svg>
        <span className="absolute text-[11px] font-bold">{overallPct}%</span>
      </button>

      {expanded && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 sm:items-center sm:justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setExpanded(false)}
            aria-label="Close"
          />
          <div
            className={cn(
              'relative w-full max-w-sm rounded-[24px] bg-[#171717] p-6 shadow-2xl',
              'animate-fade-in-up',
            )}
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-[#252525] transition-colors hover:bg-[#303030]"
              aria-label="Close panel"
            >
              <X className="size-4" />
            </button>

            <h3 className="mb-6 text-lg font-semibold">Today&apos;s Completion</h3>

            <div className="mb-6 flex justify-center">
              <CircularProgress value={overallPct} size={140} strokeWidth={10} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-[#0f0f0f] px-4 py-3">
                <span className="text-muted-foreground text-sm">Calories</span>
                <span className="text-sm font-medium">
                  {formatCalories(macros.consumedCalories)} / {formatCalories(macros.calories)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#0f0f0f] px-4 py-3">
                <span className="text-muted-foreground text-sm">Protein</span>
                <span className="text-sm font-medium">
                  {formatGrams(macros.consumedProteinGrams)} / {formatGrams(macros.proteinGrams)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#0f0f0f] px-4 py-3">
                <span className="text-muted-foreground text-sm">Budget</span>
                <span className="text-sm font-medium">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.dailyLimit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
