'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSwiggyStatus } from '@/hooks/use-swiggy';

const SWIGGY_LOGIN_URL = '/api/auth/swiggy/login?next=/dashboard';

export function SwiggyLoginOption() {
  const searchParams = useSearchParams();
  const statusQuery = useSwiggyStatus();
  const connected = statusQuery.data?.connected ?? false;

  useEffect(() => {
    if (searchParams.get('swiggy') === 'connected') {
      toast.success('Swiggy connected successfully.');
    }
  }, [searchParams]);

  if (statusQuery.isLoading) {
    return (
      <div className="flex justify-center py-2">
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
      </div>
    );
  }

  if (connected) {
    return (
      <div className="space-y-3">
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
          <Check className="text-primary size-4" />
          Swiggy connected
        </div>
        <Button asChild className="w-full">
          <Link href="/dashboard">Continue to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Separator />
      <p className="text-muted-foreground text-center text-sm">
        Or connect Swiggy to browse real restaurants and menus
      </p>
      <Button variant="outline" className="w-full" asChild>
        <Link href={SWIGGY_LOGIN_URL}>Connect Swiggy</Link>
      </Button>
    </div>
  );
}
