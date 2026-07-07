'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AiSuggestions() {
  return (
    <section className="bg-card rounded-xl p-5 ring-1 ring-white/6">
      <p className="text-sm font-semibold">Recommended adjustment</p>
      <p className="text-muted-foreground mt-2 text-sm">
        Swap tonight&apos;s meal for a Paneer Bowl.
      </p>
      <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-xs">
        <span>+15g protein</span>
        <span>-₹30 cheaper</span>
      </div>
      <Button
        size="sm"
        className="mt-4 rounded-lg"
        onClick={() => toast.success('Dinner updated to Paneer Bowl')}
      >
        Switch
      </Button>
    </section>
  );
}
