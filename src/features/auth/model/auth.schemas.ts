import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z
        .string({ required_error: 'Name is required' })
        .min(2, 'Name is required'),
    ),
    surname: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z
        .string({ required_error: 'Surname is required' })
        .min(2, 'Surname is required'),
    ),
    email: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address'),
    ),
    password: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z
        .string({ required_error: 'Password is required' })
        .regex(/^[^А-Яа-яЁё]*$/, 'Password must not contain Cyrillic letters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[^a-zA-Z0-9]/,
          'Password must contain at least one special character',
        )

        .min(8, 'Password must be at least 8 characters long'),
    ),
    confirmPassword: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z.string({ required_error: 'Confirm password is required' }),
    ),
    termsAccepted: z.literal(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

///////////////////////////////////////////////////////////////////////////////

export const signInSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
  ),
  password: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z.string({ required_error: 'Password is required' }),
  ),
});
