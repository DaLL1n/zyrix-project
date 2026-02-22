import styles from './NavMenu.module.scss';

interface NavMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const NavMenu = ({ children, className }: NavMenuProps) => {
  return (
    <nav className={styles['nav-menu']}>
      <ul className={className}>{children}</ul>
    </nav>
  );
};
