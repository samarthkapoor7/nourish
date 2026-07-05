'use client';

import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function OrderButton() {
  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      onClick={() => toast("Ordering isn't wired up yet — this is a placeholder.")}
    >
      <ShoppingBag className="size-4" />
      Order today&apos;s meals
    </Button>
  );
}
