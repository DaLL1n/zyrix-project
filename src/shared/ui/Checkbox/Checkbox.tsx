import { useId, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

import styles from './Checkbox.module.scss';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  isValid?: boolean;
};

export const Checkbox = ({ label, isValid, ...props }: CheckboxProps) => {
  const generatedId = useId();
  const checkboxId = props.id ?? generatedId;

  return (
    <div className={styles['checkbox']}>
      <label className={styles['checkbox-label']} htmlFor={checkboxId}>
        <input
          className={clsx('visually-hidden', styles['checkbox-input'], {
            [styles['invalid']]: isValid === false,
          })}
          id={checkboxId}
          type="checkbox"
          aria-invalid={isValid === false}
          {...props}
        />
        <span className={styles['checkbox-indicator']} aria-hidden></span>
        {label && (
          <span className={styles['checkbox-label-text']}>{label}</span>
        )}
      </label>
    </div>
  );
};
