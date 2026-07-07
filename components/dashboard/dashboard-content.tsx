'use client';

import { Suspense, useState } from 'react';
import { CoachStrip } from '@/components/nourish/coach-strip';
import { DailyStats } from '@/components/nourish/daily-stats';
import { HomeHeader, type SearchFilter } from '@/components/nourish/home-header';
import { MealPicks } from '@/components/nourish/meal-picks';
import { TodayPlan } from '@/components/nourish/today-plan';
import { WeekOverview } from '@/components/nourish/week-overview';
import { SwiggyConnectedToast } from '@/components/swiggy/swiggy-connected-toast';
import { MOCK_MEALS } from '@/constants/mock-data';

export function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      <Suspense fallback={null}>
        <SwiggyConnectedToast />
      </Suspense>

      <HomeHeader
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        onSearchQueryChange={setSearchQuery}
        onFilterChange={setActiveFilter}
      />
      <DailyStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayPlan meals={MOCK_MEALS} searchQuery={searchQuery} activeFilter={activeFilter} />
        </div>
        <CoachStrip />
      </div>

      <MealPicks searchQuery={searchQuery} activeFilter={activeFilter} />
      <WeekOverview />
    </div>
  );
}
