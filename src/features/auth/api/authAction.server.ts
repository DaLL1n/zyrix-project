'use server';

import { createClient } from '@/shared/api';
import { parseWithZod } from '@conform-to/zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { registerSchema } from '../model/auth.schemas';

type AuthType = 'register' | 'login';

const DUPLICATE_USER_ERROR_CODE = 'user_already_exists';
const DUPLICATE_USER_ERROR_MESSAGE = 'User already registered';

// Преобразуем техническую ошибку авторизации в понятный текст для интерфейса.
const getAuthErrorMessage = (
  errorCode: string | undefined,
  errorMessage: string,
) => {
  // Если пользователь уже зарегистрирован, показываем короткое и ясное сообщение.
  if (
    errorCode === DUPLICATE_USER_ERROR_CODE ||
    errorMessage.includes(DUPLICATE_USER_ERROR_MESSAGE)
  ) {
    return 'A user with this email is already registered';
  }

  // Для остальных ошибок оставляем исходный текст.
  return errorMessage;
};

export const authAction = async (
  authType: AuthType,
  prevState: unknown,
  formData: FormData,
) => {
  // Эта серверная функция обрабатывает отправку формы авторизации.
  // Сейчас внутри реализована регистрация пользователя через Supabase.

  // Пока для register и login используем одну и ту же схему.
  const schema = authType === 'register' ? registerSchema : registerSchema;

  // Сначала проверяем данные формы на сервере.
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    // Если форма не прошла проверку, возвращаем ошибки обратно в UI.
    // Поля с паролями скрываем, чтобы не отправлять их назад.
    return submission.reply({
      hideFields: ['password', 'confirmPassword'],
    });
  }

  const supabase = await createClient();

  // Отправляем данные регистрации в Supabase Auth.
  // Имя и фамилию передаем как дополнительные данные пользователя.
  const { error } = await supabase.auth.signUp({
    email: submission.value.email.trim(),
    password: submission.value.password.trim(),

    options: {
      data: {
        name: submission.value.name.trim(),
        surname: submission.value.surname.trim(),
        referal_code: '',
      },
    },
  });

  if (error) {
    // Приводим ошибку Supabase к простому тексту для интерфейса.
    const errorMessage = getAuthErrorMessage(error.code, error.message);

    return submission.reply({
      formErrors: [errorMessage],
      hideFields: ['password', 'confirmPassword'],
    });
  }

  // Обновляем главную страницу, чтобы на ней появились свежие данные.
  revalidatePath('/');

  // После успешной регистрации отправляем пользователя на главную.
  redirect('/');
};
