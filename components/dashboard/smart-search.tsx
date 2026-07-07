'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const FILTERS = [
  'High Protein',
  'Low Carb',
  'Under ₹250',
  'Vegetarian',
  'Quick Delivery',
  'Gym Meals',
] as const;

export function SmartSearch() {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
    );
  };

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-5 size-5 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="High protein under ₹300"
          className="bg-card placeholder:text-muted-foreground w-full rounded-full py-4 pr-6 pl-14 text-base shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 outline-none focus:shadow-[0_4px_32px_rgba(252,128,25,0.15)] focus:ring-2 focus:ring-[#FC8019]/30"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => toggleFilter(filter)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95',
              activeFilters.includes(filter)
                ? 'bg-[#FC8019] text-black shadow-[0_4px_16px_rgba(252,128,25,0.3)]'
                : 'bg-card text-muted-foreground hover:bg-[#202020] hover:text-foreground',
            )}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
