'use client';

import { ErrorState } from '@/components/shared/error-state';

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <ErrorState onRetry={reset} />
    </div>
  );
}
