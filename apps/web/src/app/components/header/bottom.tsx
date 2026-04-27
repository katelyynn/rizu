'use client';

import Link from 'next/link';
import styles from "./bottom.module.css";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth_context';

export function RizuBottom() {
  return (
    <nav className={styles.bottom}>
      <div className={styles.left}>
        <BottomNavLink href="/">
          Home
        </BottomNavLink>
        <BottomNavLinkSep />
        <BottomNavLink href="/explore">
          Explore
        </BottomNavLink>
        <BottomNavLinkSep />
      </div>
      <Auth />
    </nav>
  )
}

function Auth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.right} />
    )
  }

  if (user) {
    return (
      <div className={styles.right}>
        <BottomNavLinkSep />
        <BottomNavLink href={`/user/${user.username}`}>
          {user.username}
        </BottomNavLink>
        <BottomNavLinkSep />
        <BottomNavLink href="/logout">
          Logout
        </BottomNavLink>
      </div>
    )
  }

  return (
    <div className={styles.right}>
      <BottomNavLinkSep />
      <BottomNavLink href="/login">
        Login
      </BottomNavLink>
      <BottomNavLinkSep />
      <BottomNavLink href="/register">
        Register
      </BottomNavLink>
    </div>
  )
}

interface BottomNavLinkProps {
  href: string,
  children: React.ReactNode
}

function BottomNavLink({
  href,
  children
}: BottomNavLinkProps) {
  return (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  )
}

function BottomNavLinkSep() {
  return (
    <div className={styles.sep} />
  )
}