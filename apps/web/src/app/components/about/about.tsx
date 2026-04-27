import { RizuMarkdown } from '../markdown/markdown';
import styles from "./about.module.css";

interface RizuAboutProps {
  text?: string,
  placeholder: string
}

export function RizuAbout({
  text,
  placeholder
}: RizuAboutProps) {
  return (
    <section className={styles.about}>
      <h4>About</h4>
      <div className={styles.content}>
        {text ? (
          <RizuMarkdown text={text} />
        ) : (
          <p className={styles.placeholder}>{placeholder}</p>
        )}
      </div>
    </section>
  )
}