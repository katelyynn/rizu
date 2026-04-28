import styles from "./avatar.module.css";

interface RizuAvatarProps {
  className?: string,
  src?: string,
  alt: string,
  big?: boolean
}

export function RizuAvatar({
  className,
  src,
  alt,
  big = false
}: RizuAvatarProps) {
  return (
    <div className={`${styles.avatar} ${big ? styles.big : ''} ${className ? className : ''}`}>
      {src ? (
        <img className={styles.image} src={src} alt={alt} />
      ) : (
        <p className={styles.placeholder}>?</p>
      )}
    </div>
  )
}