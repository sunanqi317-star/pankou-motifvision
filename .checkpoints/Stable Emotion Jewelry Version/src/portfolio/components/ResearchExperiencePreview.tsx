import { researchExperience } from '../data/profile';
import { ContentSection } from './ContentSection';

function ExperienceField({ label, text }: { label: string; text: string }) {
  return (
    <div className="research-experience-field">
      <p className="research-experience-label">{label}</p>
      <p className="research-experience-text">{text}</p>
    </div>
  );
}

function cardClassName(variant?: 'core' | 'material' | 'ethics') {
  const classes = ['research-experience-card'];

  if (variant === 'core') {
    classes.push('research-experience-card--core');
  }

  if (variant === 'material') {
    classes.push('research-experience-card--material');
  }

  if (variant === 'ethics') {
    classes.push('research-experience-card--ethics');
  }

  return classes.join(' ');
}

function badgeClassName(variant?: 'core' | 'material' | 'ethics') {
  const classes = ['research-badge'];

  if (variant === 'core') {
    classes.push('research-badge--core');
  }

  if (variant === 'material') {
    classes.push('research-badge--material');
  }

  if (variant === 'ethics') {
    classes.push('research-badge--ethics');
  }

  return classes.join(' ');
}

interface ResearchExperiencePreviewProps {
  onViewAll: () => void;
}

export function ResearchExperiencePreview({ onViewAll }: ResearchExperiencePreviewProps) {
  return (
    <ContentSection id="research-experience" title="Research Experience">
      <div className="research-experience-stack">
        {researchExperience.map((entry) => (
          <article key={entry.id} className={cardClassName(entry.cardVariant)}>
            <header className="research-experience-header">
              {entry.label && (
                <span className={badgeClassName(entry.cardVariant)}>{entry.label}</span>
              )}

              <h3 className="research-experience-title">{entry.title}</h3>

              <p className="research-experience-meta">
                {entry.time}
                <span className="research-experience-meta-sep" aria-hidden="true">
                  ·
                </span>
                {entry.institution}
              </p>
            </header>

            <div className="research-experience-grid">
              <ExperienceField label="Overview" text={entry.overview} />
              <ExperienceField label="My Role" text={entry.role} />
              <ExperienceField label="Methods / Tools" text={entry.methods} />
              <ExperienceField label="Outputs" text={entry.outputs} />
            </div>
          </article>
        ))}
      </div>

      <a
        href="/projects"
        className="view-projects-link"
        onClick={(event) => {
          event.preventDefault();
          onViewAll();
        }}
      >
        Related Projects
      </a>
    </ContentSection>
  );
}
