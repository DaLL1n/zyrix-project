import { RegisterForm } from '@/features/auth';
import styles from './RegisterPage.module.scss';

export const RegisterPage = () => {
  return (
    <section className={styles['register-page']}>
      <h1 className="visually-hidden">Register</h1>
      <RegisterForm />
    </section>
  );
};
