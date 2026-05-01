import { RadioGroup } from 'radix-ui';
import styles from "./radio.module.css";
import { RizuMarkdown } from '../markdown/markdown';

interface RadioItem {
  label: string,
  value: string
}

interface RizuRadioProps {
  value: string,
  desc?: string,
  onValueChange: (value: string) => void,
  label: string,
  items: RadioItem[]
}

export function RizuRadio({
  value,
  desc,
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
      {desc && (
        <div className={styles.headDesc}>
          <RizuMarkdown text={desc} />
        </div>
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