import { DaySummaryCard } from '@/components/dashboard/day-summary-card';
import { Button } from '@/components/ui/button';
import { MOCK_WEEK } from '@/constants/mock-data';

export default function WeeklyPlanPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Weekly Plan</h2>
          <p className="text-muted-foreground text-sm">
            Jun 30 – Jul 6, planned against your daily targets.
          </p>
        </div>
        <Button variant="outline" disabled>
          Regenerate week
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {MOCK_WEEK.map((day) => (
          <DaySummaryCard key={day.day} day={day} />
        ))}
      </div>
    </div>
  );
}
