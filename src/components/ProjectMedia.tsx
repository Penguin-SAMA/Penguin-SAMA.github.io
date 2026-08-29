import { IconPlayerPlay } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import type { Locale, MediaItem } from '../content/portfolio'
import { localize, siteCopy } from '../content/portfolio'
import styles from './ProjectMedia.module.css'

interface ProjectMediaProps {
  item: MediaItem
  locale: Locale
  priority?: boolean
}

function getExternalTitle(item: Extract<MediaItem, { type: 'externalVideo' }>, locale: Locale) {
  return localize(item.title, locale)
}

export function ProjectMedia({ item, locale, priority = false }: ProjectMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(item.type === 'image')
  const [externalLoaded, setExternalLoaded] = useState(false)

  useEffect(() => {
    if (item.type === 'image' || nearViewport) return

    const element = containerRef.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '320px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [item.type, nearViewport])

  return (
    <div ref={containerRef} className={styles.frame} data-media-type={item.type}>
      {item.type === 'image' ? (
        <img
          src={item.src}
          alt={localize(item.alt, locale)}
          width="1536"
          height="1024"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : null}

      {item.type === 'localVideo' ? (
        <video
          controls
          playsInline
          preload="metadata"
          poster={item.poster}
          aria-label={localize(item.title ?? item.alt, locale)}
        >
          {nearViewport ? <source src={item.src} /> : null}
        </video>
      ) : null}

      {item.type === 'externalVideo' ? (
        externalLoaded ? (
          <iframe
            src={item.embedUrl}
            title={getExternalTitle(item, locale)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <>
            <img
              src={item.poster}
              alt={localize(item.alt, locale)}
              width="1536"
              height="864"
              loading="lazy"
              decoding="async"
            />
            <button
              type="button"
              className={styles.playButton}
              aria-label={getExternalTitle(item, locale)}
              onClick={() => setExternalLoaded(true)}
            >
              <IconPlayerPlay aria-hidden="true" />
            </button>
          </>
        )
      ) : null}

      {item.type === 'image' && item.isPlaceholder ? (
        <div className={styles.placeholder}>
          <span aria-hidden="true" />
          {localize(siteCopy.mediaPlaceholder, locale)}
        </div>
      ) : null}

      <div className={styles.overlay} aria-hidden="true" />
      <span className={styles.corner} aria-hidden="true" />
    </div>
  )
}
