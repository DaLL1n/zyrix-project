import styles from './layout.module.scss';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className={styles['main-auth']}>{children}</main>;
};

export default AuthLayout;
