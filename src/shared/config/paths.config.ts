export const PATHS = {
  HEADER: [
    {
      HOME: '/',
      MARKET: '/market',
      SPOT: '/spot',
      SUPPORT: '/support',
      LEARN: '/learn',
    },
  ],
} as const;

export type PathsHeaderKey = keyof (typeof PATHS.HEADER)[0];
export type PathsHeaderValue = (typeof PATHS.HEADER)[0][PathsHeaderKey];
