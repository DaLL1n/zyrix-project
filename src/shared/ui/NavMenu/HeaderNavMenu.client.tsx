'use client';

import { usePathname } from 'next/navigation';

import Link from 'next/link';

import clsx from 'clsx';

import type { HeaderProps } from './NavMenu';

import styles from './NavMenu.module.scss';

/**
 * @description UI-компонент для рендера навигационного меню в заголовке с поддержкой активного состояния ссылок.
 *
 * @param path Массив объектов с данными навигационных ссылок (label и href).
 * @returns Готовый список (ul) с навигационными ссылками и подсвеченной активной ссылкой.
 */
export const HeaderNavMenu = ({ path }: HeaderProps) => {
  // Получаем текущий URL путь пользователя
  const pathname = usePathname();

  // Функция для определения активной ссылки и применения нужных стилей
  const isActive = (href: string) => {
    return clsx(styles['nav-menu-link'], {
      // Если текущий путь совпадает с href ссылки, добавляем стиль активной ссылки
      [styles['link-active']]: pathname === href,
    });
  };

  return (
    <ul className={styles['nav-menu-header']}>
      {path.map(({ label, href }) => (
        <li className={styles['nav-menu-item']} key={href}>
          <Link className={isActive(href)} href={href}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
