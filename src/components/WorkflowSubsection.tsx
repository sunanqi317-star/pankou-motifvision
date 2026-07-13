import type { ReactNode } from 'react';
import { experienceCard } from './ui/experienceStyles';

interface WorkflowSubsectionProps {
  id?: string;
  children: ReactNode;
}

export function WorkflowSubsection({ id, children }: WorkflowSubsectionProps) {
  return (
    <article id={id} className={`scroll-mt-20 ${experienceCard} p-6 md:p-8`}>
      {children}
    </article>
  );
}
