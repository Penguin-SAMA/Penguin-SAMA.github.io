import { IconAward, IconCodeDots, IconSchool } from '@tabler/icons-react'
import type { Locale } from '../content/portfolio'
import { about, education, localize, siteCopy, skillGroups } from '../content/portfolio'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import styles from './About.module.css'

interface AboutProps {
  locale: Locale
}

export function About({ locale }: AboutProps) {
  const workflow = skillGroups.find((group) => group.id === 'workflow')!

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className="content-container">
        <Reveal>
          <div id="about-title">
            <SectionHeading index="03" title={siteCopy.sections.about.title} locale={locale} />
          </div>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={`${styles.panel} ${styles.profile}`}>
            <div className={styles.panelHeader}>
              <IconCodeDots aria-hidden="true" />
              <span>{localize(about.labels.profile, locale)}</span>
            </div>
            <p className={styles.lead}>{localize(about.body, locale)}</p>
            <div className={styles.signature} aria-hidden="true">
              <span>QIDE MAO</span>
              <span>GAME CLIENT / ENGINEERING</span>
            </div>
          </Reveal>

          <Reveal className={`${styles.panel} ${styles.education}`} delay={0.08}>
            <div className={styles.panelHeader}>
              <IconSchool aria-hidden="true" />
              <span>{localize(about.labels.education, locale)}</span>
            </div>
            <h3>{localize(education.school, locale)}</h3>
            <p>{localize(education.degree, locale)}</p>
            <dl>
              <div>
                <dt>{localize(about.labels.period, locale)}</dt>
                <dd>{education.period}</dd>
              </div>
              <div>
                <dt>{localize(about.labels.award, locale)}</dt>
                <dd><IconAward aria-hidden="true" />{localize(education.award, locale)}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className={`${styles.panel} ${styles.workflow}`} delay={0.16}>
            <div className={styles.panelHeader}>
              <span className={styles.pulse} aria-hidden="true" />
              <span>{localize(about.labels.workflow, locale)}</span>
            </div>
            <p>{localize(workflow.description, locale)}</p>
            <ul role="list">
              {workflow.items.map((item, index) => (
                <li key={item.en}>
                  <span aria-hidden="true">0{index + 1}</span>
                  {localize(item, locale)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
