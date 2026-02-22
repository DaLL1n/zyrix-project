import { NavMenu } from '@/shared/ui';
import { FOOTER_NAV_ITEMS } from '../../model/constants';
import Link from 'next/link';
import styles from './FooterNavMenu.module.scss';

export const FooterNavMenu = () => {
  return (
    <NavMenu className={styles['list']}>
      {FOOTER_NAV_ITEMS.map(({ title, links }) => (
        <li className={styles['item']} key={title}>
          <span className={styles['title']}>{title}</span>
          <ul className={styles['list-links']}>
            {links.map(({ label, href }) => (
              <li className={styles['item-link']} key={href}>
                <Link className={styles['link']} href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </NavMenu>
  );
};
