import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z
        .string({ required_error: 'First name is required' })
        .min(2, 'First name is required'),
    ),
    lastName: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z
        .string({ required_error: 'Last name is required' })
        .min(2, 'Last name is required'),
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
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[^a-zA-Z0-9]/,
          'Password must contain at least one special character',
        ),
    ),
    confirmPassword: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z.string({ required_error: 'Confirm password is required' }),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
