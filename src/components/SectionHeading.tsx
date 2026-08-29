import type { LocalizedText, Locale } from '../content/portfolio'
import { localize } from '../content/portfolio'
import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  index: string
  title: LocalizedText
  description?: LocalizedText
  locale: Locale
}

export function SectionHeading({
  index,
  title,
  description,
  locale,
}: SectionHeadingProps) {
  return (
    <header className={styles.heading}>
      <div className={styles.index} aria-hidden="true">
        <span>{index}</span>
      </div>
      <div className={styles.copy}>
        <h2>{localize(title, locale)}</h2>
        {description ? <p>{localize(description, locale)}</p> : null}
      </div>
      <span className={styles.rule} aria-hidden="true" />
    </header>
  )
}
