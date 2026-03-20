import type { InputHTMLAttributes } from 'react';

type FieldName =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'password'
  | 'confirmPassword';

type RegisterFormField = Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
  name: FieldName;
};

export const REGISTER_FORM_CONTENT = {
  buttonText: 'Sign Up to your account',
  footerText: 'Already have an account?',
  footerLink: 'Log In',
} as const;

export const REGISTER_FORM_FIELDS: RegisterFormField[] = [
  {
    name: 'firstName',
    type: 'text',
    placeholder: 'First Name',
    autoComplete: 'given-name',
  },
  {
    name: 'lastName',
    type: 'text',
    placeholder: 'Last Name',
    autoComplete: 'family-name',
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email address',
    autoComplete: 'email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    autoComplete: 'new-password',
    'aria-autocomplete': 'list',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm password',
    autoComplete: 'new-password',
    'aria-autocomplete': 'list',
  },
] as const;
