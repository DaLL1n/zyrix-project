import { signInAction } from '../api/signInAction.server';
import { signInSchema } from './auth.schemas';
import { useBaseAuthForm } from './useBaseAuthForm';

const requiredFieldNames = ['email', 'password'] as const;

export const useSignInForm = () => {
  const { fields, form, formAction, isPending } = useBaseAuthForm(
    signInAction,
    signInSchema,
  );

  const isReadyToSubmit = requiredFieldNames.every((name) => {
    const field = fields[name];
    return field.dirty && field.valid;
  });

  return {
    form,
    fields,
    isPending,
    isReadyToSubmit,
    formAction,
  };
};
