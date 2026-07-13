import { useState } from 'react';
import {
  KEYWORD_DIMENSIONS,
  type KeywordDimensionId,
} from '../../data/project3Content';
import styles from './Project3KeywordFramework.module.css';

const POSITION_CLASS: Record<KeywordDimensionId, string> = {
  'emotional-guidance': styles.dimensionBtnTop,
  'cultural-symbols': styles.dimensionBtnRight,
  'wearing-functionality': styles.dimensionBtnBottom,
  'aesthetic-style': styles.dimensionBtnLeft,
};

export function Project3KeywordFramework() {
  const [activeId, setActiveId] = useState<KeywordDimensionId>('emotional-guidance');
  const active =
    KEYWORD_DIMENSIONS.find((dimension) => dimension.id === activeId) ??
    KEYWORD_DIMENSIONS[0];

  return (
    <section
      id="emotion-keyword-framework"
      className={`project-detail-section ${styles.section}`}
      aria-labelledby="project3-keyword-kicker"
    >
      <div id="project3-keyword-kicker" className={styles.kicker}>
        Emotion Keyword Framework
      </div>
      <p className={styles.lead}>
        Four research dimensions surround the museum artifact — mapping how cultural symbols become
        structured keywords for emotion-oriented jewelry design.
      </p>

      <div className={styles.hub}>
        <div className={styles.hubMap} role="tablist" aria-label="Keyword dimensions">
          <div className={styles.hubCenter}>Drumming and Chanting Figurine</div>
          {KEYWORD_DIMENSIONS.map((dimension, index) => (
            <button
              key={dimension.id}
              type="button"
              role="tab"
              aria-selected={activeId === dimension.id}
              className={`${styles.dimensionBtn} ${POSITION_CLASS[dimension.id]}${
                activeId === dimension.id ? ` ${styles.dimensionBtnActive}` : ''
              }`}
              onClick={() => setActiveId(dimension.id)}
            >
              <span className={styles.dimensionIndex}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.dimensionTitle}>{dimension.title}</span>
            </button>
          ))}
        </div>

        <aside className={styles.detailPanel} aria-live="polite">
          <h3 className={styles.detailTitle}>{active.title}</h3>
          <ul className={styles.keywordList}>
            {active.keywords.map((keyword) => (
              <li key={keyword}>{keyword}</li>
            ))}
          </ul>
          <p className={styles.detailInfluence}>{active.influence}</p>
        </aside>
      </div>
    </section>
  );
}
