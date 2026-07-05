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
