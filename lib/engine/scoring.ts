import type { MealRecommendation } from '@/types';
import type { GoalContext, MemorySignal, RankedMeal } from '@/lib/engine/types';

const WEIGHTS = {
  proteinDensity: 0.32,
  calories: 0.18,
  budget: 0.15,
  deliveryTime: 0.1,
  rating: 0.08,
  freshness: 0.07,
  popularity: 0.05,
  historicalPreference: 0.05,
} as const;

function normalize(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function preferenceBoost(meal: MealRecommendation, memories: MemorySignal[]) {
  const likes = memories.filter(
    (m) =>
      m.type === 'favorite' &&
      (meal.name.toLowerCase().includes(m.key.toLowerCase()) ||
        meal.restaurantName.toLowerCase().includes(m.key.toLowerCase())),
  );
  const dislikes = memories.filter(
    (m) =>
      m.type === 'dislike' &&
      (meal.name.toLowerCase().includes(m.key.toLowerCase()) ||
        meal.restaurantName.toLowerCase().includes(m.key.toLowerCase())),
  );

  const likedScore = likes.reduce((acc, item) => acc + item.confidence * 0.2, 0);
  const dislikePenalty = dislikes.reduce((acc, item) => acc + item.confidence * 0.35, 0);
  return Math.max(-0.4, Math.min(0.35, likedScore - dislikePenalty));
}

export function scoreMeal(
  meal: MealRecommendation,
  goals: GoalContext,
  memories: MemorySignal[],
): RankedMeal {
  const proteinDensity = meal.proteinGrams / Math.max(1, meal.calories);
  const calorieMatch = 1 - Math.abs(meal.calories - 550) / 550;
  const budgetFit = 1 - Math.min(1, meal.price / Math.max(1, goals.budgetInr));
  const etaScore = 1 - normalize(meal.etaMinutes, 12, 45);
  const ratingScore = normalize(meal.rating, 3.8, 5);
  const freshnessScore = normalize(meal.healthScore, 65, 100);
  const popularityScore = normalize(meal.rating * 20 + meal.healthScore, 120, 200);
  const historyScore = 0.5 + preferenceBoost(meal, memories);

  const weighted =
    proteinDensity * WEIGHTS.proteinDensity +
    Math.max(0, calorieMatch) * WEIGHTS.calories +
    Math.max(0, budgetFit) * WEIGHTS.budget +
    etaScore * WEIGHTS.deliveryTime +
    ratingScore * WEIGHTS.rating +
    freshnessScore * WEIGHTS.freshness +
    popularityScore * WEIGHTS.popularity +
    Math.max(0, historyScore) * WEIGHTS.historicalPreference;

  const score = Number((weighted * 100).toFixed(2));
  const confidence = Number(Math.max(0.55, Math.min(0.99, weighted)).toFixed(2));

  const reasons = [
    `${meal.proteinGrams}g protein with ${meal.calories} kcal`,
    `${meal.etaMinutes} min delivery estimate`,
    `₹${meal.price} price fit for daily budget`,
    `Restaurant rating ${meal.rating.toFixed(1)}`,
  ];

  return {
    id: meal.id,
    name: meal.name,
    restaurantName: meal.restaurantName,
    isVeg: meal.isVeg,
    price: meal.price,
    calories: meal.calories,
    proteinGrams: meal.proteinGrams,
    etaMinutes: meal.etaMinutes,
    score,
    confidence,
    reasons,
  };
}
