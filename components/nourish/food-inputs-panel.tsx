'use client';

export interface FoodInputs {
  mealType: 'any' | 'breakfast' | 'lunch' | 'snack' | 'dinner';
  cuisine: 'any' | 'north indian' | 'south indian' | 'salad' | 'bowls' | 'continental';
  maxBudget: number;
  vegOnly: boolean;
  spiceLevel: 'mild' | 'medium' | 'spicy';
}

interface FoodInputsPanelProps {
  value: FoodInputs;
  onChange: (next: FoodInputs) => void;
}

export function FoodInputsPanel({ value, onChange }: FoodInputsPanelProps) {
  return (
    <section className="bg-card rounded-xl p-4 ring-1 ring-white/6">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">Customize food selection</h3>
        <p className="text-muted-foreground text-xs">Tell Nourish what you want to eat today.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">Meal type</span>
          <select
            value={value.mealType}
            onChange={(e) => onChange({ ...value, mealType: e.target.value as FoodInputs['mealType'] })}
            className="bg-background h-9 w-full rounded-lg px-2.5 text-sm ring-1 ring-white/10 outline-none"
          >
            <option value="any">Any</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snack">Snack</option>
            <option value="dinner">Dinner</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">Cuisine</span>
          <select
            value={value.cuisine}
            onChange={(e) => onChange({ ...value, cuisine: e.target.value as FoodInputs['cuisine'] })}
            className="bg-background h-9 w-full rounded-lg px-2.5 text-sm ring-1 ring-white/10 outline-none"
          >
            <option value="any">Any</option>
            <option value="north indian">North Indian</option>
            <option value="south indian">South Indian</option>
            <option value="salad">Salad</option>
            <option value="bowls">Bowls</option>
            <option value="continental">Continental</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">Spice</span>
          <select
            value={value.spiceLevel}
            onChange={(e) =>
              onChange({ ...value, spiceLevel: e.target.value as FoodInputs['spiceLevel'] })
            }
            className="bg-background h-9 w-full rounded-lg px-2.5 text-sm ring-1 ring-white/10 outline-none"
          >
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="spicy">Spicy</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">Max budget (per meal)</span>
          <input
            type="number"
            min={120}
            max={800}
            step={10}
            value={value.maxBudget}
            onChange={(e) => onChange({ ...value, maxBudget: Number(e.target.value) || 300 })}
            className="bg-background h-9 w-full rounded-lg px-2.5 text-sm ring-1 ring-white/10 outline-none"
          />
        </label>

        <label className="flex items-end">
          <button
            type="button"
            onClick={() => onChange({ ...value, vegOnly: !value.vegOnly })}
            className={`h-9 w-full rounded-lg px-3 text-sm font-medium ring-1 ${
              value.vegOnly
                ? 'bg-[#FC8019] text-[#141414] ring-[#FC8019]'
                : 'bg-background text-muted-foreground ring-white/10'
            }`}
          >
            {value.vegOnly ? 'Veg only: On' : 'Veg only: Off'}
          </button>
        </label>
      </div>
    </section>
  );
}
