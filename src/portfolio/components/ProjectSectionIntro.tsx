import type { ReactNode } from 'react';

export function ProjectSectionIntro({ children }: { children: ReactNode }) {
  return <p className="project-section-intro">{children}</p>;
}
