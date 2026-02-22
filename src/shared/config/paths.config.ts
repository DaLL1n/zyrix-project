export const PATHS = {
  HOME: '/',
  MARKET: '/market',
  SPOT: '/spot',
  SUPPORT: '/support',
  LEARN: '/learn',
  EXCHANGE: '/exchange',
  P2P_TRADING: '/p2p-trading',
  SECURITIES_TRADING: '/securities-trading',
  MOBILE_APP: '/mobile-app',
  LENDING_PRO: '/lending-pro',
  REPORTING_APP: '/reporting-app',
  ABOUT: '/about',
  AFFILIATES: '/affiliates',
  CAREERS: '/careers',
  ANNOUNCEMENT: '/announcement',
  HELP_CENTER: '/help-center',
  CONTACT_US: '/contact-us',
  STATUS: '/status',
} as const;

export type AppPathKey = keyof typeof PATHS;
export type AppPathValue = (typeof PATHS)[AppPathKey];
