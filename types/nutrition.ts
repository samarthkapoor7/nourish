export interface MacroTarget {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface MacroProgress extends MacroTarget {
  consumedCalories: number;
  consumedProteinGrams: number;
  consumedCarbsGrams: number;
  consumedFatGrams: number;
}

export interface BudgetTarget {
  dailyLimit: number;
  spent: number;
  currency: string;
}

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface MealEntry {
  id: string;
  type: MealType;
  title: string;
  restaurantName: string;
  calories: number;
  proteinGrams: number;
  price: number;
  scheduledAt: string;
  ordered: boolean;
  imageUrl?: string;
  restaurantLogoUrl?: string;
}

export interface MealRecommendation {
  id: string;
  name: string;
  restaurantName: string;
  restaurantLogoUrl?: string;
  imageUrl: string;
  rating: number;
  etaMinutes: number;
  distanceKm: number;
  calories: number;
  proteinGrams: number;
  price: number;
  isVeg: boolean;
  healthScore: number;
  tags?: string[];
}

export interface SmartInsight {
  id: string;
  text: string;
}

export interface Achievement {
  id: string;
  title: string;
  gradient: string;
}

export interface WeeklyMealPlanDay {
  day: string;
  date: string;
  isToday?: boolean;
  breakfast: string;
  lunch: string;
  dinner: string;
  proteinGrams: number;
  budget: number;
}

export interface YesterdayComparison {
  calories: number;
  proteinGrams: number;
  budgetSpent: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  etaMinutes: number;
  priceForOne: number;
  imageUrl?: string;
  matchReason: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  restaurantId: string;
  restaurantName: string;
  isVeg?: boolean;
}
