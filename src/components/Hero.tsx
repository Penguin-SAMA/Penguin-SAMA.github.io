import { IconArrowDown, IconArrowUpRight, IconBrandGithub } from '@tabler/icons-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '../content/portfolio'
import { contactLinks, localize, siteCopy } from '../content/portfolio'
import styles from './Hero.module.css'

interface HeroProps {
  locale: Locale
}

export function Hero({ locale }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 72])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 30])
  const github = contactLinks.find((link) => link.kind === 'github')!

  return (
    <section ref={sectionRef} id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={`page-container ${styles.inner}`}>
        <motion.div className={styles.copy} style={reduceMotion ? undefined : { y: copyY }}>
          <motion.div
            className={styles.eyebrow}
            initial={reduceMotion ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.signal} aria-hidden="true" />
            <span>PORTFOLIO / 2026</span>
          </motion.div>

          <motion.p
            className={styles.name}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {localize(siteCopy.hero.name, locale)}
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.13, ease: [0.22, 1, 0.36, 1] }}
          >
            {localize(siteCopy.hero.title, locale)}
            <span aria-hidden="true">.</span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {localize(siteCopy.hero.description, locale)}
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <a className={styles.primaryAction} href="#projects">
              {localize(siteCopy.hero.primaryAction, locale)}
              <IconArrowDown aria-hidden="true" />
            </a>
            <a
              className={styles.secondaryAction}
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub aria-hidden="true" />
              {localize(siteCopy.hero.secondaryAction, locale)}
              <IconArrowUpRight className={styles.externalIcon} aria-hidden="true" />
            </a>
          </motion.div>

          <motion.div
            className={styles.meta}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.38 }}
          >
            <span>{localize(siteCopy.hero.education, locale)}</span>
            <span aria-hidden="true">UE5 · C++ · GODOT</span>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.visualStage}
          style={reduceMotion ? undefined : { y: visualY }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.axisTop} aria-hidden="true">SYS.OVERVIEW</span>
          <span className={styles.axisSide} aria-hidden="true">01—04 / BUILD LOG</span>
          <div className={styles.visualFrame}>
            <img
              src="/media/placeholders/hero-systems.webp"
              alt=""
              width="1536"
              height="1024"
              fetchPriority="high"
            />
            <div className={styles.scan} aria-hidden="true" />
            <div className={styles.placeholderLabel}>
              <span aria-hidden="true" />
              {localize(siteCopy.mediaPlaceholder, locale)}
            </div>
          </div>
          <div className={styles.cornerReadout} aria-hidden="true">
            <strong>REALTIME</strong>
            <span>RENDER / INPUT / SYSTEMS</span>
          </div>
          <span className={styles.ember} aria-hidden="true" />
        </motion.div>

        <a
          className={styles.scrollCue}
          href="#projects"
          aria-label={`SCROLL / ${localize(siteCopy.hero.primaryAction, locale)}`}
        >
          <span aria-hidden="true">SCROLL</span>
          <IconArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
