'use client';

import React from 'react';
import styles from "./action.module.css";
import { useAuth } from '../auth/auth_context';
import { useFriendStatus } from '@/app/hooks/friend';

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
      {(user && user.slug != slug && isActionable) && (
        <button onClick={handleAction} disabled={loading} className={styles.action}>
          {loading ? 'Loading...' : buttonText}
        </button>
      )}
    </RizuActions>
  )
}