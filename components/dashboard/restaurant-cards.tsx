import { Star, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '@/types';
import { formatCurrency } from '@/utils/format';

export function RestaurantCards({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Restaurant Cards
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="border-border/60 flex flex-col justify-between gap-3 rounded-xl border p-4"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">{restaurant.name}</p>
              <p className="text-muted-foreground text-xs">{restaurant.cuisine}</p>
              <div className="text-muted-foreground flex items-center gap-3 pt-1 text-xs">
                <span className="flex items-center gap-1">
                  <Star className="fill-primary text-primary size-3" />
                  {restaurant.rating}
                </span>
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
        ))}
      </CardContent>
    </Card>
  );
}
