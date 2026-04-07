import type z from 'zod';
import type { signUpSchema } from '../../model/auth.schemas';

export const SIGN_UP_FORM_CONTENT = {
  buttonText: 'Sign Up to your account',
  footerText: 'Already have an account?',
  footerLink: 'Sign in',
  checkboxText:
    'By creating an account, I agree to Zyrix’s Terms and Privacy Policy',
} as const;

////////////////////////////////////////////////////////////////////////////////

type FieldName = keyof Omit<z.infer<typeof signUpSchema>, 'termsAccepted'>;

type SignUpFieldType = 'text' | 'email' | 'password';

type SignUpFormField = {
  name: FieldName;
  type: SignUpFieldType;
  placeholder: string;
  autoComplete: string;
  'aria-autocomplete': 'inline' | 'list' | 'both' | 'none';
  'aria-label': string;
};

export const SIGN_UP_FORM_FIELDS = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Name',
    autoComplete: 'given-name',
    'aria-autocomplete': 'none',
    'aria-label': 'Name',
  },
  {
    name: 'surname',
    type: 'text',
    placeholder: 'Surname',
    autoComplete: 'family-name',
    'aria-autocomplete': 'none',
    'aria-label': 'Surname',
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email address',
    autoComplete: 'email',
    'aria-autocomplete': 'none',
    'aria-label': 'Email address',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    autoComplete: 'new-password',
    'aria-autocomplete': 'list',
    'aria-label': 'Password',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm password',
    autoComplete: 'new-password',
    'aria-autocomplete': 'list',
    'aria-label': 'Confirm password',
  },
] as const satisfies readonly SignUpFormField[];
