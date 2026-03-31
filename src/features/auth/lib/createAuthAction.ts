import { parseWithZod } from '@conform-to/zod';
import type { AuthMode } from '../model/auth.types';
import { signUpSchema } from '../model/auth.schemas';


export const createAuthAction = (
  authMode: AuthMode,
  prevState: unknown,
  formData: FormData,
) => {
  const schema = authMode === 'signUp' ? signUpSchema : signUpSchema;

  const submission = parseWithZod(formData, { schema });

  return submission;
};
