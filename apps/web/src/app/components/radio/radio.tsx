import { RadioGroup } from 'radix-ui';
import styles from "./radio.module.css";

interface RadioItem {
  label: string,
  value: string
}

interface RizuRadioProps {
  value: string,
  onValueChange: (value: string) => void,
  label: string,
  items: RadioItem[]
}

export function RizuRadio({
  value,
  onValueChange,
  label,
  items
}: RizuRadioProps) {
  return (
    <RadioGroup.Root className={styles.list} defaultValue={value} onValueChange={onValueChange}>
      {label && (
        <label className={styles.head}>
          {label}
        </label>
      )}
      <div className={styles.items}>
        {items.map((item: RadioItem) => (
          <div className={styles.item} key={`${label}-${item.value}`}>
            <RadioGroup.Item className={styles.radio} value={item.value} id={`${label}-${item.value}`}>
              <RadioGroup.Indicator className={styles.indicator} />
            </RadioGroup.Item>
            <label className={styles.label} htmlFor={`${label}-${item.value}`}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </RadioGroup.Root>
  )
}