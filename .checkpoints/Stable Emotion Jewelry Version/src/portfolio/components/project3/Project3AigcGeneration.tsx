import { AIGC_WORKFLOW, JEWELRY_CONCEPTS } from '../../data/project3Content';
import { OptimizedImage } from '../OptimizedImage';
import styles from './Project3AigcGeneration.module.css';

export function Project3AigcGeneration() {
  return (
    <section
      id="aigc-jewelry-generation"
      className={`project-detail-section ${styles.section}`}
      aria-labelledby="project3-aigc-kicker"
    >
      <div id="project3-aigc-kicker" className={styles.kicker}>
        AIGC-driven Jewelry Generation
      </div>
      <p className={styles.lead}>
        Keywords become generative prompts — AIGC serves as a research tool for probing emotional
        and cultural translation, not as the project’s primary outcome.
      </p>

      <div className={styles.layout}>
        <div className={styles.workflow} aria-label="AIGC research workflow">
          {AIGC_WORKFLOW.map((step, index) => (
            <div key={step.step}>
              <article className={styles.workflowStep}>
                <p className={styles.workflowLabel}>{step.step}</p>
                <p className={styles.workflowDetail}>{step.detail}</p>
              </article>
              {index < AIGC_WORKFLOW.length - 1 ? (
                <span className={styles.workflowArrow} aria-hidden="true">
                  ↓
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className={styles.conceptGrid} aria-label="Generated jewelry concepts">
          {JEWELRY_CONCEPTS.map((concept) => (
            <article key={concept.id} className={styles.conceptCard}>
              <figure className={styles.conceptImage}>
                <OptimizedImage
                  src={concept.image}
                  alt={`${concept.label} — AIGC jewelry concept`}
                  loading="lazy"
                />
              </figure>
              <p className={styles.conceptLabel}>{concept.label}</p>
              <p className={styles.conceptPoint}>
                <strong>Emotional · </strong>
                {concept.emotional}
              </p>
              <p className={styles.conceptPoint}>
                <strong>Cultural · </strong>
                {concept.cultural}
              </p>
              <p className={styles.conceptPoint}>
                <strong>Visual · </strong>
                {concept.visual}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
