'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Plug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isSwiggyReauthError } from '@/hooks/use-swiggy';

interface SwiggyConnectPromptProps {
  title?: string;
  message?: string;
  error?: unknown;
}

export function SwiggyConnectPrompt({
  title = 'Connect Swiggy to see live restaurants',
  message = 'Sign in with your Swiggy account to load real restaurants and menus near your delivery address.',
  error,
}: SwiggyConnectPromptProps) {
  const needsReauth = isSwiggyReauthError(error);

  return (
    <div className="border-border bg-card/50 flex flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-10 text-center">
      <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
        {needsReauth ? <AlertCircle className="size-6" /> : <Plug className="size-6" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {needsReauth ? 'Swiggy session expired' : title}
        </p>
        <p className="text-muted-foreground mx-auto max-w-md text-sm">
          {needsReauth
            ? 'Your Swiggy sign-in has expired. Connect again to keep loading live data.'
            : message}
        </p>
      </div>
      <Button asChild>
        <Link href="/api/auth/swiggy/login">
          {needsReauth ? 'Reconnect Swiggy' : 'Connect Swiggy'}
        </Link>
      </Button>
    </div>
  );
}

interface SwiggyFoodImageProps {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export function SwiggyFoodImage({
  src,
  alt,
  className = 'object-cover',
  sizes = '(max-width: 768px) 100vw, 33vw',
}: SwiggyFoodImageProps) {
  if (!src) {
    return (
      <div className="bg-muted text-muted-foreground flex size-full items-center justify-center text-xs">
        No image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      unoptimized
    />
  );
}
