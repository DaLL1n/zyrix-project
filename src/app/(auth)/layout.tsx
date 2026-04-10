import styles from './layout.module.scss';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={styles['main-auth']}>
      <div className={styles['auth-content']}>{children}</div>
    </main>
  );
};

export default AuthLayout;
