import { IconMenu2, IconX } from '@tabler/icons-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Locale } from '../content/portfolio'
import { localize, siteCopy } from '../content/portfolio'
import styles from './Header.module.css'

interface HeaderProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}

export function Header({ locale, onLocaleChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const sections = siteCopy.navigation
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.1, 0.35] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.dataset.menuOpen = String(menuOpen)
    return () => {
      delete document.body.dataset.menuOpen
    }
  }, [menuOpen])

  useEffect(() => {
    const closeAtDesktop = () => {
      if (window.innerWidth > 768) setMenuOpen(false)
    }

    window.addEventListener('resize', closeAtDesktop)
    return () => window.removeEventListener('resize', closeAtDesktop)
  }, [])

  const handleNav = () => setMenuOpen(false)

  return (
    <header className={styles.header} data-menu-open={menuOpen}>
      <div className={`page-container ${styles.inner}`}>
        <a className={styles.brand} href="#home" onClick={handleNav}>
          <span className={styles.brandMark} aria-hidden="true">MQ</span>
          <span className={styles.brandCopy}>
            <strong>毛启德-个人作品集</strong>
          </span>
        </a>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={localize(
            menuOpen ? siteCopy.accessibility.closeMenu : siteCopy.accessibility.openMenu,
            locale,
          )}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <IconX aria-hidden="true" /> : <IconMenu2 aria-hidden="true" />}
        </button>

        <AnimatePresence initial={false}>
          <motion.div
            id="primary-navigation"
            className={styles.navigationPanel}
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className={styles.navigation} aria-label="Primary navigation">
              {siteCopy.navigation.map((item, index) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={activeSection === item.id ? styles.activeLink : undefined}
                  aria-current={activeSection === item.id ? 'location' : undefined}
                  onClick={handleNav}
                >
                  <span aria-hidden="true">0{index + 1}</span>
                  {localize(item.label, locale)}
                </a>
              ))}
            </nav>

            <div
              className={styles.languageSwitch}
              role="group"
              aria-label={localize(siteCopy.accessibility.switchLanguage, locale)}
            >
              {siteCopy.languageOptions.map((option) => (
                <button
                  key={option.locale}
                  type="button"
                  className={locale === option.locale ? styles.activeLanguage : undefined}
                  aria-pressed={locale === option.locale}
                  onClick={() => {
                    onLocaleChange(option.locale)
                    setMenuOpen(false)
                  }}
                >
                  {localize(option.label, locale)}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </header>
  )
}
