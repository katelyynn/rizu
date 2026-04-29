import React, { forwardRef } from 'react';
import styles from "./button.module.css";

interface RizuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean,
  className?: string,
  children: React.ReactNode
}

const RizuButton = forwardRef<HTMLButtonElement, RizuButtonProps>(
  ({ loading, className, children, ...props }, ref) => {
    return (
      <button ref={ref} disabled={loading} className={`${styles.button} ${className ? className : ''}`} {...props}>
        {children}
      </button>
    )
  }
)

RizuButton.displayName = 'RizuButton';

export default RizuButton;