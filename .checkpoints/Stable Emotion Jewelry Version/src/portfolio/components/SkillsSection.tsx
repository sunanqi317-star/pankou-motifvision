import { skills } from '../data/profile';
import { ContentSection } from './ContentSection';

export function SkillsSection() {
  return (
    <ContentSection id="skills" title="Skills">
      <dl className="space-y-2">
        {skills.map((group) => (
          <div key={group.category} className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="font-sans text-[11px] uppercase tracking-[0.12em] text-portfolio-brown/45 sm:w-52 shrink-0">
              {group.category}
            </dt>
            <dd className="font-body text-sm text-portfolio-brown/75">{group.items}</dd>
          </div>
        ))}
      </dl>
    </ContentSection>
  );
}
