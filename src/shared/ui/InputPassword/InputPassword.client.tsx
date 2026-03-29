import { type ComponentProps } from 'react';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import styles from './InputPassword.module.scss';

type InputPasswordProps = Omit<
  ComponentProps<typeof Input>,
  'icon' | 'type'
> & {
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  hideToggleButton?: boolean;
};

/**
 * Поле ввода пароля с кнопкой переключения видимости.
 * Обертка над базовым компонентом `Input`.
 *
 * @param {boolean} [isVisible] - Внешний стейт видимости (для управления несколькими полями одновременно).
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
  isVisible,
  onToggleVisibility,
  hideToggleButton = false,
  ...props
}: InputPasswordProps) => {
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
          onClick={onToggleVisibility}
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
