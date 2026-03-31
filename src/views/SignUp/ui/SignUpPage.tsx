import { RegisterForm } from '@/features/auth';
import styles from './SignUpPage.module.scss';

export const SignUpPage = () => {
  return (
    <section className={styles['sign-up-page']}>
      <h1 className="visually-hidden">Sign Up</h1>
      <RegisterForm />
    </section>
  );
};
