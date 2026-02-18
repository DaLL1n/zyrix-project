import styles from './NavMenu.module.scss';
import { PathsHeaderKey, PathsHeaderValue } from '@/shared/config';
import { HeaderNavMenu } from './HeaderNavMenu.client';

export interface HeaderProps {
  path: { label: PathsHeaderKey; href: PathsHeaderValue }[];
}

// Компонент-обёртка для навигационного меню
// Принимает children (вложенные элементы) и оборачивает их в тег <nav> с применением стилей
const NavMenuLayout = ({ children }: { children: React.ReactNode }) => {
  return <nav className={styles['nav-menu']}>{children}</nav>;
};

// Экспортируем компонент NavMenu с прикреплённым подкомпонентом Header
export const NavMenu = Object.assign(NavMenuLayout, { Header: HeaderNavMenu });
