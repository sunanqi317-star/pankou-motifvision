import { publicationsAndPresentations } from '../data/profile';
import { ContentSection } from './ContentSection';

export function PublicationsAndPresentations() {
  return (
    <ContentSection id="publications-and-presentations" title="Publications and Presentations">
      <div className="content-card-stack">
        {publicationsAndPresentations.map((entry) => (
          <article key={entry.id} className="content-card">
            <h3 className="card-title">{entry.title}</h3>

            <p className="card-meta">
              {entry.roleLine.before}
              {'emphasis' in entry.roleLine && entry.roleLine.emphasis ? (
                <em>{entry.roleLine.emphasis}</em>
              ) : null}
            </p>

            {'note' in entry && entry.note ? <p className="card-meta">{entry.note}</p> : null}

            <div className="metric-badges">
              <span className="metric-badge">{entry.type}</span>
              <span className="metric-badge">{entry.statusBadge}</span>
            </div>
          </article>
        ))}
      </div>
    </ContentSection>
  );
}
