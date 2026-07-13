import type { ReactNode } from 'react';
import {
  experienceEyebrow,
  experienceSectionAlt,
  experienceSubtitle,
  experienceTitle,
  portfolioContainer,
  portfolioSection,
} from './ui/experienceStyles';

interface PortfolioSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  tone?: 'default' | 'warm';
  headerClassName?: string;
  children: ReactNode;
}

export function PortfolioSection({
  id,
  title,
  subtitle,
  eyebrow,
  tone = 'default',
  headerClassName = 'mb-10',
  children,
}: PortfolioSectionProps) {
  const bg = tone === 'warm' ? experienceSectionAlt : 'bg-[#f7f4ef]';

  return (
    <section id={id} className={`scroll-mt-20 border-b border-stone-200/80 ${portfolioSection} ${bg}`}>
      <div className={portfolioContainer}>
        {(title || subtitle || eyebrow) && (
          <header className={headerClassName}>
            {eyebrow && <p className={`${experienceEyebrow} mb-3`}>{eyebrow}</p>}
            {title && <h2 className={experienceTitle}>{title}</h2>}
            {subtitle && <p className={`${experienceSubtitle} mt-[18px]`}>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
