import type { MealEntry, MacroTarget } from '@/types';

export interface MealPlanRequest {
  goal: MacroTarget;
  budget: number;
  preferences?: string[];
}

export interface MealPlanExplanation {
  summary: string;
  reasoning: string[];
}

export interface MealPlanResult {
  meals: MealEntry[];
  explanation: MealPlanExplanation;
}
