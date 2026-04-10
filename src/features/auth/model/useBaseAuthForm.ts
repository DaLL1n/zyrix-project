import { useActionState } from 'react';
import { useForm, type SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import type { signInSchema, signUpSchema } from './auth.schemas';

// Это тип ответа server action, который потом попадает в lastResult у Conform.
type AuthFormState = SubmissionResult<string[]> | undefined;

type AuthFormAction = (
  prevState: AuthFormState,
  payload: FormData,
) => AuthFormState | Promise<AuthFormState>;

// Базовый хук принимает только схемы auth-форм.
type AuthSchema = typeof signUpSchema | typeof signInSchema;

/**
 * Базовый хук для auth-форм.
 * Возвращает form и fields из Conform, formAction для <form action> и флаг pending.
 */
export const useBaseAuthForm = <TSchema extends AuthSchema>(
  action: AuthFormAction,
  authSchema: TSchema,
) => {
  // state нужен для Conform, formAction потом передается в <form action={...}>.
  const [state, formAction, isPending] = useActionState(action, undefined);

  const [form, fields] = useForm({
    // Через lastResult Conform получает ошибки из server action.
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: authSchema });
    },
    // Проверяем форму при вводе, чтобы ошибки и состояние кнопки обновлялись сразу.
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
  });

  return { form, fields, isPending, formAction } as const;
};
