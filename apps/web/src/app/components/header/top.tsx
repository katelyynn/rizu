import Link from 'next/link';
import styles from "./top.module.css";
import RizuInput from '../input/input';

export function RizuTop() {
  return (
    <div className={styles.top}>
      <div className={styles.logos}>
        <Link className={styles.logo} href="/">rizu (alpha)</Link>
      </div>
      <div className={styles.searchContainer}>
        <RizuInput className={styles.search} placeholder="What's on your mind?" />
      </div>
    </div>
  )
}