import {
  EXTERNAL_LINKS,
  PATHS,
  type AppPathValue,
  type ExternalLinkValue,
} from '@/shared/config';
import type { SocialListName } from '@/shared/ui';

interface FooterNavItem {
  title: string;
  links: {
    label: string;
    href: AppPathValue;
  }[];
}

export const FOOTER_NAV_ITEMS: FooterNavItem[] = [
  {
    title: 'Services',
    links: [
      { label: 'Exchange', href: PATHS.EXCHANGE },
      { label: 'Spot', href: PATHS.SPOT },
      { label: 'P2P Trading', href: PATHS.P2P_TRADING },
      { label: 'Securities Trading', href: PATHS.SECURITIES_TRADING },
    ],
  },

  {
    title: 'Product',
    links: [
      { label: 'Mobile App', href: PATHS.MOBILE_APP },
      { label: 'Lending Pro', href: PATHS.LENDING_PRO },
      { label: 'Reporting App', href: PATHS.REPORTING_APP },
    ],
  },

  {
    title: 'Company',
    links: [
      { label: 'About', href: PATHS.ABOUT },
      { label: 'Affiliates', href: PATHS.AFFILIATES },
      { label: 'Careers', href: PATHS.CAREERS },
      { label: 'Announcement', href: PATHS.ANNOUNCEMENT },
    ],
  },

  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: PATHS.HELP_CENTER },
      { label: 'Contact Us', href: PATHS.CONTACT_US },
      { label: 'Status', href: PATHS.STATUS },
      { label: 'Learn', href: PATHS.LEARN },
    ],
  },
];

interface SocialItem {
  name: SocialListName;
  href: ExternalLinkValue;
}

export const SOCIAL_ITEMS: SocialItem[] = [
  { name: 'instagram', href: EXTERNAL_LINKS.INSTAGRAM },
  { name: 'facebook', href: EXTERNAL_LINKS.FACEBOOK },
  { name: 'twitter', href: EXTERNAL_LINKS.TWITTER },
  { name: 'linkedin', href: EXTERNAL_LINKS.LINKEDIN },
  { name: 'telegram', href: EXTERNAL_LINKS.TELEGRAM },
];
