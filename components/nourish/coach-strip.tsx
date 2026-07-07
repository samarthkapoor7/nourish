'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SUGGESTIONS = ['Paneer Tikka Bowl', 'Grilled Fish Plate', 'Greek Yogurt Parfait'];

export function CoachStrip() {
  return (
    <section className="bg-card h-full rounded-xl p-5 ring-1 ring-white/6">
      <p className="text-xs font-semibold text-[#FC8019]">Coach</p>
      <p className="mt-2 text-sm leading-relaxed">
        Lunch covered your carbs. For dinner, pick something with ~35g protein and stay under ₹160.
      </p>
      <div className="mt-4 space-y-2">
        {SUGGESTIONS.map((item) => (
          <Button
            key={item}
            variant="secondary"
            className="h-9 w-full justify-start rounded-lg text-sm font-normal"
            onClick={() => toast.success(`Swapped to ${item}`)}
          >
            {item}
          </Button>
        ))}
      </div>
    </section>
  );
}
