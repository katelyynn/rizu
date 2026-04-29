'use client';

import React from 'react';
import styles from "./action.module.css";
import { useAuth } from '../auth/auth_context';
import { useFriendStatus } from '@/app/hooks/friend';
import Link from 'next/link';
import { RizuIcon } from '../icon/icon';

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

  let statusIcon = 'status_online';

  switch (status) {
    case 'incoming':
    case 'none':
      statusIcon = 'status_add';
      break;
    case 'outgoing':
      statusIcon = 'status_away';
      break;
  }

  return (
    <RizuActions>
      {(user) && (user.slug != slug) ? (
        <>
          <button onClick={handleAction} disabled={loading || !isActionable} className={styles.action}>
            <RizuIcon icon={statusIcon} className={styles.icon} />
            {buttonText}
          </button>
          <button className={styles.action}>
            <RizuIcon icon="email" className={styles.icon} />
            Message
          </button>
          <button className={styles.action}>
            <RizuIcon icon="arrow_refresh_small" className={styles.icon} />
            Recommend
          </button>
          <button className={styles.action}>
            More...
          </button>
        </>
      ) : (
        <Link href="/settings" className={styles.action}>
          <RizuIcon icon="pencil" className={styles.icon} />
          Edit profile
        </Link>
      )}
    </RizuActions>
  )
}