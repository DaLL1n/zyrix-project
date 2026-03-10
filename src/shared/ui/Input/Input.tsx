import { useId, type InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  icon?: React.ReactNode;
};

export const Input = ({ className, icon, ...props }: InputProps) => {
  const inputId = useId();
  return (
    <label className={styles['label']} htmlFor={inputId}>
      <input
        className={`${styles['input']} ${className ?? ''}`}
        id={inputId}
        {...props}
      />
      {icon}
    </label>
  );
};
