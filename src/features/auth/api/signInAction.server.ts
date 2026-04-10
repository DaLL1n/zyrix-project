'use server';

import { createClient } from '@/shared/api/supabase/server';
import { createAuthAction } from '../lib/createAuthAction';
import { getAuthErrorMessage } from '../lib/getAuthErrorMessage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signInSchema } from '../model/auth.schemas';

export const signInAction = async (prevState: unknown, formData: FormData) => {
  const submission = createAuthAction(signInSchema, prevState, formData);

  if (submission.status !== 'success') {
    return submission.reply({
      hideFields: ['password'],
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: submission.value.email.trim(),
    password: submission.value.password.trim(),
  });

  if (error) {
    const errorMessage = getAuthErrorMessage(
      'signIn',
      error.code,
      error.message,
    );

    // Возвращаем ошибку в форму и снова скрываем пароли, чтобы не светить чувствительные данные
    return submission.reply({
      formErrors: [errorMessage],
      hideFields: ['password'],
    });
  }

  revalidatePath('/');
  redirect('/');
};
