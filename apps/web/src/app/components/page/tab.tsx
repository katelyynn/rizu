'use client';

import React from 'react';
import styles from "./tab.module.css";
import Link from 'next/link';

interface RizuTabListProps {
  standalone?: boolean,
  children: React.ReactNode,
  layout: string
}

export function RizuTabList({
  standalone = true,
  children,
  layout
}: RizuTabListProps) {
  return (
    <nav className={`${styles.list} ${standalone ? styles.standalone : ''} ${styles[`layout-${layout}`]}`}>
      {children}
    </nav>
  )
}

interface RizuTabProps {
  pathname: string,
  href: string,
  children: React.ReactNode,
  layout: string
}

export function RizuTab({
  pathname,
  href,
  children,
  layout
}: RizuTabProps) {
  return (
    <Link className={`${styles.tab} ${pathname == href ? styles.active : ''} ${styles[`layout-${layout}`]}`} href={href}>
      {children}
    </Link>
  )
}