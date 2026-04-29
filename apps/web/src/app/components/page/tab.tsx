'use client';

import React from 'react';
import styles from "./tab.module.css";
import Link from 'next/link';

interface RizuTabListProps {
  children: React.ReactNode
}

export function RizuTabList({
  children
}: RizuTabListProps) {
  return (
    <nav className={styles.list}>
      {children}
    </nav>
  )
}

interface RizuTabProps {
  pathname: string,
  href: string,
  children: React.ReactNode
}

export function RizuTab({
  pathname,
  href,
  children
}: RizuTabProps) {
  return (
    <Link className={`${styles.tab} ${pathname == href ? styles.active : ''}`} href={href}>
      {children}
    </Link>
  )
}