import styles from "./icon.module.css";

interface RizuIconProps {
  icon: string,
  className?: string
}

export function RizuIcon({
  icon,
  className
}: RizuIconProps) {
  return (
    <div className={`${styles.icon} famfamfam-silk ${icon} ${className ? className : ''}`} />
  )
}