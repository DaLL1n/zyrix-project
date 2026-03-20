import Link from 'next/link';
import { Button, Icon } from '@/shared/ui';
import { HEADER_NAV_ITEMS } from '../model/constants';
import { UtilityActions } from './UtilityActions/UtilityActions.client';
import { HeaderNavMenu } from './NavMenu/NavMenu.client';
import styles from './Header.module.scss';
import { PATHS } from '@/shared/config';

export const Header = () => {
  return (
    <header className={styles['header']}>
      <div className={styles['wrapper']}>
        <div className={styles['nav-container']}>
          <Link
            className={styles['logo-link']}
            href={HEADER_NAV_ITEMS[0].href}
            aria-label="back to home"
          >
            <Icon
              className={styles['logo-icon']}
              name="logo"
              width={106}
              height={36}
              aria-label="Zyrix logo"
            />
          </Link>
          <HeaderNavMenu />
        </div>
        <div className={styles['actions']}>
          <UtilityActions />
          <div className={styles['auth-actions']}>
            <Button className={styles['auth-link']} href={PATHS.REGISTER}>
              Sign up
            </Button>
            <Button
              className={styles['auth-link']}
              href={PATHS.LOGIN}
              variant="secondary"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
