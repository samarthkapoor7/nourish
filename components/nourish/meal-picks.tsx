'use client';

import { Star, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { SwiggyConnectPrompt, SwiggyFoodImage } from '@/components/swiggy/swiggy-ui';
import { useSwiggyMenu, useSwiggyStatus } from '@/hooks/use-swiggy';
import type { SearchFilter } from '@/components/nourish/home-header';
import type { MealRecommendation, MenuItem } from '@/types';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

interface MealPicksProps {
  searchQuery: string;
  activeFilter: SearchFilter;
}

const FILTER_TO_MENU_QUERY: Record<SearchFilter, string> = {
  all: 'healthy',
  'high-protein': 'high protein',
  'under-budget': 'value meal',
  vegetarian: 'veg',
  'quick-delivery': 'quick bite',
};

function mapMenuToRecommendation(index: number, item: MenuItem): MealRecommendation {
  const derivedProtein = 22 + (index % 5) * 6;
  const derivedCalories = 260 + (index % 5) * 75;
  const derivedEta = 15 + (index % 5) * 3;

  return {
    id: `swiggy-${item.restaurantId}-${item.id}-${index}`,
    name: item.name,
    restaurantName: item.restaurantName,
    imageUrl:
      item.imageUrl ??
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    rating: Number((4.2 + (index % 6) * 0.1).toFixed(1)),
    etaMinutes: derivedEta,
    distanceKm: Number((0.9 + index * 0.18).toFixed(1)),
    calories: derivedCalories,
    proteinGrams: derivedProtein,
    price: item.price,
    isVeg: Boolean(item.isVeg),
    healthScore: Math.max(74, Math.min(96, 86 + (index % 4) * 3 - (item.price > 350 ? 4 : 0))),
    tags: [
      derivedProtein >= 36 ? 'high-protein' : '',
      item.price <= 300 ? 'under-budget' : '',
      item.isVeg ? 'vegetarian' : '',
      derivedEta <= 20 ? 'quick-delivery' : '',
    ].filter(Boolean),
  };
}

function applyFilter(meals: MealRecommendation[], searchQuery: string, activeFilter: SearchFilter) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = meals.filter((meal) => {
    const queryMatches =
      !normalizedQuery ||
      meal.name.toLowerCase().includes(normalizedQuery) ||
      meal.restaurantName.toLowerCase().includes(normalizedQuery) ||
      meal.tags?.some((tag) => tag.includes(normalizedQuery));

    const filterMatches =
      activeFilter === 'all' ||
      meal.tags?.includes(activeFilter) ||
      (activeFilter === 'vegetarian' && meal.isVeg) ||
      (activeFilter === 'under-budget' && meal.price <= 300) ||
      (activeFilter === 'high-protein' && meal.proteinGrams >= 35) ||
      (activeFilter === 'quick-delivery' && meal.etaMinutes <= 20);

    return queryMatches && filterMatches;
  });

  return [...filtered].sort((a, b) => {
    switch (activeFilter) {
      case 'high-protein':
        return b.proteinGrams - a.proteinGrams;
      case 'under-budget':
        return a.price - b.price;
      case 'quick-delivery':
        return a.etaMinutes - b.etaMinutes;
      case 'vegetarian':
        return b.healthScore - a.healthScore;
      default:
        return b.rating - a.rating;
    }
  });
}

function DishCard({ meal }: { meal: MealRecommendation }) {
  return (
    <article className="bg-card group overflow-hidden rounded-xl ring-1 ring-white/6 transition-shadow hover:ring-white/12">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SwiggyFoodImage src={meal.imageUrl} alt={meal.name} />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <Badge
            variant="secondary"
            className="h-5 rounded bg-black/60 px-1.5 text-[10px] text-white backdrop-blur-sm"
          >
            {meal.isVeg ? 'VEG' : 'NON-VEG'}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{meal.name}</p>
            <p className="text-muted-foreground truncate text-xs">{meal.restaurantName}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium">
            <Star className="size-3 fill-[#FC8019] text-[#FC8019]" />
            {meal.rating.toFixed(1)}
          </span>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span>{formatCalories(meal.calories)}</span>
          <span>·</span>
          <span>{formatGrams(meal.proteinGrams)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5">
            <Timer className="size-3" />
            {meal.etaMinutes} mins
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm font-semibold">{formatCurrency(meal.price)}</p>
          <Button
            size="sm"
            className="h-8 rounded-lg px-3 text-xs font-semibold"
            onClick={() => {
              const query = encodeURIComponent(`${meal.name} ${meal.restaurantName}`);
              window.open(`https://www.swiggy.com/search?query=${query}`, '_blank', 'noopener');
              toast.success(`Opening ${meal.name} on Swiggy`);
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}

export function MealPicks({ searchQuery, activeFilter }: MealPicksProps) {
  const statusQuery = useSwiggyStatus();
  const connected = statusQuery.data?.connected ?? false;

  const menuQueryValue = searchQuery.trim() || FILTER_TO_MENU_QUERY[activeFilter];
  const menuQuery = useSwiggyMenu(connected, menuQueryValue);

  if (statusQuery.isLoading || menuQuery.isLoading) return <CardSkeleton />;

  if (!connected) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Picks for you</h2>
          <p className="text-muted-foreground text-sm">Connect Swiggy to load live food options</p>
        </div>
        <SwiggyConnectPrompt
          title="Connect Swiggy for live food options"
          message="Use your Swiggy account to fetch real menu items based on filters and search."
        />
      </section>
    );
  }

  if (menuQuery.isError) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Picks for you</h2>
          <p className="text-muted-foreground text-sm">Could not load live menu items</p>
        </div>
        <ErrorState message={menuQuery.error.message} onRetry={() => menuQuery.refetch()} />
      </section>
    );
  }

  const liveMeals = (menuQuery.data?.items ?? []).map((item, index) =>
    mapMenuToRecommendation(index, item),
  );
  const meals = applyFilter(liveMeals, searchQuery, activeFilter);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Picks for you</h2>
          <p className="text-muted-foreground text-sm">
            {meals.length} live options matched
            {activeFilter !== 'all' ? ` · ${activeFilter.replace('-', ' ')}` : ''}
          </p>
        </div>
      </div>

      {meals.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {meals.map((meal) => (
            <DishCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl p-6 text-sm ring-1 ring-white/6">
          <p className="font-medium">No dishes found</p>
          <p className="text-muted-foreground mt-1">
            Try another search term or choose a different filter.
          </p>
        </div>
      )}
    </section>
  );
}
