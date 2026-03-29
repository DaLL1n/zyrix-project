import { useActionState } from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { authAction } from '../api/authAction.server';
import { registerSchema } from './auth.schemas';

const requiredFieldNames = [
  'name',
  'surname',
  'email',
  'password',
  'confirmPassword',
] as const;

/**
 * Собирает состояние формы регистрации на базе Conform и Server Action.
 * Параметров не принимает.
 *
 * @returns Объект с метаданными формы, обработчиком submit и вычислениями
 * для состояния кнопки отправки и чекбокса согласия.
 */
export const useRegisterForm = () => {
  // Привязываем intent один раз, чтобы использовать общий server action для регистрации.
  const registerAction = authAction.bind(null, 'register');
  const [state, formAction, isPending] = useActionState(
    registerAction,
    undefined,
  );

  const [form, fields] = useForm({
    // Conform подхватывает результат server action и раскладывает серверные ошибки по полям.
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema });
    },
    // Валидируем сразу при вводе, чтобы состояние полей и кнопки обновлялось без blur.
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
  });

  // Кнопку включаем только после изменения всех основных полей и успешной локальной валидации.
  const isReadyToSubmit = requiredFieldNames.every((name) => {
    const field = fields[name];
    return field.dirty && field.valid && fields.termsAccepted.dirty;
  });

  // Берем текущее состояние чекбокса из метаданных формы, чтобы не дублировать его в локальном state.
  const isChecked = Boolean(fields.termsAccepted.value);
  // Возвращаем tri-state для UI чекбокса: false, true или undefined, если состояние пока не нужно подсвечивать.
  const termsAcceptedValidity = () => {
    if (fields.termsAccepted.errors && !isChecked) return false;
    if (!fields.termsAccepted.errors && isChecked) return true;
  };

  return {
    form,
    fields,
    isPending,
    isReadyToSubmit,
    termsAcceptedValidity,
    formAction,
  };
};
