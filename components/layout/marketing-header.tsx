import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';

export function MarketingHeader() {
  return (
    <header className="border-border/40 bg-background/90 sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="rounded-xl">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl">
            <Link href="/onboarding">Plan Today&apos;s Meals</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
