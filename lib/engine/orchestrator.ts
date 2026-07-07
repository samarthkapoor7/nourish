import { randomUUID } from 'crypto';
import {
  executionAgent,
  goalAgent,
  mealRankingAgent,
  memoryAgent,
  nutritionPlannerAgent,
  restaurantDiscoveryAgent,
} from '@/lib/engine/agents';
import type { AgentEvent, AgentState, DailyPlan } from '@/lib/engine/types';

function nowIso() {
  return new Date().toISOString();
}

function feedEvent(type: AgentEvent['type'], message: string): AgentEvent {
  return {
    id: randomUUID(),
    timestamp: nowIso(),
    type,
    message,
  };
}

export interface EngineRunResult {
  state: AgentState;
  plan: DailyPlan;
  confidence: number;
  feed: AgentEvent[];
  queue: string[];
  explainability: string[];
  checkoutUrl: string;
}

export async function runNourishPlanningCycle(input: {
  userId?: string;
  query?: string;
  vegOnly?: boolean;
}): Promise<EngineRunResult> {
  const feed: AgentEvent[] = [];
  const queue = [
    'Scan nearby restaurants',
    'Estimate delivery times',
    'Optimize protein per rupee',
    'Balance macros',
    'Check yesterday meals',
    'Detect discounts',
    'Build meal timeline',
    'Prepare Swiggy cart',
  ];

  feed.push(feedEvent('PlanGenerated', 'Loaded your nutrition goals'));
  const goals = await goalAgent.run({ userId: input.userId });

  feed.push(feedEvent('PlanGenerated', 'Loaded memory preferences'));
  const memories = await memoryAgent.run({ userId: goals.userId });

  feed.push(feedEvent('PlanGenerated', 'Scanning nearby restaurants and menus'));
  const candidates = await restaurantDiscoveryAgent.run({
    query: input.query ?? 'high protein',
    vegOnly: input.vegOnly,
  });

  feed.push(
    feedEvent(
      'PlanGenerated',
      `Compared ${candidates.length} candidate dishes from nearby restaurants`,
    ),
  );

  const rejectedLowProtein = candidates.filter((meal) => meal.proteinGrams < 20).length;
  const rejectedOverBudget = candidates.filter((meal) => meal.price > goals.budgetInr * 0.45).length;
  if (rejectedLowProtein > 0) {
    feed.push(feedEvent('ProteinMissed', `Rejected ${rejectedLowProtein} low-protein meals`));
  }
  if (rejectedOverBudget > 0) {
    feed.push(feedEvent('BudgetExceeded', `Rejected ${rejectedOverBudget} over-budget meals`));
  }

  const ranked = await mealRankingAgent.run({ candidates, goals, memories });
  feed.push(feedEvent('PlanGenerated', 'Ranked meals by protein density and budget fit'));

  const plan = await nutritionPlannerAgent.run({ ranked, goals });
  feed.push(feedEvent('PlanGenerated', `Daily plan completed (${Math.round(plan.confidence * 100)}% confidence)`));

  const execution = await executionAgent.run({ plan });
  feed.push(...execution.steps);

  return {
    state: 'waiting_approval',
    plan,
    confidence: plan.confidence,
    feed,
    queue,
    explainability: plan.explainability,
    checkoutUrl: execution.checkoutUrl,
  };
}
