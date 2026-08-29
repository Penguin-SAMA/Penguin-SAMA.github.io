import { IconArrowUp, IconArrowUpRight, IconBrandGithub, IconMail } from '@tabler/icons-react'
import type { Locale } from '../content/portfolio'
import { contact, contactLinks, localize, siteCopy } from '../content/portfolio'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import styles from './Contact.module.css'

interface ContactProps {
  locale: Locale
}

export function Contact({ locale }: ContactProps) {
  const year = new Date().getFullYear()

  return (
    <>
      <section id="contact" className={styles.section} aria-labelledby="contact-title">
        <div className="content-container">
          <Reveal>
            <div id="contact-title">
              <SectionHeading index="04" title={siteCopy.sections.contact.title} locale={locale} />
            </div>
          </Reveal>

          <Reveal className={styles.contactFrame} distance={32}>
            <div className={styles.copy}>
              <div className={styles.status}>
                <span aria-hidden="true" />
                {localize(contact.status, locale)}
              </div>
              <p>{localize(contact.body, locale)}</p>
            </div>

            <div className={styles.links}>
              {contactLinks.map((link) => {
                const Icon = link.kind === 'email' ? IconMail : IconBrandGithub
                return (
                  <a
                    key={link.kind}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    <span className={styles.linkIcon}><Icon aria-hidden="true" /></span>
                    <span className={styles.linkCopy}>
                      <small>{localize(link.label, locale)}</small>
                      <strong>{link.value}</strong>
                    </span>
                    <IconArrowUpRight className={styles.arrow} aria-hidden="true" />
                  </a>
                )
              })}
            </div>

            <span className={styles.coordinate} aria-hidden="true">CONTACT.NODE / 04</span>
          </Reveal>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`page-container ${styles.footerInner}`}>
          <p>
            {localize(siteCopy.footer.copyright, locale).replace('{year}', String(year))}
          </p>
          <p>{localize(siteCopy.footer.builtAs, locale)}</p>
          <a href="#home">
            {localize(siteCopy.footer.backToTop, locale)}
            <IconArrowUp aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  )
}
