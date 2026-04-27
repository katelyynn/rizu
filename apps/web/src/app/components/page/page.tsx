import React from 'react';
import styles from "./page.module.css";

export function RizuPageTopInset({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.topInset}>
      {children}
    </div>
  )
}

export function RizuPageTopInsetTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className={styles.topInsetTitle}>
      {children}
    </h1>
  )
}

export function RizuPageTopInsetSubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={styles.topInsetSubTitle}>
      {children}
    </h2>
  )
}

export function RizuPageColumns({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.columns}>
      {children}
    </div>
  )
}

export function RizuPageLeft({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.left}>
      {children}
    </div>
  )
}

export function RizuPageRight({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.right}>
      {children}
    </div>
  )
}