'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/shared/logo';
import { APP_NAV_ITEMS } from '@/constants/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-sidebar hidden w-60 shrink-0 flex-col px-4 py-6 md:flex">
      <Link href="/" className="px-2">
        <Logo />
      </Link>
      <nav className="mt-8 flex flex-col gap-1">
        {APP_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-muted-foreground transition-smooth flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
