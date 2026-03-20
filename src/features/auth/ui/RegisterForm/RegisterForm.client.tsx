'use client';

import { useActionState, useCallback, useState } from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { AuthFormLayout, Input, InputPassword } from '@/shared/ui';
import { PATHS } from '@/shared/config';
import { authAction } from '../../api/authAction.server';
import { registerSchema } from '../../model/auth.schemas';
import { REGISTER_FORM_CONTENT, REGISTER_FORM_FIELDS } from './constants';
import styles from './RegisterForm.module.scss';

/**
 * Форма регистрации с клиентской и серверной валидацией (Progressive Enhancement).
 * Использует '@conform-to/react' для управления состоянием и 'useActionState' для обработки Server Actions.
 *
 * @returns {JSX.Element}
 */
export const RegisterForm = () => {
  const [showPasswords, setShowPasswords] = useState(false);

  // Привязываем тип 'register' аргументом к универсальному Server Action
  const registerAction = authAction.bind(null, 'register');
  const [state, formAction] = useActionState(registerAction, undefined);

  const [form, fields] = useForm({
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema });
    },
    // Валидация срабатывает сразу при вводе для мгновенного фидбека
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
  });

  const toggleShowPasswords = useCallback(() => {
    setShowPasswords((prev) => !prev);
  }, []);

  return (
    <AuthFormLayout
      id={form.id}
      action={formAction}
      onSubmit={form.onSubmit}
      buttonText={REGISTER_FORM_CONTENT.buttonText}
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
