import { signUpAction } from '../api/signUpAction.server';
import { signUpSchema } from './auth.schemas';
import { useBaseAuthForm } from './useBaseAuthForm';

const requiredFieldNames = [
  'name',
  'surname',
  'email',
  'password',
  'confirmPassword',
] as const;

/**
 * Хук для формы регистрации.
 * Добавляет к базовой форме правила для submit и состояние чекбокса согласия.
 */
export const useSignUpForm = () => {
  const { form, fields, isPending, formAction } = useBaseAuthForm(
    signUpAction,
    signUpSchema,
  );

  // Текущее состояние чекбокса берем из Conform, а не храним отдельно в local state.
  const isChecked = Boolean(fields.termsAccepted.value);

  // Кнопку submit включаем только после ввода и проверки всех обязательных полей.
  const isReadyToSubmit = requiredFieldNames.every((name) => {
    const field = fields[name];
    return field.dirty && field.valid && isChecked;
  });

  // Для UI чекбокса возвращаем false, true или undefined, если подсветка пока не нужна.
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
