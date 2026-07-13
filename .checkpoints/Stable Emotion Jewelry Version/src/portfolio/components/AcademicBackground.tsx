import { education } from '../data/profile';
import { ContentSection } from './ContentSection';

function EducationRow({
  degree,
  institution,
  period,
  averageScore,
  gpa,
  coursework,
  ...rest
}: (typeof education)[number]) {
  const ranking = 'ranking' in rest ? rest.ranking : undefined;

  return (
    <article className="content-card">
      <h3 className="card-title">{degree}</h3>
      <p className="card-meta">
        {institution} · {period}
      </p>

      <div className="metric-badges">
        <span className="metric-badge">
          Average Score: <strong className="metric-value">{averageScore}</strong>
        </span>
        <span className="metric-badge">
          GPA: <strong className="metric-value">{gpa}</strong>
        </span>
        {ranking && (
          <span className="metric-badge">
            Ranking: <strong className="metric-value">{ranking}</strong>
          </span>
        )}
      </div>

      <p className="card-text-muted">
        Coursework: {coursework.join(' · ')}
      </p>
    </article>
  );
}

export function AcademicBackground() {
  return (
    <ContentSection id="academic" title="Academic Background">
      <div className="content-card-stack">
        {education.map((entry) => (
          <EducationRow key={entry.degree} {...entry} />
        ))}
      </div>
    </ContentSection>
  );
}
