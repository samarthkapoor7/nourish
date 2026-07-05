import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants/app';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}>
      <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
        <Sparkles className="size-4" />
      </span>
      <span>{APP_NAME}</span>
    </div>
  );
}
