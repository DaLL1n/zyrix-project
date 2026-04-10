import type z from 'zod';
import type { signInSchema } from '../../model/auth.schemas';

export const SIGN_IN_FORM_CONTENT = {
  buttonText: 'Login to your account',
  footerText: "Don't have an account?",
  footerLinkText: 'Sign Up',
} as const;

type FieldName = keyof z.infer<typeof signInSchema>;

type SignInFieldType = 'text' | 'email' | 'password';

type SignInFormField = {
  name: FieldName;
  type: SignInFieldType;
  placeholder: string;
  autoComplete: string;
  'aria-label': string;
};

export const SIGN_IN_FORM_FIELDS = {
  email: {
    name: 'email',
    type: 'email',
    placeholder: 'Email address',
    autoComplete: 'email',
    'aria-label': 'Email address',
  },
  password: {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    autoComplete: 'new-password',
    'aria-label': 'Password',
  },
} as const satisfies Record<FieldName, SignInFormField>;
