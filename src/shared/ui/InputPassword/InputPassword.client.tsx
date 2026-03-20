'use client';

import { useState, type ComponentProps } from 'react';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import styles from './InputPassword.module.scss';

type InputPasswordProps = Omit<
  ComponentProps<typeof Input>,
  'icon' | 'type'
> & {
  externalIsVisible?: boolean;
  onToggleVisibility?: () => void;
  hideToggleButton?: boolean;
};

/**
 * Поле ввода пароля с кнопкой переключения видимости.
 * Поддерживает как локальный стейт видимости (по умолчанию), так и внешнее управление (Lifting State Up).
 * Обертка над базовым компонентом `Input`.
 *
 * @param {boolean} [externalIsVisible] - Внешний стейт видимости (для управления несколькими полями одновременно).
 * @param {() => void} [onToggleVisibility] - Коллбэк для переключения внешнего стейта видимости.
 * @param {boolean} [hideToggleButton=false] - Скрывает кнопку-глаз (полезно для поля "Подтверждение пароля", если видимость управляется извне).
 * @param {string} [error] - Текст ошибки валидации.
 * @param {boolean} [isValid] - Флаг успешной валидации.
 * @returns {JSX.Element}
 */
export const InputPassword = ({
  className,
  error,
  isValid,
  externalIsVisible,
  onToggleVisibility,
  hideToggleButton = false,
  ...props
}: InputPasswordProps) => {
  const [localIsVisible, setLocalIsVisible] = useState(false);

  // Фолбэк на локальный стейт, если компонент используется автономно
  const isVisible = externalIsVisible ?? localIsVisible;

  const toggleVisibility = () => {
    // Приоритет отдаем переданному коллбэку, иначе мутируем внутренний стейт
    if (onToggleVisibility) {
      onToggleVisibility();
    } else {
      setLocalIsVisible((prev) => !prev);
    }
  };

  return (
    <>
      <Input
        {...props}
        className={className}
        type={isVisible ? 'text' : 'password'}
        error={error}
        isValid={isValid}
      />
      {!hideToggleButton && (
        <Button
          className={styles['button-toggle']}
          variant="iconOnly"
          type="button"
          onClick={toggleVisibility}
          aria-label="Toggle password visibility"
        >
          <Icon
            name={isVisible ? 'eye-closed' : 'eye-open'}
            width={24}
            height={24}
          />
        </Button>
      )}
    </>
  );
};
