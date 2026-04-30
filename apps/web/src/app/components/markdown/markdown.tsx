import Markdown from 'react-markdown';
import styles from "./markdown.module.css";

interface RizuMarkdownProps {
  text: string
}

export function RizuMarkdown({
  text
}: RizuMarkdownProps) {
  return (
    <div className={styles.markdown}>
      <Markdown skipHtml>{text}</Markdown>
    </div>
  )
}