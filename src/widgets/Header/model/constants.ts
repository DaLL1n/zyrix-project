import { PATHS, type AppPathValue } from '@/shared/config';

interface HeaderNavItem {
  label: string;
  href: AppPathValue;
}

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Home', href: PATHS.HOME },
  { label: 'Market', href: PATHS.MARKET },
  { label: 'Spot', href: PATHS.SPOT },
  { label: 'Support', href: PATHS.SUPPORT },
  { label: 'Learn', href: PATHS.LEARN },
];
