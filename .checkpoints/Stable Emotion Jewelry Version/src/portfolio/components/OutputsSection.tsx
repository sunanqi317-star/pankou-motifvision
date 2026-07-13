import { outputs } from '../data/profile';
import { ContentSection } from './ContentSection';

export function OutputsSection() {
  return (
    <ContentSection id="outputs" title="Outputs">
      <div className="content-card-stack">
        {outputs.map((item) => (
          <article key={item.id} className="content-card">
            <h3 className="publication-title">{item.title}</h3>

            <div className="publication-header">
              <span className="role-badge">{item.role}</span>
              <span className="status-badge">{item.status}</span>
            </div>

            <p className="card-meta mt-2">{item.venue}</p>
          </article>
        ))}
      </div>
    </ContentSection>
  );
}
