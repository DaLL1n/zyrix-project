'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NavMenu } from '@/shared/ui';
import { HEADER_NAV_ITEMS } from '../../model/constants';
import styles from './NavMenu.module.scss';

export const HeaderNavMenu = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return clsx(styles['link'], {
      [styles['link-active']]: pathname === href,
    });
  };

  return (
    <NavMenu className={styles['list']}>
      {HEADER_NAV_ITEMS.map(({ label, href }) => (
        <li className={styles['item']} key={href}>
          <Link className={isActive(href)} href={href}>
            {label}
          </Link>
        </li>
      ))}
    </NavMenu>
  );
};
