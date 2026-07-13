import { OptimizedImage } from '../OptimizedImage';
import styles from './Project2Prototype.module.css';

interface ExhibitionStage {
  id: string;
  number: string;
  title: string;
  role: string;
  description: string;
  image: string;
  imageFit: 'cover' | 'contain';
  alt: string;
  variant: 'reference' | 'digital' | 'hero';
}

const EXHIBITION_STAGES: ExhibitionStage[] = [
  {
    id: 'historical-reference',
    number: '01',
    title: 'Historical Reference',
    role: 'Supporting evidence',
    description: 'Historical imagery providing structural and material references.',
    image: '/images/1.1.png',
    imageFit: 'cover',
    alt: 'Archival Liangyou magazine cover showing Republican-era qipao with Pankou fastening',
    variant: 'reference',
  },
  {
    id: 'digital-reconstruction',
    number: '02',
    title: 'Digital Reconstruction',
    role: 'Research method',
    description: 'Recovered Pankou forms translated into digital geometry.',
    image: '/images/1.2-transparent.png',
    imageFit: 'contain',
    alt: 'Digital mesh reconstruction of a floral Pankou knot',
    variant: 'digital',
  },
  {
    id: 'physical-prototype',
    number: '03',
    title: 'Physical Prototype',
    role: 'Validation outcome',
    description: 'Digital reconstruction validated through handmade production.',
    image: '/images/1.3.png',
    imageFit: 'cover',
    alt: 'Handmade Pankou prototype worn on garment, validating digital reconstruction',
    variant: 'hero',
  },
];

function ExhibitionColumn({ stage }: { stage: ExhibitionStage }) {
  return (
    <article className={styles.stage}>
      <figure className={styles.stageFigure}>
        <header className={styles.stageHeader}>
          <span className={styles.stageNumber}>{stage.number}</span>
          <div className={styles.stageTitles}>
            <span className={styles.stageTitle}>{stage.title}</span>
            <span className={styles.stageRole}>{stage.role}</span>
          </div>
        </header>
        <div
          className={`${styles.stageImage}${
            stage.imageFit === 'contain' ? ` ${styles.stageImageContain}` : ''
          }${stage.variant === 'digital' ? ` ${styles.stageImageFloating}` : ''}`}
        >
          <OptimizedImage src={stage.image} alt={stage.alt} loading="lazy" />
        </div>
        <figcaption className={styles.stageDescription}>{stage.description}</figcaption>
      </figure>
    </article>
  );
}

export function Project2Prototype() {
  return (
    <section
      id="physical-prototype-validation"
      className={`project-detail-section ${styles.section}`}
      aria-labelledby="project2-prototype-kicker"
    >
      <div id="project2-prototype-kicker" className={styles.kicker}>
        Physical Prototype Validation
      </div>
      <p className={styles.lead}>
        A validation case study tracing how restored Pankou forms move from historical craft
        reference through digital geometry to a physical prototype.
      </p>

      <div className={styles.composition} aria-label="Prototype validation stages">
        {EXHIBITION_STAGES.map((stage) => (
          <ExhibitionColumn key={stage.id} stage={stage} />
        ))}
      </div>
    </section>
  );
}
