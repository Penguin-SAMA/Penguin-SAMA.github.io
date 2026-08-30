import { IconArrowUpRight } from '@tabler/icons-react'
import type { Locale } from '../content/portfolio'
import { localize, projects, siteCopy } from '../content/portfolio'
import { ProjectGallery } from './ProjectGallery'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import styles from './Projects.module.css'

interface ProjectsProps {
  locale: Locale
}

export function Projects({ locale }: ProjectsProps) {
  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className="content-container">
        <Reveal>
          <div id="projects-title">
            <SectionHeading
              index="01"
              title={siteCopy.sections.projects.title}
              description={siteCopy.sections.projects.description}
              locale={locale}
            />
          </div>
        </Reveal>

        <div className={styles.projectList}>
          {projects.map((project, index) => {
            const order = String(index + 1).padStart(2, '0')

            return (
              <article
                key={project.slug}
                className={styles.project}
                data-direction={index % 2 === 0 ? 'forward' : 'reverse'}
                data-testid="project-card"
              >
                <Reveal className={styles.numberColumn} delay={0.02}>
                  <span className={styles.projectNumber} aria-hidden="true">{order}</span>
                  <span className={styles.numberRule} aria-hidden="true" />
                </Reveal>

                <Reveal className={styles.mediaColumn} delay={0.06} distance={34}>
                  <ProjectGallery items={project.media} locale={locale} priority={index === 0} />
                  <span className={styles.mediaCaption} aria-hidden="true">
                    CASE / {project.slug.toUpperCase()}
                  </span>
                </Reveal>

                <Reveal className={styles.copyColumn} delay={0.12}>
                  <div className={styles.kicker}>
                    <span>PROJECT {order}</span>
                    {project.status ? <span>{localize(project.status, locale)}</span> : null}
                  </div>
                  <h3>{localize(project.title, locale)}</h3>
                  <p className={styles.summary}>{localize(project.summary, locale)}</p>
                  {project.showcaseNote ? (
                    <p className={styles.showcaseNote}>{localize(project.showcaseNote, locale)}</p>
                  ) : null}

                  <ul className={styles.highlights} role="list">
                    {project.highlights.map((highlight, highlightIndex) => (
                      <li key={`${project.slug}-${highlightIndex}`}>
                        <span aria-hidden="true">{String(highlightIndex + 1).padStart(2, '0')}</span>
                        {localize(highlight, locale)}
                      </li>
                    ))}
                  </ul>

                  <ul
                    className={styles.tags}
                    role="list"
                    aria-label={localize(siteCopy.projectTags.label, locale)}
                  >
                    {project.tags.map((tag) => (
                      <li key={`${tag.tone}-${tag.label.en}`} data-tone={tag.tone}>
                        {localize(tag.label, locale)}
                      </li>
                    ))}
                  </ul>

                  {project.links?.length ? (
                    <div className={styles.links}>
                      {project.links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                          {localize(link.label, locale)}
                          <IconArrowUpRight aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </Reveal>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
