import { CardSkeleton } from '@/components/shared/card-skeleton';

export default function AppLoading() {
  return (
    <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
