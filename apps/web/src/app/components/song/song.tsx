import { Listen } from '@rizu/shared';
import styles from "./song.module.css";
import Link from 'next/link';
import React from 'react';
import { DateTime } from 'luxon';

interface RizuSongProps {
  listen: Listen
}

export function RizuSong({
  listen
}: RizuSongProps) {
  return (
    <li className={`${styles.song}`}>
      {listen.album && listen.album.avatar ? (
        <div className={styles.avatar}>
          <img className={styles.image} src={listen.album.avatar} alt={listen.album.name} />
        </div>
      ) : (
        <div className={styles.avatar}>
          <p className={styles.placeholder}>?</p>
        </div>
      )}
      <div className={styles.info}>
        <Link className={styles.name} href={`/song/${listen.song.id}`}>{listen.song.name}</Link>
        <Link className={styles.artist} href={`/artist/${listen.artist.id}`}>{listen.artist.name}</Link>
      </div>
      {listen.listen.duration ?? (
        <div className={styles.duration}>
          {listen.listen.duration}
        </div>
      )}
      <div className={styles.time}>
        {DateTime.fromISO(listen.listen.played).toRelative()}
      </div>
    </li>
  )
}

interface RizuSongListProps {
  children: React.ReactNode
}

export function RizuSongList({
  children
}: RizuSongListProps) {
  return (
    <ul className={`${styles.list}`}>
      {children}
    </ul>
  )
}