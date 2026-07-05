import type { MealPlanRequest, MealPlanResult } from '@/lib/ai/types';

/**
 * Placeholder AI meal-planning service. Wire this up to @/lib/ai/client
 * (Gemini) once meal planning is implemented.
 */
export async function generateMealPlan(_request: MealPlanRequest): Promise<MealPlanResult> {
  throw new Error('Not implemented: generateMealPlan');
}
