import Link from 'next/link';
import styles from "./top.module.css";

export function RizuTop() {
  return (
    <div className={styles.top}>
      <div className={styles.logos}>
        <Link className={styles.logo} href="/">rizu (alpha)</Link>
      </div>
      <div className={styles.search}>
        search
      </div>
    </div>
  )
}