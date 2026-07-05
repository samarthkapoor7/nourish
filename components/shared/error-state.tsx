import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this section. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="border-border bg-card/50 flex flex-col items-center justify-center gap-3 rounded-2xl border px-6 py-10 text-center">
      <AlertCircle className="text-destructive size-8" />
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
