import type { IconName } from '../Icon/Icon.types';

export type SocialListName = Extract<
  IconName,
  'facebook' | 'instagram' | 'linkedin' | 'telegram' | 'twitter'
>;
