import type { SubmitEvent } from 'react';
import Link from 'next/link';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import styles from './AuthFormLayout.module.scss';

type AuthFormLayoutProps = {
  id?: string;
  children: React.ReactNode;
  onSubmit?: (event: SubmitEvent<HTMLFormElement>) => void;
  action: (payload: FormData) => void;
  buttonText: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
};

export const AuthFormLayout = ({
  id,
  children,
  onSubmit,
  action,
  buttonText,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthFormLayoutProps) => {
  return (
    <div className={styles['auth-form-layout']}>
      <Link className={styles['logo-link']} href="/">
        <Icon name="logo" width={132} height={60} />
      </Link>
      <form
        id={id}
        className={styles['form']}
        onSubmit={onSubmit}
        action={action}
        noValidate
      >
        <fieldset className={styles['fieldset']}>{children}</fieldset>
        <Button className={styles['submit-button']} type="submit">
          {buttonText}
        </Button>
      </form>
      {footerText && footerLinkText && footerLinkHref && (
        <p className={styles['navigation']}>
          {footerText}
          <Link className={styles['navigation-link']} href={footerLinkHref}>
            {footerLinkText}
          </Link>
        </p>
      )}
    </div>
  );
};
