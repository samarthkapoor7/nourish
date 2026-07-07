'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, MapPin, Unplug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useSelectSwiggyAddress,
  useSwiggyAddresses,
  useSwiggyLogout,
  useSwiggyStatus,
} from '@/hooks/use-swiggy';
import { SwiggyConnectPrompt } from '@/components/swiggy/swiggy-ui';

export function SwiggyConnectCard() {
  const searchParams = useSearchParams();
  const statusQuery = useSwiggyStatus();
  const connected = statusQuery.data?.connected ?? false;
  const addressesQuery = useSwiggyAddresses(connected);
  const selectAddress = useSelectSwiggyAddress();
  const logout = useSwiggyLogout();

  useEffect(() => {
    if (searchParams.get('swiggy') === 'connected') {
      toast.success('Swiggy connected successfully.');
    }
  }, [searchParams]);

  if (statusQuery.isLoading) {
    return (
      <Card className="bg-card rounded-xl ring-1 ring-white/6">
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="text-muted-foreground size-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!connected) {
    return (
      <Card className="bg-card rounded-xl ring-1 ring-white/6">
        <CardHeader>
          <CardTitle className="text-base">Swiggy</CardTitle>
          <CardDescription>
            Connect your Swiggy account to load real restaurants and menus on the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SwiggyConnectPrompt />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card rounded-xl ring-1 ring-white/6">
      <CardHeader>
        <CardTitle className="text-base">Swiggy</CardTitle>
        <CardDescription>Connected — live restaurant and menu data is enabled.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="swiggy-address">Delivery address</Label>
          {addressesQuery.isLoading ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" />
              Loading addresses…
            </div>
          ) : (
            <Select
              value={addressesQuery.data?.selectedAddressId ?? undefined}
              onValueChange={(addressId) => selectAddress.mutate(addressId)}
              disabled={selectAddress.isPending || !addressesQuery.data?.addresses.length}
            >
              <SelectTrigger id="swiggy-address" className="w-full">
                <SelectValue placeholder="Choose a delivery address" />
              </SelectTrigger>
              <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
                {addressesQuery.data?.addresses.map((address) => (
                  <SelectItem key={address.addressId} value={address.addressId}>
                    <span className="flex items-start gap-2 text-left">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      <span className="line-clamp-2">{address.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">View live restaurants</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <Unplug className="size-4" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
