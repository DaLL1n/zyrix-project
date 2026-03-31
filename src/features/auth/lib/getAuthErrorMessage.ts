import type { AuthMode } from '../model/auth.types';

const authErrorByMode = {
  signUp: {
    code: 'user_already_exists',
    sourceMessage: 'User already registered',
    userMessage: 'User with this email already exists',
  },
  signIn: {
    code: 'invalid_credentials',
    sourceMessage: 'Invalid email or password',
    userMessage: 'Incorrect email or password',
  },
} as const;

// Преобразуем техническую ошибку авторизации в понятный текст для интерфейса.
export const getAuthErrorMessage = (
  mode: AuthMode,
  errorCode: string | undefined,
  errorMessage: string,
) => {
  // Если пользователь уже зарегистрирован или нет такого пользователя, показываем короткое и ясное сообщение.
  if (
    errorCode === authErrorByMode[mode].code ||
    errorMessage.includes(authErrorByMode[mode].sourceMessage)
  ) {
    return authErrorByMode[mode].userMessage;
  }

  // Для остальных ошибок оставляем исходный текст.
  return errorMessage;
};
