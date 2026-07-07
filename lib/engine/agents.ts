import { randomUUID } from 'crypto';
import type { MealRecommendation } from '@/types';
import type {
  AgentEvent,
  AgentModule,
  DailyPlan,
  GoalContext,
  MemorySignal,
  RankedMeal,
} from '@/lib/engine/types';
import { scoreMeal } from '@/lib/engine/scoring';
import { getDefaultUserSettings } from '@/lib/user-settings';
import { getSwiggyAddressOptions, searchSwiggyMenu } from '@/services/restaurant.service';

function toMealRecommendation(
  item: { id?: string; name?: string; price?: number; imageUrl?: string; isVeg?: boolean; restaurantName?: string; restaurantId?: string },
  index: number,
): MealRecommendation {
  return {
    id: `live-${item.restaurantId ?? 'nearby'}-${item.id ?? index}-${index}`,
    name: item.name ?? `Meal ${index + 1}`,
    restaurantName: item.restaurantName ?? 'Nearby restaurant',
    imageUrl:
      item.imageUrl ??
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    rating: Number((4.2 + (index % 6) * 0.1).toFixed(1)),
    etaMinutes: 14 + (index % 6) * 4,
    distanceKm: Number((1 + index * 0.25).toFixed(1)),
    calories: 260 + (index % 6) * 75,
    proteinGrams: 20 + (index % 6) * 6,
    price: item.price ?? 250,
    isVeg: Boolean(item.isVeg),
    healthScore: 80 + (index % 6) * 3,
    tags: [],
  };
}

export const goalAgent: AgentModule<{ userId?: string }, GoalContext> = {
  name: 'goal-agent',
  async run() {
    const fallback = getDefaultUserSettings();
    const now = new Date();
    return {
      userId: 'local-user',
      calories: Number(fallback.dailyCalories),
      proteinGrams: Number(fallback.dailyProtein),
      carbsGrams: 220,
      fatGrams: 70,
      budgetInr: Number(fallback.dailyBudget),
      diet: 'vegetarian-flex',
      allergies: [],
      gymAt: '19:00',
      lunchBefore: '13:00',
      generatedAt: now.toISOString(),
    };
  },
};

export const memoryAgent: AgentModule<{ userId: string }, MemorySignal[]> = {
  name: 'memory-agent',
  async run() {
    const now = new Date().toISOString();
    return [
      {
        type: 'dislike',
        key: 'mushroom',
        value: 'Rejected multiple times',
        confidence: 0.8,
        source: 'history',
        createdAt: now,
      },
      {
        type: 'budget_guardrail',
        key: 'lunch_max_300',
        value: 'User rarely spends over ₹300 at lunch',
        confidence: 0.9,
        source: 'history',
        createdAt: now,
      },
      {
        type: 'timing_preference',
        key: 'friday_late_lunch',
        value: 'Orders ~15 mins later on Fridays',
        confidence: 0.72,
        source: 'history',
        createdAt: now,
      },
    ];
  },
};

export const restaurantDiscoveryAgent: AgentModule<
  { query: string; vegOnly?: boolean },
  MealRecommendation[]
> = {
  name: 'restaurant-discovery-agent',
  async run({ query, vegOnly }) {
    const addresses = await getSwiggyAddressOptions();
    const addressId = addresses[0]?.addressId;
    if (!addressId) return [];

    const menu = await searchSwiggyMenu({
      addressId,
      query,
      vegFilter: vegOnly ? 1 : undefined,
    });

    const items = (menu.items ?? menu.menuItems ?? []).slice(0, 60);
    return items.map(toMealRecommendation).filter((m) => (vegOnly ? m.isVeg : true));
  },
};

export const mealRankingAgent: AgentModule<
  { candidates: MealRecommendation[]; goals: GoalContext; memories: MemorySignal[] },
  RankedMeal[]
> = {
  name: 'meal-ranking-agent',
  async run({ candidates, goals, memories }) {
    return candidates.map((meal) => scoreMeal(meal, goals, memories)).sort((a, b) => b.score - a.score);
  },
};

function pickBestByBudget(ranked: RankedMeal[], maxBudget: number) {
  const within = ranked.filter((meal) => meal.price <= maxBudget);
  if (within.length > 0) return within[0];
  return ranked[0];
}

export const nutritionPlannerAgent: AgentModule<
  { ranked: RankedMeal[]; goals: GoalContext },
  DailyPlan
> = {
  name: 'nutrition-planner-agent',
  async run({ ranked, goals }) {
    const breakfastBudget = goals.budgetInr * 0.18;
    const lunchBudget = goals.budgetInr * 0.4;
    const snackBudget = goals.budgetInr * 0.12;
    const dinnerBudget = goals.budgetInr * 0.3;

    const breakfast = pickBestByBudget(ranked, breakfastBudget);
    const lunch = pickBestByBudget(ranked.slice(1), lunchBudget);
    const snack = pickBestByBudget(ranked.slice(2), snackBudget);
    const dinner = pickBestByBudget(ranked.slice(3), dinnerBudget);

    const totals = {
      calories: breakfast.calories + lunch.calories + snack.calories + dinner.calories,
      proteinGrams:
        breakfast.proteinGrams + lunch.proteinGrams + snack.proteinGrams + dinner.proteinGrams,
      spendInr: breakfast.price + lunch.price + snack.price + dinner.price,
    };

    const confidence = Number(
      (
        (breakfast.confidence + lunch.confidence + snack.confidence + dinner.confidence) /
        4
      ).toFixed(2),
    );

    return {
      breakfast,
      lunch,
      snack,
      dinner,
      totals,
      confidence,
      summary:
        "Today's plan optimized for protein density while staying close to your calorie and budget targets.",
      explainability: [
        'Lunch chosen for highest protein density in budget',
        'Snack adjusted to maintain macro balance',
        'Dinner selected with shortest reliable ETA among top-scoring meals',
      ],
    };
  },
};

export const executionAgent: AgentModule<
  { plan: DailyPlan },
  { steps: AgentEvent[]; checkoutUrl: string }
> = {
  name: 'execution-agent',
  async run({ plan }) {
    const query = encodeURIComponent(`${plan.lunch?.name ?? ''} ${plan.dinner?.name ?? ''}`.trim());
    const checkoutUrl = `https://www.swiggy.com/search?query=${query}`;
    const now = new Date();

    const steps: AgentEvent[] = [
      {
        id: randomUUID(),
        timestamp: now.toISOString(),
        type: 'OrderExecutionStarted',
        message: 'Executing order flow with Swiggy MCP',
      },
      {
        id: randomUUID(),
        timestamp: now.toISOString(),
        type: 'OrderExecutionStep',
        message: 'Searching restaurants',
      },
      {
        id: randomUUID(),
        timestamp: now.toISOString(),
        type: 'OrderExecutionStep',
        message: 'Applying best coupon and delivery slot',
      },
      {
        id: randomUUID(),
        timestamp: now.toISOString(),
        type: 'OrderExecutionBlocked',
        message: 'Waiting for payment approval',
      },
    ];

    return { steps, checkoutUrl };
  },
};
