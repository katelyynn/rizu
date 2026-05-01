import React from 'react';
import styles from "./alert.module.css";

interface RizuAlertProps {
  type?: 'normal' | 'success' | 'warn' | 'error',
  fade?: boolean,
  children: React.ReactNode
}

export function RizuAlert({
  type = 'normal',
  fade,
  children
}: RizuAlertProps) {
  return (
    <div className={`${styles.alert} ${styles[type]} ${fade ? styles.fade : ''}`}>
      {children}
    </div>
  )
}