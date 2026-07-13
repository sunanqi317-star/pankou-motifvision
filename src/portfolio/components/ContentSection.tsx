import type { ReactNode } from 'react';

interface ContentSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function ContentSection({ id, title, children }: ContentSectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="section-heading">{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  );
}
