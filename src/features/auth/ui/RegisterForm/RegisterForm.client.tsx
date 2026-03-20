'use client';

import { useCallback, useState } from 'react';
import { AuthFormLayout, Input, InputPassword } from '@/shared/ui';
import { PATHS } from '@/shared/config';
import { useRegisterForm } from '../../model/useRegisterForm';
import { REGISTER_FORM_CONTENT, REGISTER_FORM_FIELDS } from './constants';
import styles from './RegisterForm.module.scss';

/**
 * Форма регистрации с клиентской и серверной валидацией (Progressive Enhancement).
 * Использует '@conform-to/react' для управления состоянием и 'useActionState' для обработки Server Actions.
 */
export const RegisterForm = () => {
  const [showPasswords, setShowPasswords] = useState(false);
  const { form, fields, isReadyToSubmit, formAction } = useRegisterForm();
  const toggleShowPasswords = useCallback(() => {
    setShowPasswords((prev) => !prev);
  }, []);

  return (
    <AuthFormLayout
      id={form.id}
      action={formAction}
      onSubmit={form.onSubmit}
      buttonText={REGISTER_FORM_CONTENT.buttonText}
      isSubmitDisabled={!isReadyToSubmit}
      footerText={REGISTER_FORM_CONTENT.footerText}
      footerLinkText={REGISTER_FORM_CONTENT.footerLink}
      footerLinkHref={PATHS.LOGIN}
    >
      {REGISTER_FORM_FIELDS.map((field) => {
        const conformField = fields[field.name as keyof typeof fields];

        const isValidField = conformField.dirty && conformField.valid;

        const inputProps = {
          ...field,
          className: styles['input'],
          name: conformField.name,
          defaultValue: conformField.defaultValue,
          error: conformField.errors?.[0],
          isValid: isValidField,
          'aria-invalid': Boolean(conformField.errors),
        };

        const inputFields = () => {
          switch (field.name) {
            case 'password':
              return (
                <InputPassword
                  externalIsVisible={showPasswords}
                  onToggleVisibility={toggleShowPasswords}
                  {...inputProps}
                />
              );
            case 'confirmPassword':
              return (
                <InputPassword
                  externalIsVisible={showPasswords}
                  hideToggleButton
                  {...inputProps}
                />
              );
            default:
              return <Input {...inputProps} />;
          }
        };

        return (
          <div className={styles['input-wrapper']} key={field.name}>
            {inputFields()}
          </div>
        );
      })}
    </AuthFormLayout>
  );
};
