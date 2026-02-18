import Link from 'next/link';

import clsx from 'clsx';

import styles from './Button.module.scss';
import type {
  ButtonLinkProps,
  ButtonNativeProps,
  ButtonProps,
} from './Button.types';

/**
 * @description Универсальный компонент кнопки с поддержкой работы как нативной кнопки или ссылки.
 *
 * @param props Параметры компонента
 * @param variant Стиль варианта кнопки
 * @param children Содержимое кнопки
 * @param className Дополнительный CSS класс
 * @param href - URL для отрисовки как ссылка (Link). Если указан, компонент отрисуется как Link вместо button
 * @param type- Тип нативной кнопки (button, submit, reset) - используется только если href не передан
 * @returns Link или button в зависимости от наличия href
 *
 * @example
 * // Нативная кнопка
 * <Button variant="primary" onClick={handleClick}>Отправить</Button>
 *
 * @example
 * // Кнопка-ссылка
 * <Button href="/home" variant="secondary">На главную</Button>
 */
export const Button = ({
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonProps) => {
  // Объединяем стили: базовый стиль кнопки, стиль варианта и пользовательский класс
  const buttonNameClass = clsx(styles['button'], styles[variant], className);

  // Извлекаем href и остальные пропсы для ссылки
  const { href, ...linkProps } = props as ButtonLinkProps;

  // Если передан href - отрисовываем ссылку
  if (href) {
    return (
      <Link className={buttonNameClass} href={href} {...linkProps}>
        {children}
      </Link>
    );
  }

  // Извлекаем тип кнопки с дефолтным значением 'button'
  const { type = 'button', ...buttonProps } = props as ButtonNativeProps;

  // В противном случае отрисовываем нативную кнопку
  return (
    <button className={buttonNameClass} type={type} {...buttonProps}>
      {children}
    </button>
  );
};
