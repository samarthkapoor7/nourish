import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  CalendarDays,
  ChartColumnIncreasing,
  House,
  Package,
  SlidersHorizontal,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const APP_NAV_ITEMS: NavItem[] = [
  { label: 'Today', href: '/dashboard', icon: House },
  { label: 'Nutrition Assistant', href: '/activity', icon: Bot },
  { label: 'Meal Plans', href: '/plan', icon: CalendarDays },
  { label: 'Orders', href: '/orders', icon: Package },
  { label: 'Progress', href: '/history', icon: ChartColumnIncreasing },
  { label: 'Preferences', href: '/settings', icon: SlidersHorizontal },
];
