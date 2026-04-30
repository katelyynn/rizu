import React from 'react';
import styles from "./info.module.css";

interface RizuInfoListProps {
  horizontal?: boolean,
  children: React.ReactNode
}

export function RizuInfoList({
  horizontal,
  children
}: RizuInfoListProps) {
  return (
    <div className={`${styles.list} ${horizontal ? styles.horizontal : ''}`}>
      {children}
    </div>
  )
}

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
      <div className={styles.content}>{children}</div>
    </div>
  )
}

interface RizuStatsBoxProps {
  children: React.ReactNode
}

export function RizuStatsBox({
  children
}: RizuStatsBoxProps) {
  return (
    <div className={styles.statBox}>
      {children}
    </div>
  )
}