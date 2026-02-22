import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import type { SocialListName } from './SocialList.types';
import styles from './SocialList.module.scss';

interface SocialListProps {
  className?: string;
  socialLinks: { name: SocialListName; href: string }[];
}

export const SocialList = ({ className, socialLinks }: SocialListProps) => {
  const socialListClass = clsx(styles['social-list'], className);
  return (
    <ul className={socialListClass}>
      {socialLinks.map(({ name, href }) => (
        <li className={styles['item']} key={name}>
          <a
            className={styles['link']}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit our ${name}`}
          >
            <Icon
              className={styles['icon']}
              name={name}
              width={24}
              height={24}
            />
          </a>
        </li>
      ))}
    </ul>
  );
};
