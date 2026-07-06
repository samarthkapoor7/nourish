'use client';

import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardSkeleton } from '@/components/shared/card-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { SwiggyConnectPrompt, SwiggyFoodImage } from '@/components/swiggy/swiggy-ui';
import { useSwiggyMenu, useSwiggyStatus } from '@/hooks/use-swiggy';
import type { MenuItem } from '@/types';
import { formatCurrency } from '@/utils/format';

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="border-border/60 flex flex-col overflow-hidden rounded-xl border">
      <div className="bg-muted relative aspect-square w-full">
        <SwiggyFoodImage src={item.imageUrl} alt={item.name} />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{item.name}</p>
          {item.isVeg && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              Veg
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-xs">{item.restaurantName}</p>
        {item.description && (
          <p className="text-muted-foreground line-clamp-2 text-xs">{item.description}</p>
        )}
        <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
      </div>
    </div>
  );
}

export function SwiggyMenuSection() {
  const statusQuery = useSwiggyStatus();
  const connected = statusQuery.data?.connected ?? false;
  const menuQuery = useSwiggyMenu(connected);

  if (statusQuery.isLoading) {
    return <CardSkeleton />;
  }

  if (!connected) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Menu Picks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SwiggyConnectPrompt message="Connect Swiggy to browse real dishes with photos from nearby restaurants." />
        </CardContent>
      </Card>
    );
  }

  if (menuQuery.isLoading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium">Menu Picks</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (menuQuery.isError) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium">Menu Picks</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message={menuQuery.error.message} onRetry={() => menuQuery.refetch()} />
        </CardContent>
      </Card>
    );
  }

  const items = menuQuery.data?.items ?? [];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">Menu Picks</CardTitle>
        {menuQuery.data?.query && (
          <p className="text-muted-foreground text-xs">
            Dishes matching &ldquo;{menuQuery.data.query}&rdquo; from open restaurants
          </p>
        )}
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">
            No menu items found right now. Try again later or update your delivery address.
          </p>
        ) : (
          items.map((item) => <MenuItemCard key={`${item.restaurantId}-${item.id}`} item={item} />)
        )}
      </CardContent>
    </Card>
  );
}
