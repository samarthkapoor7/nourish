'use client';

import { Loader2 } from 'lucide-react';
import { Star, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { SwiggyConnectPrompt, SwiggyFoodImage } from '@/components/swiggy/swiggy-ui';
import { useSwiggyRestaurants, useSwiggyStatus } from '@/hooks/use-swiggy';
import type { Restaurant } from '@/types';
import { formatCurrency } from '@/utils/format';

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="border-border/60 flex flex-col overflow-hidden rounded-xl border">
      <div className="bg-muted relative aspect-[16/10] w-full">
        <SwiggyFoodImage src={restaurant.imageUrl} alt={restaurant.name} />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">{restaurant.name}</p>
          <p className="text-muted-foreground text-xs">{restaurant.cuisine}</p>
          <div className="text-muted-foreground flex items-center gap-3 pt-1 text-xs">
            {restaurant.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="fill-primary text-primary size-3" />
                {restaurant.rating.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Timer className="size-3" />
              {restaurant.etaMinutes} min
            </span>
          </div>
          <p className="text-primary pt-1 text-xs">{restaurant.matchReason}</p>
        </div>
        <Button size="sm" variant="outline" disabled>
          {formatCurrency(restaurant.priceForOne)} for one
        </Button>
      </div>
    </div>
  );
}

export function SwiggyRestaurantsSection() {
  const statusQuery = useSwiggyStatus();
  const connected = statusQuery.data?.connected ?? false;
  const restaurantsQuery = useSwiggyRestaurants(connected);

  if (statusQuery.isLoading) {
    return <CardSkeleton />;
  }

  if (!connected) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Nearby Restaurants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SwiggyConnectPrompt />
        </CardContent>
      </Card>
    );
  }

  if (restaurantsQuery.isLoading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Nearby Restaurants
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (restaurantsQuery.isError) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Nearby Restaurants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            message={restaurantsQuery.error.message}
            onRetry={() => restaurantsQuery.refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  const restaurants = restaurantsQuery.data?.restaurants ?? [];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Nearby Restaurants
        </CardTitle>
        {restaurantsQuery.data?.query && (
          <p className="text-muted-foreground text-xs">
            Showing results for &ldquo;{restaurantsQuery.data.query}&rdquo; near your Swiggy address
          </p>
        )}
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">
            No open restaurants found. Try changing your delivery address in Settings.
          </p>
        ) : (
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
