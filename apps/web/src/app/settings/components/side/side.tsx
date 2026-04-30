import React from 'react';
import styles from "./side.module.css";
import { RizuMarkdown } from '@/app/components/markdown/markdown';

interface RizuSettingLineProps {
  label: string,
  desc?: string,
  children: React.ReactNode
}

export function RizuSettingLine({
  label,
  desc,
  children
}: RizuSettingLineProps) {
  return (
    <div className={styles.line}>
      <div className={styles.left}>
        <h3 className={styles.head}>{label}</h3>
        {desc && <div className={styles.desc}><RizuMarkdown text={desc.trim()} /></div>}
      </div>
      <div className={styles.right}>
        {children}
      </div>
    </div>
  )
}