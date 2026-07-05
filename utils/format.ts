export function formatCalories(calories: number): string {
  return `${Math.round(calories).toLocaleString()} kcal`;
}

export function formatGrams(grams: number): string {
  return `${Math.round(grams)}g`;
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, total: number): string {
  if (total <= 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}
