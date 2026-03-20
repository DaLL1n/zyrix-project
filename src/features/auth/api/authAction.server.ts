'use server';

import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { registerSchema } from '../model/auth.schemas';

type AuthType = 'register' | 'login';

export const authAction = async (
  authType: AuthType,
  prevState: unknown,
  formData: FormData,
) => {
  const schema = authType === 'register' ? registerSchema : registerSchema;

  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  redirect('/dashboard');
};
