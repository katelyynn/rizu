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

  if (activity.type == 'listen' && activity.song) {
    return (
      <div className={styles.activity}>
        <RizuAvatar className={styles.avatar} src={activity.song.album?.avatar} alt={activity.song.album?.name || activity.song.name} />
        <div className={styles.info}>
          <p className={styles.headline}><Link href={`/user/${activity.user.slug}`}>{activity.user.username}</Link> listened to <i className={styles.highlight}>{activity.count > 1 ? `${activity.count} songs` : `${activity.count} song`}</i>:</p>
          <div className={styles.songs}>
            <div className={styles.song}>
              <div className={styles.info}>
                <Link className={styles.name} href={`/song/${activity.song.id}`}>{activity.song.name}</Link>
                <Link className={styles.artist} href={`/artist/${activity.song.artist.id}`}>{activity.song.artist.name}</Link>
              </div>
            </div>
            {activity.count > 1 ? (
              <div className={styles.songDuplicate} />
            ) : ''}
          </div>
          <div className={styles.bottom}>
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