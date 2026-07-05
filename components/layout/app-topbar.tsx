'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { APP_NAV_ITEMS } from '@/constants/navigation';
import { cn } from '@/lib/utils';

export function AppTopbar() {
  const pathname = usePathname();
  const activeItem = APP_NAV_ITEMS.find((item) => item.href === pathname);

  return (
    <header className="border-border/60 flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-medium">{activeItem?.label ?? 'Nourish'}</h1>
      </div>

      <nav className="flex items-center gap-1 md:hidden">
        {APP_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg p-2 transition-colors',
              pathname === item.href && 'bg-accent text-accent-foreground',
            )}
          >
            <item.icon className="size-4" />
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                NR
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
