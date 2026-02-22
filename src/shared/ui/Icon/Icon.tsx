import clsx from 'clsx';

import type { IconName } from './Icon.types';

import styles from './Icon.module.scss';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  const iconClassName = clsx(styles.icon, className);
  return (
    <svg className={iconClassName} {...props}>
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
};
