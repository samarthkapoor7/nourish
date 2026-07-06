'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function SwiggyConnectedToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('swiggy') === 'connected') {
      toast.success('Swiggy connected successfully.');
    }
  }, [searchParams]);

  return null;
}
