'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwiggyStatus } from '@/hooks/use-swiggy';
import { useUserSettings } from '@/hooks/use-user-settings';
import { toast } from 'sonner';

export const SEARCH_FILTERS = [
  'all',
  'high-protein',
  'under-budget',
  'vegetarian',
  'quick-delivery',
] as const;
export type SearchFilter = (typeof SEARCH_FILTERS)[number];

const FILTER_LABELS: Record<SearchFilter, string> = {
  all: 'All',
  'high-protein': 'High protein',
  'under-budget': 'Under budget',
  vegetarian: 'Vegetarian',
  'quick-delivery': 'Quick delivery',
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getOrderLabel(): string {
  const hour = new Date().getHours();
  if (hour < 11) return 'Order breakfast';
  if (hour < 15) return 'Order lunch';
  if (hour < 18) return 'Order snack';
  return 'Order dinner';
}

interface HomeHeaderProps {
  searchQuery: string;
  activeFilter: SearchFilter;
  onSearchQueryChange: (query: string) => void;
  onFilterChange: (filter: SearchFilter) => void;
}

export function HomeHeader({
  searchQuery,
  activeFilter,
  onSearchQueryChange,
  onFilterChange,
}: HomeHeaderProps) {
  const { settings } = useUserSettings();
  const statusQuery = useSwiggyStatus();
  const name = settings.name || 'Aryan';
  const connected = statusQuery.data?.connected ?? false;
  const orderQuery = searchQuery.trim() || FILTER_LABELS[activeFilter];

  return (
    <header className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {getGreeting()}, {name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            You&apos;re on track today. I&apos;ve prepared meals that fit your nutrition goals and budget.
          </p>
        </div>
        <Button
          size="lg"
          className="h-10 rounded-lg px-5 font-semibold"
          onClick={() => {
            if (!connected) {
              window.location.href = '/api/auth/swiggy/login';
              return;
            }

            const query = encodeURIComponent(orderQuery);
            window.open(`https://www.swiggy.com/search?query=${query}`, '_blank', 'noopener');
            toast.success('Opening Swiggy order flow');
          }}
        >
          {getOrderLabel()}
        </Button>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search dishes, restaurants..."
          className="bg-card h-11 w-full rounded-lg pr-4 pl-10 text-sm outline-none ring-1 ring-white/8 transition-shadow focus:ring-[#FC8019]/40"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {SEARCH_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={
              activeFilter === filter
                ? 'rounded-lg bg-[#FC8019] px-3 py-1.5 text-xs font-semibold text-[#1a1a1a]'
                : 'bg-card text-muted-foreground rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ring-white/8 transition-colors hover:text-foreground'
            }
          >
            {FILTER_LABELS[filter]}
          </button>
        ))}
      </div>
    </header>
  );
}
