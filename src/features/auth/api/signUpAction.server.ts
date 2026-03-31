'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/api/supabase/server';
import { createAuthAction } from '../lib/createAuthAction';
import { getAuthErrorMessage } from '../lib/getAuthErrorMessage';

/**
 * Создаёт попытку регистрации по данным формы.
 *
 * @param prevState Предыдущее состояние server action. Нужно, чтобы собрать корректный ответ для формы
 * @param formData Данные формы регистрации: имя, фамилия, email, пароль и подтверждение пароля
 * @returns {Promise<unknown>} Возвращает ответ с ошибками для формы, если что-то не прошло. Если всё успешно, обновляет кэш главной страницы и сразу перенаправляет пользователя на `/`
 */
export const signUpAction = async (prevState: unknown, formData: FormData) => {
  // Собираем и валидируем данные формы, чтобы дальше работать только с проверенным вводом
  const submission = createAuthAction('signUp', prevState, formData);

  // Если проверка не прошла, сразу отдаём ошибки в форму и не возвращаем поля с паролем в интерфейс
  if (submission.status !== 'success') {
    return submission.reply({
      hideFields: ['password', 'confirmPassword'],
    });
  }
  // Создаём серверный клиент Supabase, чтобы выполнить регистрацию на бэкенде
  const supabase = await createClient();

  // Отправляем в Supabase очищенные данные, чтобы убрать случайные пробелы по краям
  const { error } = await supabase.auth.signUp({
    email: submission.value.email.trim(),
    password: submission.value.password.trim(),
    options: {
      data: {
        // Сохраняем дополнительные поля профиля сразу при регистрации, чтобы профиль был заполнен с первого шага
        name: submission.value.name.trim(),
        surname: submission.value.surname.trim(),
        referal_code: '',
      },
    },
  });

  // Если Supabase вернул ошибку, переводим её в понятный текст и показываем пользователю
  if (error) {
    const errorMessage = getAuthErrorMessage(
      'signUp',
      error.code,
      error.message,
    );

    // Возвращаем ошибку в форму и снова скрываем пароли, чтобы не светить чувствительные данные
    return submission.reply({
      formErrors: [errorMessage],
      hideFields: ['password', 'confirmPassword'],
    });
  }

  // Обновляем главную страницу, чтобы на ней появились свежие данные
  revalidatePath('/');

  // После успешной регистрации отправляем пользователя на главную
  redirect('/');
};
