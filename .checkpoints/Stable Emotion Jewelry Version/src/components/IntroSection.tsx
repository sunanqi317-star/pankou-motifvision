import type { ReactNode } from 'react';
import { sectionEyebrow, sectionSubtitle, sectionTitle } from './ui/researchStyles';

interface IntroSectionProps {
  id: string;
  title: string;
  subtitle?: ReactNode;
  eyebrow?: string;
  tone?: 'default' | 'muted';
  compact?: boolean;
  children: ReactNode;
}

export function IntroSection({
  id,
  title,
  subtitle,
  eyebrow,
  tone = 'default',
  compact = false,
  children,
}: IntroSectionProps) {
  const bg = tone === 'muted' ? 'bg-stone-50/60' : 'bg-white';
  const padding = compact ? 'py-6 md:py-8' : 'py-14 md:py-16';

  return (
    <section
      id={id}
      className={`scroll-mt-20 border-b border-stone-200 ${bg} ${padding}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className={`max-w-3xl ${compact ? 'mb-6' : 'mb-10'}`}>
          {eyebrow && <p className={sectionEyebrow}>{eyebrow}</p>}
          <h2 id={`${id}-heading`} className={sectionTitle}>
            {title}
          </h2>
          {subtitle && <p className={sectionSubtitle}>{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
