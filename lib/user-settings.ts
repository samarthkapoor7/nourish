import { MOCK_BUDGET, MOCK_MACROS } from '@/constants/mock-data';

export const USER_SETTINGS_STORAGE_KEY = 'nourish-user-settings';
export const USER_SETTINGS_UPDATED_EVENT = 'nourish-settings-updated';

export interface UserSettings {
  name: string;
  email: string;
  dailyCalories: string;
  dailyProtein: string;
  dailyBudget: string;
}

export interface UserGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyBudget: number;
}

export function getDefaultUserSettings(): UserSettings {
  return {
    name: '',
    email: '',
    dailyCalories: String(MOCK_MACROS.calories),
    dailyProtein: String(MOCK_MACROS.proteinGrams),
    dailyBudget: String(MOCK_BUDGET.dailyLimit),
  };
}

export function loadUserSettings(): UserSettings {
  if (typeof window === 'undefined') return getDefaultUserSettings();

  try {
    const stored = localStorage.getItem(USER_SETTINGS_STORAGE_KEY);
    if (!stored) return getDefaultUserSettings();
    return { ...getDefaultUserSettings(), ...JSON.parse(stored) };
  } catch {
    return getDefaultUserSettings();
  }
}

export function saveUserSettings(settings: UserSettings): void {
  localStorage.setItem(USER_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(USER_SETTINGS_UPDATED_EVENT));
}

export function parseGoalNumber(value: string, fallback: number): number {
  const parsed = Number.parseInt(value.replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getUserGoals(settings: UserSettings): UserGoals {
  return {
    dailyCalories: parseGoalNumber(settings.dailyCalories, MOCK_MACROS.calories),
    dailyProtein: parseGoalNumber(settings.dailyProtein, MOCK_MACROS.proteinGrams),
    dailyBudget: parseGoalNumber(settings.dailyBudget, MOCK_BUDGET.dailyLimit),
  };
}
