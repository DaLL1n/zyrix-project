import { PathsHeaderKey, PathsHeaderValue } from '@/shared/config';

interface HeaderNavItem {
  label: PathsHeaderKey;
  href: PathsHeaderValue;
}

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'MARKET', href: '/market' },
  { label: 'SPOT', href: '/spot' },
  { label: 'SUPPORT', href: '/support' },
  { label: 'LEARN', href: '/learn' },
];
