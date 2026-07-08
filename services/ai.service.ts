import { randomUUID } from 'crypto';
import { gemini } from '@/lib/ai/client';
import { AI_CONFIG } from '@/lib/ai/config';
import type { MealPlanRequest, MealPlanResult } from '@/lib/ai/types';
import type { MealEntry, MealType } from '@/types';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

function buildPrompt(request: MealPlanRequest): string {
  const { goal, budget, preferences } = request;
  const prefText =
    preferences && preferences.length > 0
      ? `Dietary preferences / restrictions: ${preferences.join(', ')}.`
      : 'No specific dietary preferences.';

  return `You are a nutrition-aware meal planner. Generate a single day's meal plan for someone with these goals:
- Daily calories: ${goal.calories} kcal
- Daily protein: ${goal.proteinGrams}g
- Daily carbs: ${goal.carbsGrams}g
- Daily fat: ${goal.fatGrams}g
- Daily food budget: ₹${budget} INR
${prefText}

Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
{
  "meals": [
    {
      "id": "<uuid>",
      "type": "breakfast" | "lunch" | "snack" | "dinner",
      "title": "<meal name>",
      "restaurantName": "<restaurant or home-cooked>",
      "calories": <number>,
      "proteinGrams": <number>,
      "price": <number in INR>,
      "scheduledAt": "<ISO-8601 time today, e.g. 2024-01-01T08:00:00.000Z>",
      "ordered": false
    }
  ],
  "explanation": {
    "summary": "<1-2 sentence overview of the plan>",
    "reasoning": ["<point 1>", "<point 2>", "<point 3>"]
  }
}

Rules:
- Include exactly 4 meals: breakfast, lunch, snack, dinner.
- Total daily calories must be within 10% of the goal.
- Total daily protein must be within 10% of the goal.
- Total price must not exceed the budget.
- Use realistic Indian restaurant or home-cooked meal names.
- scheduledAt: breakfast ~08:00, lunch ~13:00, snack ~16:30, dinner ~20:00 (use today's UTC date).`;
}

function parseMealPlanResult(raw: string): MealPlanResult {
  const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(cleaned) as {
    meals: Array<{
      id?: string;
      type: string;
      title: string;
      restaurantName: string;
      calories: number;
      proteinGrams: number;
      price: number;
      scheduledAt: string;
      ordered?: boolean;
    }>;
    explanation: { summary: string; reasoning: string[] };
  };

  const meals: MealEntry[] = parsed.meals.map((m) => ({
    id: m.id ?? randomUUID(),
    type: MEAL_TYPES.includes(m.type as MealType) ? (m.type as MealType) : 'lunch',
    title: m.title,
    restaurantName: m.restaurantName,
    calories: Number(m.calories),
    proteinGrams: Number(m.proteinGrams),
    price: Number(m.price),
    scheduledAt: m.scheduledAt,
    ordered: m.ordered ?? false,
  }));

  return {
    meals,
    explanation: {
      summary: parsed.explanation.summary,
      reasoning: parsed.explanation.reasoning,
    },
  };
}

export async function generateMealPlan(request: MealPlanRequest): Promise<MealPlanResult> {
  const prompt = buildPrompt(request);

  const response = await gemini.models.generateContent({
    model: AI_CONFIG.model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      maxOutputTokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text ?? '';
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return parseMealPlanResult(text);
}
