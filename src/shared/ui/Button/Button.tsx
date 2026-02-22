import Link from 'next/link';

import clsx from 'clsx';

import styles from './Button.module.scss';
import type {
  ButtonLinkProps,
  ButtonNativeProps,
  ButtonProps,
} from './Button.types';

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
