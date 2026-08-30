import { IconPlayerPlay } from '@tabler/icons-react'
import { useState } from 'react'
import type { Locale, MediaItem } from '../content/portfolio'
import { localize, siteCopy } from '../content/portfolio'
import { ProjectMedia } from './ProjectMedia'
import styles from './ProjectGallery.module.css'

interface ProjectGalleryProps {
  items: MediaItem[]
  locale: Locale
  priority?: boolean
}

function getMediaLabel(item: MediaItem, locale: Locale) {
  return localize(item.title ?? item.alt, locale)
}

function getThumbnail(item: MediaItem) {
  if (item.type === 'image') return item.src
  return item.poster
}

function getMediaKey(item: MediaItem) {
  return item.type === 'externalVideo' ? item.embedUrl : item.src
}

export function ProjectGallery({ items, locale, priority = false }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = items[activeIndex] ?? items[0]

  if (!activeItem) return null

  if (items.length === 1) {
    return <ProjectMedia item={activeItem} locale={locale} priority={priority} />
  }

  return (
    <div className={styles.gallery} aria-label={localize(siteCopy.mediaGallery.label, locale)}>
      <ProjectMedia
        key={`${activeItem.type}-${getMediaKey(activeItem)}`}
        item={activeItem}
        locale={locale}
        priority={priority && activeIndex === 0}
      />

      <div className={styles.meta} aria-live="polite">
        <p>{localize(activeItem.caption ?? activeItem.title ?? activeItem.alt, locale)}</p>
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
      </div>

      <div className={styles.rail} role="group" aria-label={localize(siteCopy.mediaGallery.label, locale)}>
        {items.map((item, index) => {
          const thumbnail = getThumbnail(item)
          const label = getMediaLabel(item, locale)

          return (
            <button
              key={`${item.type}-${getMediaKey(item)}`}
              type="button"
              className={styles.thumbnail}
              aria-label={`${localize(siteCopy.mediaGallery.select, locale)}：${label}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            >
              {thumbnail ? <img src={thumbnail} alt="" loading="lazy" decoding="async" /> : null}
              {item.type !== 'image' ? <IconPlayerPlay aria-hidden="true" /> : null}
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
