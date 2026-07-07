'use client';

import { Progress } from '@/components/ui/progress';

const QUEUE = [
  'Scan nearby restaurants',
  'Estimate delivery times',
  'Optimize protein per rupee',
  'Balance macros',
  'Check yesterday meals',
  'Detect discounts',
  'Build meal timeline',
];

const REASONS = [
  'Highest protein nearby',
  '₹48 cheaper than yesterday',
  'Leaves budget for dinner',
  '18 minute delivery',
  'Restaurant rating improved this week',
];

export function AiConsole() {
  return (
    <aside className="space-y-4">
      <section className="bg-card rounded-xl p-4 ring-1 ring-white/6">
        <p className="text-xs font-semibold text-[#FC8019]">Nourish AI</p>
        <div className="mt-2 space-y-2">
          <p className="text-sm">
            Status: <span className="font-medium">Working</span>
          </p>
          <p className="text-muted-foreground text-sm">Current task: Finding dinner</p>
          <Progress value={82} className="h-1.5" />
          <p className="text-muted-foreground text-xs">82% · ~4s remaining</p>
        </div>
      </section>

      <section className="bg-card rounded-xl p-4 ring-1 ring-white/6">
        <p className="text-sm font-semibold">Queued tasks</p>
        <ul className="mt-3 space-y-2 text-sm">
          {QUEUE.map((item, index) => (
            <li key={item} className="flex items-start gap-2">
              <span className={index < QUEUE.length - 1 ? 'text-[#22C55E]' : 'text-[#FC8019]'}>
                {index < QUEUE.length - 1 ? '✓' : '…'}
              </span>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-card rounded-xl p-4 ring-1 ring-white/6">
        <p className="text-sm font-semibold">Why I picked this lunch</p>
        <ul className="text-muted-foreground mt-3 space-y-1.5 text-sm">
          {REASONS.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      </section>

      <section className="bg-card rounded-xl p-4 ring-1 ring-white/6">
        <p className="text-sm font-semibold">Meal approval</p>
        <p className="text-muted-foreground mt-2 text-sm">
          I have prepared today’s meals. Unless you change something, I will create the Swiggy
          cart.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-lg bg-[#FC8019] px-3 py-1.5 text-xs font-semibold text-[#141414]">
            Approve
          </button>
          <button className="bg-background text-muted-foreground rounded-lg px-3 py-1.5 text-xs ring-1 ring-white/10">
            Replace lunch
          </button>
          <button className="bg-background text-muted-foreground rounded-lg px-3 py-1.5 text-xs ring-1 ring-white/10">
            Start over
          </button>
        </div>
      </section>
    </aside>
  );
}
