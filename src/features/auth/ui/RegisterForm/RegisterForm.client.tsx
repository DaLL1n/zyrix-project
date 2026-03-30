'use client';

import { useCallback, useState } from 'react';
import { getInputProps } from '@conform-to/react';
import { AuthFormLayout, Checkbox, Input, InputPassword } from '@/shared/ui';
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

  const {
    form,
    fields,
    isPending,
    isReadyToSubmit,
    formAction,
    termsAcceptedValidity,
  } = useRegisterForm();

  const toggleShowPasswords = useCallback(() => {
    setShowPasswords((prev) => !prev);
  }, []);

  return (
    <AuthFormLayout
      id={form.id}
      action={formAction}
      onSubmit={form.onSubmit}
      formError={form.errors?.[0]}
      buttonText={REGISTER_FORM_CONTENT.buttonText}
      isSubmitDisabled={!isReadyToSubmit || isPending}
      footerText={REGISTER_FORM_CONTENT.footerText}
      footerLinkText={REGISTER_FORM_CONTENT.footerLink}
      footerLinkHref={PATHS.LOGIN}
    >
      {REGISTER_FORM_FIELDS.map((field) => {
        const conformField = fields[field.name as keyof typeof fields];

        const isValidField = conformField.dirty && conformField.valid;

        const conformProps = getInputProps(conformField, {
          type: field.type,
        });
        const uiProps = {
          className: styles['input'],
          placeholder: field.placeholder,
          autoComplete: field.autoComplete,
          'aria-autocomplete': field['aria-autocomplete'],
          'aria-label': field['aria-label'],
          error: conformField.errors?.[0],
          isValid: isValidField,
        };

        const renderInputField = () => {
          switch (field.name) {
            case 'password':
              return (
                <InputPassword
                  isVisible={showPasswords}
                  onToggleVisibility={toggleShowPasswords}
                  {...uiProps}
                  {...conformProps}
                />
              );
            case 'confirmPassword':
              return (
                <InputPassword
                  hideToggleButton
                  isVisible={showPasswords}
                  {...uiProps}
                  {...conformProps}
                />
              );
            default:
              return <Input {...uiProps} {...conformProps} />;
          }
        };

        return (
          <div className={styles['input-wrapper']} key={field.name}>
            {renderInputField()}
          </div>
        );
      })}

      <Checkbox
        label={REGISTER_FORM_CONTENT.checkboxText}
        isValid={termsAcceptedValidity()}
        {...getInputProps(fields.termsAccepted, { type: 'checkbox' })}
      />
    </AuthFormLayout>
  );
};
