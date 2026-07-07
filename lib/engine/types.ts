import { z } from 'zod';
import type { MealRecommendation } from '@/types';

export const AgentStateSchema = z.enum([
  'planning',
  'waiting_approval',
  'ordering',
  'monitoring_delivery',
  'meal_completed',
  'tracking_progress',
  'learning',
]);

export type AgentState = z.infer<typeof AgentStateSchema>;

export const GoalContextSchema = z.object({
  userId: z.string(),
  calories: z.number().int().positive(),
  proteinGrams: z.number().int().positive(),
  carbsGrams: z.number().int().positive(),
  fatGrams: z.number().int().positive(),
  budgetInr: z.number().positive(),
  diet: z.string(),
  allergies: z.array(z.string()).default([]),
  gymAt: z.string().optional(),
  lunchBefore: z.string().optional(),
  generatedAt: z.string(),
});

export type GoalContext = z.infer<typeof GoalContextSchema>;

export const MemorySignalSchema = z.object({
  type: z.enum([
    'dislike',
    'favorite',
    'budget_guardrail',
    'timing_preference',
    'macro_preference',
    'schedule_signal',
  ]),
  key: z.string(),
  value: z.string(),
  confidence: z.number().min(0).max(1),
  source: z.string(),
  createdAt: z.string(),
});

export type MemorySignal = z.infer<typeof MemorySignalSchema>;

export const RankedMealSchema = z.object({
  id: z.string(),
  name: z.string(),
  restaurantName: z.string(),
  isVeg: z.boolean(),
  price: z.number(),
  calories: z.number(),
  proteinGrams: z.number(),
  etaMinutes: z.number(),
  score: z.number(),
  confidence: z.number().min(0).max(1),
  reasons: z.array(z.string()),
});

export type RankedMeal = z.infer<typeof RankedMealSchema>;

export const DailyPlanSchema = z.object({
  breakfast: RankedMealSchema.optional(),
  lunch: RankedMealSchema.optional(),
  snack: RankedMealSchema.optional(),
  dinner: RankedMealSchema.optional(),
  totals: z.object({
    calories: z.number(),
    proteinGrams: z.number(),
    spendInr: z.number(),
  }),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  explainability: z.array(z.string()),
});

export type DailyPlan = z.infer<typeof DailyPlanSchema>;

export const AgentEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum([
    'RestaurantClosed',
    'MenuChanged',
    'CouponFound',
    'MealRejected',
    'BudgetExceeded',
    'ProteinMissed',
    'GymDetected',
    'DeliveryDelayed',
    'RestaurantOpened',
    'WeatherChanged',
    'PlanGenerated',
    'PlanReplanned',
    'OrderExecutionStarted',
    'OrderExecutionStep',
    'OrderExecutionBlocked',
  ]),
  message: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AgentEvent = z.infer<typeof AgentEventSchema>;

export interface EngineContext {
  goals: GoalContext;
  memories: MemorySignal[];
  candidateMeals: MealRecommendation[];
  events: AgentEvent[];
  state: AgentState;
}

export interface AgentModule<TInput, TOutput> {
  name: string;
  run: (input: TInput) => Promise<TOutput>;
}
