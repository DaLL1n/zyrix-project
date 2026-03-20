import { useActionState } from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { authAction } from '../api/authAction.server';
import { REGISTER_FORM_FIELDS } from '../ui/RegisterForm/constants';
import { registerSchema } from './auth.schemas';

export const useRegisterForm = () => {
  // Биндим intent ('register') для переиспользования единого Server Action под разные типы авторизации
  const registerAction = authAction.bind(null, 'register');
  const [state, formAction] = useActionState(registerAction, undefined);

  const [form, fields] = useForm({
    // Синхронизация формы с ответом Server Action для отображения серверных ошибок
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema });
    },
    // Мгновенный фидбек валидации при вводе (UX), не дожидаясь потери фокуса (onBlur)
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
  });

  // Строгая проверка (кросс-чек) всех полей рантайме для блокировки/разблокировки submit-кнопки
  const isReadyToSubmit = REGISTER_FORM_FIELDS.every((field) => {
    const conformField = fields[field.name as keyof typeof fields];
    return conformField.dirty && conformField.valid;
  });

  return {
    form,
    fields,
    isReadyToSubmit,
    formAction,
  };
};
