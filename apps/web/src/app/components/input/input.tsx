import React, { forwardRef } from 'react';
import styles from "./input.module.css";

interface RizuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string,
  error?: string,
  className?: string
}

const RizuInput = forwardRef<HTMLInputElement, RizuInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.wrap}>
          <input ref={ref} className={`${styles.input} ${error ? styles.error : ''} ${className ? className : ''}`} {...props} />
        </div>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
      </div>
    )
  }
)

RizuInput.displayName = 'RizuInput';

export default RizuInput;