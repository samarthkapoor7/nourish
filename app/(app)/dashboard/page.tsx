import { Suspense } from 'react';
import { AiExplanationPanel } from '@/components/dashboard/ai-explanation-panel';
import { BudgetTrackerCard } from '@/components/dashboard/budget-tracker-card';
import { CaloriesCard } from '@/components/dashboard/calories-card';
import { MealTimeline } from '@/components/dashboard/meal-timeline';
import { OrderButton } from '@/components/dashboard/order-button';
import { ProteinProgressCard } from '@/components/dashboard/protein-progress-card';
import { SwiggyMenuSection } from '@/components/dashboard/swiggy-menu-section';
import { SwiggyRestaurantsSection } from '@/components/dashboard/swiggy-restaurants-section';
import { SwiggyConnectedToast } from '@/components/swiggy/swiggy-connected-toast';
import { MOCK_MEALS } from '@/constants/mock-data';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Suspense fallback={null}>
        <SwiggyConnectedToast />
      </Suspense>
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
        <ProteinProgressCard />
        <BudgetTrackerCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MealTimeline meals={MOCK_MEALS} />
        </div>
        <AiExplanationPanel />
      </div>

      <SwiggyMenuSection />
      <SwiggyRestaurantsSection />
    </div>
  );
}
