'use client';

import { useCallback, useState } from 'react';
import { getInputProps } from '@conform-to/react';
import { AuthFormLayout, Input, InputPassword } from '@/shared/ui';
import { PATHS } from '@/shared/config';
import { useSignInForm } from '../../model/useSignInForm';
import { SIGN_IN_FORM_CONTENT, SIGN_IN_FORM_FIELDS } from './consts';
import styles from './SignInForm.module.scss';

export const SignInForm = () => {
  const [showPasswords, setShowPasswords] = useState(false);

  const toggleShowPasswords = useCallback(() => {
    setShowPasswords((prev) => !prev);
  }, []);

  const { formAction, form, fields, isPending, isReadyToSubmit } =
    useSignInForm();

  const isValidEmail = fields.email.dirty && fields.email.valid;

  const conformPropsEmail = getInputProps(fields.email, {
    type: 'email',
  });
  const isValidPassword = fields.password.dirty && fields.password.valid;
  const conformPropsPassword = getInputProps(fields.password, {
    type: 'password',
  });

  return (
    <AuthFormLayout
      id={form.id}
      action={formAction}
      onSubmit={form.onSubmit}
      formError={form.errors?.[0]}
      isSubmitDisabled={isPending || !isReadyToSubmit}
      buttonText={SIGN_IN_FORM_CONTENT.buttonText}
      footerText={SIGN_IN_FORM_CONTENT.footerText}
      footerLinkText={SIGN_IN_FORM_CONTENT.footerLinkText}
      footerLinkHref={PATHS['SIGN_UP']}
    >
      <div className={styles['input-wrapper']}>
        <Input
          className={styles['input']}
          isValid={isValidEmail}
          error={fields.email.errors?.[0]}
          {...SIGN_IN_FORM_FIELDS.email}
          {...conformPropsEmail}
        />
      </div>
      <div className={styles['input-wrapper']}>
        <InputPassword
          className={styles['input']}
          isValid={isValidPassword}
          error={fields.password.errors?.[0]}
          isVisible={showPasswords}
          onToggleVisibility={toggleShowPasswords}
          {...SIGN_IN_FORM_FIELDS.password}
          {...conformPropsPassword}
        />
      </div>
    </AuthFormLayout>
  );
};
