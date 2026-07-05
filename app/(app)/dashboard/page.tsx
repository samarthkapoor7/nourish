import { AiExplanationPanel } from '@/components/dashboard/ai-explanation-panel';
import { BudgetTrackerCard } from '@/components/dashboard/budget-tracker-card';
import { CaloriesCard } from '@/components/dashboard/calories-card';
import { MealTimeline } from '@/components/dashboard/meal-timeline';
import { OrderButton } from '@/components/dashboard/order-button';
import { ProteinProgressCard } from '@/components/dashboard/protein-progress-card';
import { RestaurantCards } from '@/components/dashboard/restaurant-cards';
import { MOCK_BUDGET, MOCK_MEALS, MOCK_MACROS, MOCK_RESTAURANTS } from '@/constants/mock-data';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Good afternoon</h2>
          <p className="text-muted-foreground text-sm">
            Here&apos;s how today is tracking against your goal.
          </p>
        </div>
        <OrderButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <CaloriesCard />
        <ProteinProgressCard macros={MOCK_MACROS} />
        <BudgetTrackerCard budget={MOCK_BUDGET} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MealTimeline meals={MOCK_MEALS} />
        </div>
        <AiExplanationPanel />
      </div>

      <RestaurantCards restaurants={MOCK_RESTAURANTS} />
    </div>
  );
}
