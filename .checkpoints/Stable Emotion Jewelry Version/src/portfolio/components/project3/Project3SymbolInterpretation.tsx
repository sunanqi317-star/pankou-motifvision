import { EXTRACTED_SYMBOLS, PEIRCE_TRIAD } from '../../data/project3Content';
import styles from './Project3SymbolInterpretation.module.css';

export function Project3SymbolInterpretation() {
  return (
    <section
      id="cultural-symbol-interpretation"
      className={`project-detail-section ${styles.section}`}
      aria-labelledby="project3-symbol-kicker"
    >
      <div id="project3-symbol-kicker" className={styles.kicker}>
        Cultural Symbol Interpretation
      </div>
      <p className={styles.lead}>
        Peircean semiotic analysis maps museum-visible forms to cultural referents and emotional
        responses — establishing the interpretive basis for jewelry translation.
      </p>

      <div className={styles.triad} aria-label="Peircean semiotic triad">
        {PEIRCE_TRIAD.map((item) => (
          <article key={item.term} className={styles.triadCard}>
            <p className={styles.triadTerm}>{item.term}</p>
            <h3 className={styles.triadLabel}>{item.label}</h3>
            <p className={styles.triadDetail}>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className={styles.symbolGrid} aria-label="Extracted visual symbols">
        {EXTRACTED_SYMBOLS.map((item) => (
          <article key={item.id} className={styles.symbolCard}>
            <h3 className={styles.symbolName}>{item.symbol}</h3>
            <p className={styles.symbolRow}>
              <strong>Cultural meaning · </strong>
              {item.cultural}
            </p>
            <p className={styles.symbolRow}>
              <strong>Emotional response · </strong>
              {item.emotional}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
