export const EXTERNAL_LINKS = {
  INSTAGRAM: 'https://www.instagram.com/zyrixexchange/',
  FACEBOOK: 'https://www.facebook.com/zyrixexchange',
  TWITTER: 'https://twitter.com/zyrixexchange',
  LINKEDIN: 'https://www.linkedin.com/company/zyrixexchange/',
  TELEGRAM: 'https://t.me/zyrixexchange',
} as const;

export type ExternalLinkKey = keyof typeof EXTERNAL_LINKS;
export type ExternalLinkValue = (typeof EXTERNAL_LINKS)[ExternalLinkKey];
