import { useId, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  icon?: React.ReactNode;
  error?: string;
  isValid?: boolean;
};

export const Input = ({
  className,
  icon,
  error,
  isValid,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const errorId = `${inputId}-error`;

  const inputClass = clsx(styles['input'], className, {
    [styles['input-error']]: error,
    [styles['input-success']]: !error && isValid,
  });
  const textErrorClass = clsx(styles['text-error'], {
    [styles['text-error-visible']]: error,
  });

  return (
    <>
      <label className={styles['label']} htmlFor={inputId}>
        <input
          className={inputClass}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : props['aria-describedby']}
          {...props}
        />
        {icon}
      </label>
      <span className={textErrorClass} id={errorId} role="alert">
        {error}
      </span>
    </>
  );
};
