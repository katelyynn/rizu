import React from 'react';
import styles from "./wall.module.css";
import { Activity } from '@rizu/shared';
import { RizuAvatar } from '../avatar/avatar';
import Link from 'next/link';
import { RizuComment } from '../comments/comments';
import { RizuMarkdown } from '../markdown/markdown';
import { DateTime } from 'luxon';

interface RizuWallProps {
  children: React.ReactNode
}

export function RizuWall({
  children
}: RizuWallProps) {
  return (
    <div className={styles.wall}>
      {children}
    </div>
  )
}

interface RizuActivityProps {
  activity: Activity
}

export function RizuActivity({
  activity
}: RizuActivityProps) {
  if (activity.type == 'comment' && activity.comment && activity.comment.location) {
    return (
      <div className={styles.activity}>
        <RizuAvatar className={styles.avatar} src={activity.user.avatar} alt={activity.user.username} />
        <div className={styles.info}>
          <p className={styles.headline}><Link href={`/user/${activity.user.slug}`}>{activity.user.username}</Link> left <Link href={`/user/${activity.comment.location.slug}`}>{activity.comment.location.username}</Link> a comment:</p>
          <div className={styles.bubble}>
            <RizuMarkdown text={activity.comment.content} />
          </div>
          <div className={styles.bottom}>
            <Link className={styles.action} href={`/comment/${activity.comment.id}`}>Reply</Link>
            <p className={styles.time}>{DateTime.fromISO(activity.created).toRelative({ style: 'short' })}</p>
          </div>
        </div>
      </div>
    )
  }

  return <p>unknown type '{activity.type}'</p>
}

interface RizuWallGroupProps {
  header: string,
  children: React.ReactNode
}

export function RizuWallGroup({
  header,
  children
}: RizuWallGroupProps) {
  return (
    <div className={styles.group}>
      <h4 className={styles.header}>{header}</h4>
      <div className={styles.activities}>
        {children}
      </div>
    </div>
  )
}