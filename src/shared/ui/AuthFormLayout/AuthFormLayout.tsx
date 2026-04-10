import type { SubmitEvent } from 'react';
import Link from 'next/link';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import styles from './AuthFormLayout.module.scss';


type AuthFormLayoutProps = {
  /** Идентификатор form, если ее нужно связать с внешними элементами. */
  id?: string;
  /** Поля и дополнительные элементы конкретной auth-формы. */
  children: React.ReactNode;
  /** Клиентский submit-обработчик, например от form library. */
  onSubmit?: (event: SubmitEvent<HTMLFormElement>) => void;
  /** Server Action, которая получает FormData после отправки формы. */
  action: (payload: FormData) => void;
  /** Общая ошибка формы, не привязанная к отдельному полю. */
  formError?: string;
  /** Текст основной кнопки отправки. */
  buttonText: string;
  /** Блокирует submit, когда форма не готова или запрос уже выполняется. */
  isSubmitDisabled?: boolean;
  /** Текст перед ссылкой на соседний auth-сценарий. */
  footerText?: string;
  /** Текст ссылки в нижней навигации. */
  footerLinkText?: string;
  /** Маршрут для нижней навигации между auth-сценариями. */
  footerLinkHref?: string;
};

/**
 * Общий каркас auth-формы: логотип, область общей ошибки, слот под поля,
 * submit-кнопка и опциональная ссылка на соседний auth-сценарий.
 */
export const AuthFormLayout = ({
  id,
  children,
  onSubmit,
  action,
  formError,
  buttonText,
  isSubmitDisabled,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthFormLayoutProps) => {
  return (
    <div className={styles['auth-form-layout']}>
      <Link className={styles['logo-link']} href="/">
        <Icon name="logo" width={132} height={60} />
      </Link>
      {/* Общая ошибка живет вне fieldset, чтобы показывать сбой всего submit, а не конкретного поля. */}
      <span className={styles['form-error']}>{formError}</span>
      {/* Нативную валидацию отключаем, чтобы не смешивать browser UI с единым источником ошибок формы. */}
      <form
        id={id}
        className={styles['form']}
        onSubmit={onSubmit}
        action={action}
        noValidate
      >
        <fieldset className={styles['fieldset']}>{children}</fieldset>
        <Button
          className={styles['submit-button']}
          type="submit"
          disabled={isSubmitDisabled}
        >
          {buttonText}
        </Button>
      </form>
      {/* Нижняя навигация опциональна, чтобы один layout переиспользовался в разных auth-flow. */}
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



