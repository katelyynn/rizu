import styles from "./avatar.module.css";

interface RizuAvatarProps {
  src?: string,
  alt: string,
  big?: boolean
}

export function RizuAvatar({
  src,
  alt,
  big = false
}: RizuAvatarProps) {
  return (
    <div className={`${styles.avatar} ${big ? styles.big : ''}`}>
      {src ? (
        <img className={styles.image} src={src} alt={alt} />
      ) : (
        <p className={styles.placeholder}>?</p>
      )}
    </div>
  )
}