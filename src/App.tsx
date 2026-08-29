import { useEffect } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { CursorTrace } from './components/CursorTrace'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { localize, siteCopy } from './content/portfolio'
import { useLocale } from './hooks/useLocale'
import styles from './App.module.css'

function updateMeta(selector: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value)
}

function App() {
  const { locale, setLocale } = useLocale()

  useEffect(() => {
    const title = localize(siteCopy.seo.title, locale)
    const description = localize(siteCopy.seo.description, locale)
    document.title = title
    updateMeta('meta[name="description"]', description)
    updateMeta('meta[property="og:title"]', title)
    updateMeta('meta[property="og:description"]', description)
    updateMeta('meta[property="og:locale"]', locale === 'zh' ? 'zh_CN' : 'en_US')
  }, [locale])

  return (
    <div className={styles.app}>
      <a className="skip-link" href="#main-content">
        {localize(siteCopy.accessibility.skipToContent, locale)}
      </a>
      <div className={styles.technicalBackdrop} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Header locale={locale} onLocaleChange={setLocale} />
      <main id="main-content">
        <Hero locale={locale} />
        <Projects locale={locale} />
        <Skills locale={locale} />
        <About locale={locale} />
        <Contact locale={locale} />
      </main>
      <CursorTrace />
    </div>
  )
}

export default App
