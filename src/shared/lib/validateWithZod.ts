import { z, type ZodType } from 'zod';

export const validateWithZod = <T>(schema: ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        'Validation failed:',
        JSON.stringify(error.issues, null, 2),
      );
    }
    throw error;
  }
};
