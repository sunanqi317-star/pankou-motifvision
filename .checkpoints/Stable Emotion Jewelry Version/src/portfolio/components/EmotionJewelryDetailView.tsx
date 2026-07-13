import type { ProjectDetail } from '../data/projects';
import { Project3Page } from './project3/Project3Page';
import '../styles/project-emotion-jewelry.css';

interface EmotionJewelryDetailViewProps {
  project: ProjectDetail;
  onBack: () => void;
}

export function EmotionJewelryDetailView({ project, onBack }: EmotionJewelryDetailViewProps) {
  return (
    <article
      id="projects"
      className="project-detail-page scroll-mt-20 project-emotion-jewelry"
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

      <header className="project-hero project3-hero">
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

          <div className="project3-hero-panel">
            <p className="project3-hero-description">
              Transforming historical cultural symbols into emotion-oriented jewelry through
              semiotic interpretation, emotional keyword mapping, and AIGC-assisted design.
            </p>

            <div className="project3-hero-keywords">
              <h2 className="project3-hero-mini-heading">Keywords</h2>
              <div className="project-keyword-list project3-hero-keyword-list">
                {project.keywords.map((keyword) => (
                  <span key={keyword} className="project-keyword">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <figure className="project-hero-cover project3-hero-cover">
          <div className="project-image-slot project-image-slot--hero project3-hero-image-slot">
            {project.cover.src ? (
              <img
                src={project.cover.src}
                alt={project.cover.caption}
                loading="eager"
                decoding="async"
                width={300}
                height={449}
                className="project-image-photo project3-hero-image"
              />
            ) : (
              <span className="project-image-slot-label">{project.cover.slotLabel}</span>
            )}
          </div>
          <figcaption className="project-visual-caption">{project.cover.caption}</figcaption>
        </figure>
      </header>

      <section className="project-detail-section project-detail-section--lead">
        <h2 className="project-detail-heading">Overview</h2>
        <p className="project-detail-overview">{project.overview}</p>
      </section>

      <section className="project-detail-section">
        <h2 className="project-detail-heading">Research Narrative</h2>
        <ol
          className="project-process-timeline project-process-timeline--narrative"
          aria-label="Research narrative index"
        >
          {project.processSteps.map((step, index) => (
            <li key={step} className="project-process-step">
              <span className="project-process-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="project-process-label">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <Project3Page />

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
