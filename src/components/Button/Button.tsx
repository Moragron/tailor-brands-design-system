import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * primary: Next / Start / Continue / Accept & Close / Add.
   * secondary: Skip / Remove / Decline All.
   */
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
};

export function Button({ variant = 'primary', fullWidth, className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`tb-button tb-button--${variant}${fullWidth ? ' tb-button--full' : ''} tb-focusable ${className}`}
      {...rest}
    />
  );
}
