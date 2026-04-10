'use client';

import { useCallback, useState } from 'react';
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

  const { formAction, form, isPending, isReadyToSubmit } = useSignInForm();
  return (
    <AuthFormLayout
      id={form.id}
      action={formAction}
      onSubmit={form.onSubmit}
      isSubmitDisabled={isPending || !isReadyToSubmit}
      buttonText={SIGN_IN_FORM_CONTENT.buttonText}
      footerText={SIGN_IN_FORM_CONTENT.footerText}
      footerLinkText={SIGN_IN_FORM_CONTENT.footerLinkText}
      footerLinkHref={PATHS['SIGN_UP']}
    >
      <Input className={styles['input']} {...SIGN_IN_FORM_FIELDS.email} />

      <InputPassword
        className={styles['input']}
        {...SIGN_IN_FORM_FIELDS.password}
        isVisible={showPasswords}
        onToggleVisibility={toggleShowPasswords}
      />
    </AuthFormLayout>
  );
};
