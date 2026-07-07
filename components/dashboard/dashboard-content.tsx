'use client';

import { Suspense, useState } from 'react';
import { AiSuggestions } from '@/components/nourish/ai-suggestions';
import { DailyStats } from '@/components/nourish/daily-stats';
import { DayAtAGlance } from '@/components/nourish/day-at-a-glance';
import { FoodInputsPanel, type FoodInputs } from '@/components/nourish/food-inputs-panel';
import { HomeHeader, type SearchFilter } from '@/components/nourish/home-header';
import { MealPicks } from '@/components/nourish/meal-picks';
import { NutritionGuide } from '@/components/nourish/nutrition-guide';
import { SmartInsights } from '@/components/nourish/smart-insights';
import { TodayPlan } from '@/components/nourish/today-plan';
import { WeekOverview } from '@/components/nourish/week-overview';
import { WhyTheseMeals } from '@/components/nourish/why-these-meals';
import { SwiggyConnectedToast } from '@/components/swiggy/swiggy-connected-toast';
import { MOCK_MEALS } from '@/constants/mock-data';

export function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const [foodInputs, setFoodInputs] = useState<FoodInputs>({
    mealType: 'any',
    cuisine: 'any',
    maxBudget: 300,
    vegOnly: false,
    spiceLevel: 'medium',
  });

  const effectiveSearchQuery = [
    searchQuery,
    foodInputs.mealType === 'any' ? '' : foodInputs.mealType,
    foodInputs.cuisine === 'any' ? '' : foodInputs.cuisine,
    foodInputs.spiceLevel === 'medium' ? '' : foodInputs.spiceLevel,
  ]
    .filter(Boolean)
    .join(' ');

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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DayAtAGlance />
        </div>
        <WhyTheseMeals />
      </div>

      <FoodInputsPanel value={foodInputs} onChange={setFoodInputs} />

      <DailyStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <TodayPlan
            meals={MOCK_MEALS}
            searchQuery={effectiveSearchQuery}
            activeFilter={activeFilter}
            maxBudget={foodInputs.maxBudget}
            vegOnly={foodInputs.vegOnly}
          />
        </div>
        <div className="space-y-6">
          <NutritionGuide />
          <AiSuggestions />
        </div>
      </div>

      <SmartInsights />
      <MealPicks
        searchQuery={effectiveSearchQuery}
        activeFilter={activeFilter}
        maxBudget={foodInputs.maxBudget}
        vegOnly={foodInputs.vegOnly}
        mealType={foodInputs.mealType}
        cuisine={foodInputs.cuisine}
        spiceLevel={foodInputs.spiceLevel}
      />
      <WeekOverview />
    </div>
  );
}
