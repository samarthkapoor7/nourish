'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Clock, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/plan', label: 'Plan', icon: CalendarDays },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="nourish-glass flex items-center gap-1 rounded-full px-2 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300',
                active
                  ? 'bg-[#FC8019] text-[#0B0B0B] shadow-[0_4px_16px_rgba(252,128,25,0.4)]'
                  : 'text-muted-foreground hover:text-white',
              )}
            >
              <item.icon className="size-4" />
              {active && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
