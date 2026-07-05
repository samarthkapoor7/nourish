export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
}

export interface NutritionGoal {
  id: string;
  userId: string;
  dailyCalories: number;
  dailyProteinGrams: number;
  dailyBudget: number;
  currency: string;
  goalType: 'lose_weight' | 'maintain' | 'gain_muscle' | 'custom';
}
