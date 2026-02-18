import type React from 'react';

export interface ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'iconOnly';
  children: React.ReactNode;
  className?: string;
}

export type ButtonNativeProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    type?: 'button' | 'submit';
    href?: never;
  };

export type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  type?: never;
};

export type ButtonProps = ButtonBaseProps &
  (ButtonNativeProps | ButtonLinkProps);
