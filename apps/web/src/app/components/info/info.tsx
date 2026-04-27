import React from 'react';
import styles from "./info.module.css";

interface RizuInfoProps {
  label: string,
  children: React.ReactNode
}

export function RizuInfo({
  label,
  children
}: RizuInfoProps) {
  return (
    <div className={styles.info}>
      <h4>{label}</h4>
      <p className={styles.content}>{children}</p>
    </div>
  )
}