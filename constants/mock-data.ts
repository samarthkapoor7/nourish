import type { MacroProgress, BudgetTarget, MealEntry, Restaurant } from '@/types';

export const MOCK_MACROS: MacroProgress = {
  calories: 2200,
  proteinGrams: 150,
  carbsGrams: 220,
  fatGrams: 70,
  consumedCalories: 1450,
  consumedProteinGrams: 92,
  consumedCarbsGrams: 140,
  consumedFatGrams: 48,
};

export const MOCK_BUDGET: BudgetTarget = {
  dailyLimit: 600,
  spent: 340,
  currency: 'INR',
};

export const MOCK_MEALS: MealEntry[] = [
  {
    id: 'meal-1',
    type: 'breakfast',
    title: 'Greek Yogurt Protein Bowl',
    restaurantName: 'The Green Bowl',
    calories: 380,
    proteinGrams: 32,
    price: 180,
    scheduledAt: '08:00',
    ordered: true,
  },
  {
    id: 'meal-2',
    type: 'lunch',
    title: 'Grilled Chicken & Quinoa',
    restaurantName: 'MealFit Kitchen',
    calories: 620,
    proteinGrams: 48,
    price: 260,
    scheduledAt: '13:00',
    ordered: true,
  },
  {
    id: 'meal-3',
    type: 'snack',
    title: 'Roasted Chickpea Trail Mix',
    restaurantName: 'Snack Lab',
    calories: 210,
    proteinGrams: 12,
    price: 90,
    scheduledAt: '16:30',
    ordered: false,
  },
  {
    id: 'meal-4',
    type: 'dinner',
    title: 'Paneer Tikka & Brown Rice',
    restaurantName: 'Tandoori House',
    calories: 590,
    proteinGrams: 34,
    price: 310,
    scheduledAt: '20:00',
    ordered: false,
  },
];

export interface MockDaySummary {
  day: string;
  date: string;
  calories: number;
  targetCalories: number;
  proteinGrams: number;
  spent: number;
  mealsPlanned: number;
  isToday?: boolean;
}

export const MOCK_WEEK: MockDaySummary[] = [
  {
    day: 'Mon',
    date: 'Jun 30',
    calories: 2100,
    targetCalories: 2200,
    proteinGrams: 140,
    spent: 560,
    mealsPlanned: 4,
  },
  {
    day: 'Tue',
    date: 'Jul 1',
    calories: 2250,
    targetCalories: 2200,
    proteinGrams: 155,
    spent: 610,
    mealsPlanned: 4,
  },
  {
    day: 'Wed',
    date: 'Jul 2',
    calories: 1980,
    targetCalories: 2200,
    proteinGrams: 132,
    spent: 480,
    mealsPlanned: 3,
  },
  {
    day: 'Thu',
    date: 'Jul 3',
    calories: 2190,
    targetCalories: 2200,
    proteinGrams: 148,
    spent: 590,
    mealsPlanned: 4,
  },
  {
    day: 'Fri',
    date: 'Jul 4',
    calories: 2320,
    targetCalories: 2200,
    proteinGrams: 160,
    spent: 640,
    mealsPlanned: 4,
  },
  {
    day: 'Sat',
    date: 'Jul 5',
    calories: 1450,
    targetCalories: 2200,
    proteinGrams: 92,
    spent: 340,
    mealsPlanned: 2,
    isToday: true,
  },
  {
    day: 'Sun',
    date: 'Jul 6',
    calories: 0,
    targetCalories: 2200,
    proteinGrams: 0,
    spent: 0,
    mealsPlanned: 0,
  },
];

export const MOCK_HISTORY: MockDaySummary[] = MOCK_WEEK.filter((day) => day.mealsPlanned > 0);

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'The Green Bowl',
    cuisine: 'Healthy · Salads',
    rating: 4.6,
    etaMinutes: 28,
    priceForOne: 220,
    matchReason: 'High protein, fits your calorie budget',
  },
  {
    id: 'rest-2',
    name: 'MealFit Kitchen',
    cuisine: 'Protein Bowls',
    rating: 4.5,
    etaMinutes: 35,
    priceForOne: 260,
    matchReason: 'Best protein-per-rupee match nearby',
  },
  {
    id: 'rest-3',
    name: 'Tandoori House',
    cuisine: 'North Indian',
    rating: 4.3,
    etaMinutes: 40,
    priceForOne: 310,
    matchReason: 'Within budget, hits your dinner macros',
  },
];
