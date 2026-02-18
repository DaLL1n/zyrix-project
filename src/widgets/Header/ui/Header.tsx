import Link from 'next/link';

import { Button, Icon, NavMenu } from '@/shared/ui';

import { HEADER_NAV_ITEMS } from '../model/constants';
import { HeaderUtilityActions } from './HeaderUtilityActions/HeaderUtilityActions';

import styles from './Header.module.scss';

/**
 * @description UI-компонент для рендера заголовка страницы с навигацией, логотипом и действиями аутентификации.
 *
 * @returns Готовый header-элемент со ссылкой на главную страницу, меню навигации, утилитами и кнопками входа/регистрации.
 */
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
          <NavMenu>
            <NavMenu.Header path={HEADER_NAV_ITEMS} />
          </NavMenu>
        </div>
        <div className={styles['header-actions']}>
          <HeaderUtilityActions />
          <div className={styles['auth-actions']}>
            <Button className={styles['auth-link']} href="/signup">
              Sign up
            </Button>
            <Button
              className={styles['auth-link']}
              href="/login"
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
