import { HEALING_DIMENSIONS } from '../../data/project3Content';
import styles from './Project3HealingValidation.module.css';

export function Project3HealingValidation() {
  return (
    <section
      id="emotional-healing-validation"
      className={`project-detail-section ${styles.section}`}
      aria-labelledby="project3-healing-kicker"
    >
      <div id="project3-healing-kicker" className={styles.kicker}>
        Emotional Healing Validation
      </div>
      <p className={styles.lead}>
        Final evaluation asks whether jewelry can carry emotional healing — functioning as a
        personal emotional carrier beyond decorative objecthood.
      </p>

      <div className={styles.grid}>
        {HEALING_DIMENSIONS.map((dimension) => (
          <article key={dimension.id} className={styles.card}>
            <h3 className={styles.cardTitle}>{dimension.title}</h3>
            <p className={styles.cardSummary}>{dimension.summary}</p>
            <p className={styles.cardDetail}>{dimension.detail}</p>
          </article>
        ))}
      </div>

      <p className={styles.closing}>
        Validation prioritizes felt emotional response — warmth, cheerfulness, and comfort — over
        technical generation quality or ornamental complexity.
      </p>
    </section>
  );
}
