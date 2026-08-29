import {
  IconBraces,
  IconCube3dSphere,
  IconGitBranch,
  IconViewportWide,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import type { Locale } from '../content/portfolio'
import { localize, siteCopy, skillGroups } from '../content/portfolio'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import styles from './Skills.module.css'

interface SkillsProps {
  locale: Locale
}

const icons: Record<string, ComponentType<{ 'aria-hidden'?: boolean }>> = {
  engine: IconCube3dSphere,
  programming: IconBraces,
  graphics: IconViewportWide,
  workflow: IconGitBranch,
}

export function Skills({ locale }: SkillsProps) {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <div className="content-container">
        <Reveal>
          <div id="skills-title">
            <SectionHeading index="02" title={siteCopy.sections.skills.title} locale={locale} />
          </div>
        </Reveal>

        <div className={styles.grid}>
          {skillGroups.map((group, index) => {
            const Icon = icons[group.id]
            return (
              <Reveal key={group.id} className={styles.card} delay={index * 0.06} distance={22}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>{Icon ? <Icon aria-hidden={true} /> : null}</span>
                  <span className={styles.code} aria-hidden="true">SYS.0{index + 1}</span>
                </div>
                <h3>{localize(group.title, locale)}</h3>
                <p>{localize(group.description, locale)}</p>
                <ul role="list">
                  {group.items.map((item) => (
                    <li key={item.en}>
                      <span aria-hidden="true" />
                      {localize(item, locale)}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
