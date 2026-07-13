import type { ProjectDetail, VisualEvidenceItem } from '../data/projects';
import { EmotionJewelryDetailView } from './EmotionJewelryDetailView';
import { PankouGeneLoraDetailView } from './PankouGeneLoraDetailView';
import { OptimizedImage } from './OptimizedImage';
import { Project2Page } from './project2/Project2Page';
import '../styles/project-pankou-restoration.css';

function ProjectHeroImage({
  src,
  alt,
  caption,
  fallbackLabel,
}: {
  src?: string;
  alt: string;
  caption: string;
  fallbackLabel: string;
}) {
  return (
    <figure className="project-hero-cover">
      <div className="project-hero-image">
        {src ? (
          <OptimizedImage src={src} alt={alt} loading="eager" />
        ) : (
          <span className="project-hero-image-placeholder">{fallbackLabel}</span>
        )}
      </div>
      <figcaption className="project-hero-caption">{caption}</figcaption>
    </figure>
  );
}

function ImageSlot({
  label,
  src,
  className = '',
  objectFit = 'cover',
}: {
  label: string;
  src?: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
}) {
  const containClass = objectFit === 'contain' ? 'project-image-slot--contain' : '';

  if (src) {
    return (
      <div className={`project-image-slot ${containClass} ${className}`.trim()}>
        <OptimizedImage
          src={src}
          alt={label}
          loading={className?.includes('project-image-slot--hero') ? 'eager' : 'lazy'}
          className={`project-image-photo${objectFit === 'contain' ? ' project-image-photo--contain' : ''}`}
        />
      </div>
    );
  }

  return (
    <div className={`project-image-slot project-image-slot--labeled ${className}`.trim()}>
      <span className="project-image-slot-label">{label}</span>
    </div>
  );
}

function VisualFigure({ item }: { item: VisualEvidenceItem }) {
  if (item.compare) {
    return (
      <figure className={`project-visual-figure project-visual-figure--compare${item.layout === 'wide' ? ' project-visual-figure--wide' : ''}`}>
        <div className="project-compare-grid">
          <div className="project-compare-panel">
            <ImageSlot label={item.compare.before} />
            <p className="project-compare-tag">{item.compare.before}</p>
          </div>
          <div className="project-compare-panel">
            <ImageSlot label={item.compare.after} />
            <p className="project-compare-tag">{item.compare.after}</p>
          </div>
        </div>
        <figcaption className="project-visual-caption">{item.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={`project-visual-figure${item.layout === 'wide' ? ' project-visual-figure--wide' : ''}`}
    >
      <ImageSlot label={item.slotLabel} />
      <figcaption className="project-visual-caption">{item.caption}</figcaption>
    </figure>
  );
}

interface ProjectDetailViewProps {
  project: ProjectDetail;
  onBack: () => void;
}

export function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  if (project.id === 'pankou-gene-lora') {
    return <PankouGeneLoraDetailView project={project} onBack={onBack} />;
  }

  if (project.id === 'emotion-jewelry') {
    return <EmotionJewelryDetailView project={project} onBack={onBack} />;
  }

  const isHorizontalHero = project.cover.layout === 'horizontal';
  const isPankouRestoration = project.id === 'pankou-restoration';

  return (
    <article
      id="projects"
      className={`project-detail-page scroll-mt-20${
        isHorizontalHero ? ' project-detail-page--horizontal-hero' : ''
      }${isPankouRestoration ? ' project-pankou-restoration' : ''}`}
    >
      <a
        href="/projects"
        className="project-back-link"
        onClick={(event) => {
          event.preventDefault();
          onBack();
        }}
      >
        ← All Projects
      </a>

      <header
        className={`project-hero${isHorizontalHero ? ' project-hero--horizontal' : ''}${
          isPankouRestoration ? ' project2-hero' : ''
        }`}
      >
        <div className="project-hero-text">
          <p className="project-overview-number">{project.number}</p>
          <h1 className="project-hero-title">{project.title}</h1>
          {project.subtitle ? <p className="project-hero-subtitle">{project.subtitle}</p> : null}
          <p className="project-hero-meta">
            {project.time}
            <span className="research-experience-meta-sep" aria-hidden="true">
              ·
            </span>
            {project.institution}
          </p>
          {isPankouRestoration ? (
            <div className="project2-hero-panel">
              <p className="project2-hero-description">
                Preserving Republican-era Haipai Pankou heritage through archival research, digital
                reconstruction, and public dissemination.
              </p>

              <div className="project2-hero-keywords">
                <h2 className="project2-hero-mini-heading">Keywords</h2>
                <div className="project-keyword-list project2-hero-keyword-list">
                  {project.keywords.map((keyword) => (
                    <span key={keyword} className="project-keyword">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="project2-hero-research-focus">
                <h2 className="project2-hero-mini-heading">Research Focus</h2>
                <ul className="project2-hero-focus-list">
                  <li>Cultural heritage restoration</li>
                  <li>Digital reconstruction</li>
                  <li>Interactive heritage communication</li>
                </ul>
              </div>

              <div className="project2-hero-scale">
                <h2 className="project2-hero-mini-heading">Research Scale</h2>
                <dl className="project2-hero-scale-list">
                  <div className="project2-hero-scale-item">
                    <dt className="project2-hero-scale-value">200+</dt>
                    <dd>Historical images analyzed</dd>
                  </div>
                  <div className="project2-hero-scale-item">
                    <dt className="project2-hero-scale-value">50+</dt>
                    <dd>Digital models reconstructed</dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="project-keyword-list">
              {project.keywords.map((keyword) => (
                <span key={keyword} className="project-keyword">
                  {keyword}
                </span>
              ))}
            </div>
          )}
          {!isPankouRestoration && project.heroSummary && (
            <p className="project-hero-summary">{project.heroSummary}</p>
          )}
        </div>

        {isHorizontalHero ? (
          <ProjectHeroImage
            src={project.cover.src}
            alt={project.cover.caption}
            caption={project.cover.caption}
            fallbackLabel={project.cover.slotLabel}
          />
        ) : (
          <figure className="project-hero-cover">
            <ImageSlot
              label={project.cover.slotLabel}
              src={project.cover.src}
              objectFit={project.cover.objectFit}
              className="project-image-slot--hero"
            />
            <figcaption className="project-visual-caption">{project.cover.caption}</figcaption>
          </figure>
        )}
      </header>

      <section className="project-detail-section project-detail-section--lead">
        <h2 className="project-detail-heading">Overview</h2>
        <p className="project-detail-overview">{project.overview}</p>
      </section>

      <section className="project-detail-section">
        <h2 className="project-detail-heading">
          {isPankouRestoration ? 'Project Narrative' : 'Process'}
        </h2>
        <ol
          className={`project-process-timeline${
            isPankouRestoration ? ' project-process-timeline--narrative' : ''
          }`}
          aria-label={isPankouRestoration ? 'Project narrative index' : 'Project process'}
        >
          {project.processSteps.map((step, index) => (
            <li key={step} className="project-process-step">
              <span className="project-process-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="project-process-label">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {isPankouRestoration ? (
        <Project2Page />
      ) : (
        <section className="project-detail-section">
          <h2 className="project-detail-heading">Visual Evidence</h2>
          <div className="project-visual-grid">
            {project.visualEvidence.map((item) => (
              <VisualFigure key={item.caption} item={item} />
            ))}
          </div>
        </section>
      )}

      <div className="project-detail-meta-grid">
        <section className="project-detail-section project-detail-section--compact">
          <h2 className="project-detail-heading">My Role</h2>
          <ul className="project-role-tags">
            {project.roleTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </section>

        <section className="project-detail-section project-detail-section--compact">
          <h2 className="project-detail-heading">Outputs</h2>
          <ul className="project-output-list">
            {project.outputs.map((output) => (
              <li key={output}>{output}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
