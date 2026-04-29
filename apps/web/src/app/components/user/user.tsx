import React from 'react';
import styles from "./user.module.css";
import { Author, Friend } from '@rizu/shared';
import { RizuAvatar } from '../avatar/avatar';
import Link from 'next/link';

interface RizuUserListProps {
  children: React.ReactNode
}

export function RizuUserList({
  children
}: RizuUserListProps) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}

interface RizuUserProps {
  user?: Author,
  friend?: Friend
}

export function RizuUser({
  user,
  friend
}: RizuUserProps) {
  if (friend) {
    return (
      <div className={styles.user}>
        <RizuAvatar className={styles.avatar} src={friend.friend.avatar} alt={friend.friend.username} />
        <div className={styles.info}>
          <Link className={styles.username} href={`/user/${friend.friend.slug}`}>{friend.friend.username}</Link>
        </div>
      </div>
    )
  }
}