'use client';

import React from 'react';
import styles from "./action.module.css";
import { useAuth } from '../auth/auth_context';
import { useFriendStatus } from '@/app/hooks/friend';
import Link from 'next/link';

interface RizuActionsProps {
  children: React.ReactNode
}

export function RizuActions({
  children
}: RizuActionsProps) {
  return (
    <ul className={styles.actions}>
      {children}
    </ul>
  )
}

export function RizuProfileActions({ slug }: { slug: string }) {
  const { user } = useAuth();
  const { status, loading, handleAction, buttonText, isActionable } = useFriendStatus(slug);

  return (
    <RizuActions>
      {(user) && (user.slug != slug) ? (
        <>
          <button onClick={handleAction} disabled={loading || !isActionable} className={styles.action}>
            {loading ? 'Loading...' : buttonText}
          </button>
          <button className={styles.action}>
            Message
          </button>
          <button className={styles.action}>
            Recommend
          </button>
          <button className={styles.action}>
            More...
          </button>
        </>
      ) : (
        <Link href="/settings" className={styles.action}>
          Edit profile
        </Link>
      )}
    </RizuActions>
  )
}