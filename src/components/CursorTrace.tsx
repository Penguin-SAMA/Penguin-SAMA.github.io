import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import styles from './CursorTrace.module.css'

export function CursorTrace() {
  const reduceMotion = useReducedMotion()
  const [finePointer, setFinePointer] = useState(() =>
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)').matches
      : false,
  )
  const enabled = !reduceMotion && finePointer
  const pointRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)')
    const update = (event: MediaQueryListEvent) => setFinePointer(event.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let frame = 0
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
        if (pointRef.current) pointRef.current.style.transform = transform
        if (trailRef.current) trailRef.current.style.transform = transform
      })
    }

    const show = () => document.documentElement.dataset.cursorActive = 'true'
    const hide = () => delete document.documentElement.dataset.cursorActive
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerenter', show)
    document.addEventListener('pointerleave', hide)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerenter', show)
      document.removeEventListener('pointerleave', hide)
      delete document.documentElement.dataset.cursorActive
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className={styles.layer} aria-hidden="true">
      <div ref={trailRef} className={styles.trail} />
      <div ref={pointRef} className={styles.point} />
    </div>
  )
}
