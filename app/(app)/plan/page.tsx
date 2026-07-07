import { DaySummaryCard } from '@/components/dashboard/day-summary-card';
import { Button } from '@/components/ui/button';
import { MOCK_WEEK } from '@/constants/mock-data';

export default function WeeklyPlanPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Weekly Plan</h2>
          <p className="text-muted-foreground text-sm">
            Jun 30 – Jul 6, planned against your daily targets.
          </p>
        </div>
        <Button variant="secondary" className="rounded-lg" disabled>
          Regenerate week
        </Button>
      </div>

      <div className="bg-card rounded-xl p-4 ring-1 ring-white/6 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">Daily targets overview</p>
          <p className="text-muted-foreground text-xs">Tap Settings to adjust goals</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {MOCK_WEEK.map((day) => (
          <DaySummaryCard key={day.day} day={day} />
        ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 ring-1 ring-white/6 sm:p-5">
        <p className="text-sm font-semibold">Agent status</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Generated 3 minutes ago. Next optimization run scheduled tomorrow at 8:00 AM.
        </p>
      </div>
    </div>
  );
}
