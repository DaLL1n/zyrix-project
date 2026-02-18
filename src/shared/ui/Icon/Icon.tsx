import clsx from 'clsx';

import type { IconNameType } from './Icon.types';

import styles from './Icon.module.scss';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconNameType;
  className?: string;
}

/**
 * @description UI-компонент для рендера SVG-иконки из sprite.
 *
 * @param props Пропсы SVG-иконки.
 * @param name Идентификатор иконки в sprite.
 * @param className Дополнительный CSS-класс.
 * @returns Готовый svg-элемент иконки.
 */
export const Icon = ({ name, className, ...props }: IconProps) => {
  const iconClassName = clsx(styles.icon, className);
  return (
    <svg className={iconClassName} {...props}>
      <use href={`./sprite.svg#${name}`} />
    </svg>
  );
};
