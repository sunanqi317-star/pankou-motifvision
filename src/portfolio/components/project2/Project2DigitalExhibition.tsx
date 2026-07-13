import { memo, useCallback, useMemo, useState } from 'react';
import { ProjectSectionIntro } from '../ProjectSectionIntro';
import { OptimizedImage } from '../OptimizedImage';
import styles from './Project2DigitalExhibition.module.css';

type ExhibitId = 'coiled-flower' | 'butterfly' | 'double-coil' | 'floral';

interface MuseumExhibit {
  id: ExhibitId;
  number: string;
  name: string;
  exhibitionImage: string;
  period: string;
  structure: string;
  craft: string;
  meaning: string;
}

const MUSEUM_EXHIBITS: MuseumExhibit[] = [
  {
    id: 'coiled-flower',
    number: '01',
    name: 'Butterfly Knot',
    exhibitionImage: '/images/1.png',
    period: 'Republican-era Haipai · 1920s–1940s',
    structure: 'Central knot with bilateral floral loops',
    craft: 'Continuous cord wrapping',
    meaning: 'Elegance · Harmony · Decorative refinement',
  },
  {
    id: 'butterfly',
    number: '02',
    name: 'Floral Knot',
    exhibitionImage: '/images/2.png',
    period: 'Republican-era Haipai · 1920s–1940s',
    structure: 'Mirrored wing-like loops with central knot',
    craft: 'Symmetrical cord shaping',
    meaning: 'Grace · Vitality · Auspicious transformation',
  },
  {
    id: 'double-coil',
    number: '03',
    name: 'Double-Coil Knot',
    exhibitionImage: '/images/3.png',
    period: 'Republican-era Haipai · 1920s–1940s',
    structure: 'Bilateral spiral coils with central node',
    craft: 'Layered spiral cordwork',
    meaning: 'Balance · Simplicity · Understated elegance',
  },
  {
    id: 'floral',
    number: '04',
    name: 'Floral Knot',
    exhibitionImage: '/images/4.png',
    period: 'Republican-era Haipai · 1920s–1940s',
    structure: 'Radial petal motifs from central knot',
    craft: 'Looping cord petal formation',
    meaning: 'Femininity · Grace · Floral auspiciousness',
  },
];

const ExhibitSelectorItem = memo(function ExhibitSelectorItem({
  item,
  isActive,
  onSelect,
}: {
  item: MuseumExhibit;
  isActive: boolean;
  onSelect: (id: ExhibitId) => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`${styles.selectorItem}${isActive ? ` ${styles.selectorItemActive}` : ''}`}
      onClick={() => onSelect(item.id)}
    >
      <span className={styles.selectorThumb}>
        {isActive ? (
          <OptimizedImage src={item.exhibitionImage} alt="" loading="eager" />
        ) : (
          <OptimizedImage src={item.exhibitionImage} alt="" loading="lazy" />
        )}
      </span>
      <span className={styles.selectorMeta}>
        <span className={styles.selectorNumber}>{item.number}</span>
        <span className={styles.selectorName}>{item.name}</span>
      </span>
    </button>
  );
});

export function Project2DigitalExhibition() {
  const [activeId, setActiveId] = useState<ExhibitId>('coiled-flower');
  const exhibit = useMemo(
    () => MUSEUM_EXHIBITS.find((item) => item.id === activeId) ?? MUSEUM_EXHIBITS[0],
    [activeId],
  );
  const handleSelect = useCallback((id: ExhibitId) => {
    setActiveId(id);
  }, []);

  return (
    <section
      id="virtual-museum-exhibition"
      className={`project-detail-section ${styles.section}`}
      aria-labelledby="project2-exhibition-kicker"
    >
      <div id="project2-exhibition-kicker" className={styles.kicker}>
        Virtual Museum Exhibition
      </div>
      <ProjectSectionIntro>
        Reconstructed Pankou artifacts are transformed into interactive museum exhibits through
        digital dissemination — each Unity-built display presents a restored fastening form within a
        curated spatial gallery for public heritage communication.
      </ProjectSectionIntro>

      <div className={styles.exhibitionStage}>
        <figure className={styles.previewFrame}>
          <div className={styles.exhibitBadge} aria-hidden="true">
            <span className={styles.exhibitNumber}>Exhibit {exhibit.number}</span>
            <span className={styles.exhibitName}>{exhibit.name}</span>
          </div>
          <OptimizedImage
            key={exhibit.exhibitionImage}
            src={exhibit.exhibitionImage}
            alt={`Unity virtual museum display — ${exhibit.name}`}
            className={styles.previewImage}
            loading="eager"
          />
          <figcaption className={styles.previewCaption}>Unity spatial gallery</figcaption>
        </figure>

        <aside className={styles.labelPanel} aria-live="polite">
          <dl className={styles.labelList}>
            <div className={styles.labelRow}>
              <dt>Collection Label</dt>
              <dd className={styles.labelPrimary}>{exhibit.name}</dd>
            </div>
            <div className={styles.labelRow}>
              <dt>Exhibit</dt>
              <dd>{exhibit.number}</dd>
            </div>
            <div className={styles.labelRow}>
              <dt>Historical Period</dt>
              <dd>{exhibit.period}</dd>
            </div>
            <div className={styles.labelRow}>
              <dt>Structural Feature</dt>
              <dd>{exhibit.structure}</dd>
            </div>
            <div className={styles.labelRow}>
              <dt>Craft Technique</dt>
              <dd>{exhibit.craft}</dd>
            </div>
            <div className={styles.labelRow}>
              <dt>Cultural Meaning</dt>
              <dd>{exhibit.meaning}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className={styles.selector} role="tablist" aria-label="Pankou artifact collection">
        {MUSEUM_EXHIBITS.map((item) => (
          <ExhibitSelectorItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  );
}
