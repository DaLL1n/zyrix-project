import { parseWithZod } from '@conform-to/zod';
import type z from 'zod';

export const createAuthAction = (
  schema: z.ZodSchema,
  prevState: unknown,
  formData: FormData,
) => {
  const submission = parseWithZod(formData, { schema });

  return submission;
};
