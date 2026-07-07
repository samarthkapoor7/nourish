'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentEvent {
  id: string;
  time: string;
  text: string;
  status: 'done' | 'working';
}

const STREAM_EVENTS: AgentEvent[] = [
  { id: 'e1', time: '09:00', text: 'Loaded your nutrition goals', status: 'done' },
  { id: 'e2', time: '09:00', text: 'Checked calorie and protein targets', status: 'done' },
  { id: 'e3', time: '09:00', text: 'Scanning nearby restaurant availability', status: 'done' },
  { id: 'e4', time: '09:01', text: 'Compared 437 dishes', status: 'done' },
  { id: 'e5', time: '09:01', text: 'Rejected 312 dishes (low protein)', status: 'done' },
  { id: 'e6', time: '09:01', text: 'Rejected 41 dishes (over budget)', status: 'done' },
  { id: 'e7', time: '09:02', text: 'Comparing Chicken Bowl vs Paneer Bowl', status: 'done' },
  {
    id: 'e8',
    time: '09:02',
    text: 'Selected Chicken Bowl (+12g protein, ₹35 cheaper)',
    status: 'done',
  },
  { id: 'e9', time: '09:03', text: 'Planning snack and dinner pairings', status: 'done' },
  { id: 'e10', time: '09:03', text: 'Detected discount on Greek Yogurt option', status: 'done' },
  { id: 'e11', time: '09:04', text: 'Building Swiggy cart payload', status: 'working' },
];

export function AiActivityFeed() {
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisibleCount((prev) => Math.min(STREAM_EVENTS.length, prev + 1));
    }, 900);
    return () => window.clearInterval(timer);
  }, []);

  const visibleEvents = useMemo(
    () => STREAM_EVENTS.slice(0, visibleCount),
    [visibleCount],
  );

  const isComplete = visibleCount >= STREAM_EVENTS.length;

  return (
    <section className="space-y-4">
      <div className="bg-card rounded-xl p-4 ring-1 ring-white/6">
        <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Current objective
        </p>
        <p className="mt-1 text-lg font-semibold">
          {isComplete ? 'Mission complete' : 'Building today’s meal plan'}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {isComplete
            ? 'Today’s nutrition plan is ready. Monitoring for better swaps.'
            : 'Nourish AI is actively optimizing protein, budget, and delivery time.'}
        </p>
      </div>

      <div className="bg-card overflow-hidden rounded-xl ring-1 ring-white/6">
        <div className="border-b border-white/6 px-4 py-3">
          <h2 className="text-base font-semibold">AI Activity Feed</h2>
          <p className="text-muted-foreground text-xs">Live execution log</p>
        </div>
        <ol className="max-h-[560px] space-y-1 overflow-y-auto p-3">
          {visibleEvents.map((event, index) => {
            const isLast = index === visibleEvents.length - 1;
            const isWorking = event.status === 'working' && isLast && !isComplete;
            return (
              <li
                key={event.id}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm transition-all',
                  isLast && 'bg-white/[0.03]',
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-muted-foreground mt-0.5 w-11 shrink-0 font-mono text-xs">
                    {event.time}
                  </span>
                  <span className="mt-0.5">
                    {isWorking ? (
                      <Loader2 className="size-4 animate-spin text-[#FC8019]" />
                    ) : (
                      <CheckCircle2 className="size-4 text-[#22C55E]" />
                    )}
                  </span>
                  <span className="leading-relaxed">{event.text}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
