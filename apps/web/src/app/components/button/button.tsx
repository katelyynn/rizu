import React, { forwardRef } from 'react';
import styles from "./button.module.css";
import { useAuth } from '../auth/auth_context';

interface RizuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean,
  className?: string,
  children: React.ReactNode
}

const RizuButton = forwardRef<HTMLButtonElement, RizuButtonProps>(
  ({ loading, className, children, ...props }, ref) => {
    const { general } = useAuth();

    return (
      <button ref={ref} disabled={loading} className={`${styles.button} ${className ? className : ''} ${styles[`theme-${general.theme}`]} ${styles[`layout-${general.layout}`]}`} {...props}>
        {children}
      </button>
    )
  }
)

RizuButton.displayName = 'RizuButton';

export default RizuButton;