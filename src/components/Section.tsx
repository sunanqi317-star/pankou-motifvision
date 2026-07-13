import type { ReactNode } from 'react';
import { WORKFLOW_STEP_NARRATIVES, type WorkflowStepId } from '../data/workflowNarratives';
import {
  experienceEyebrow,
  experienceSectionAlt,
  experienceSubtitle,
  experienceTitle,
} from './ui/experienceStyles';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  workflowStep?: WorkflowStepId;
  variant?: 'default' | 'workflow' | 'experience';
  tone?: 'default' | 'muted' | 'warm';
  children: ReactNode;
}

export function Section({
  id,
  title,
  subtitle,
  eyebrow,
  workflowStep,
  variant = 'experience',
  tone = 'default',
  children,
}: SectionProps) {
  const narrative = workflowStep ? WORKFLOW_STEP_NARRATIVES[workflowStep] : null;
  const resolvedTitle = title ?? narrative?.title ?? '';
  const resolvedSubtitle = subtitle ?? narrative?.description;
  const resolvedEyebrow = eyebrow ?? (workflowStep ? `Step ${workflowStep}` : undefined);

  const isExperience = variant === 'experience' || variant === 'workflow';
  const bg =
    tone === 'warm' || (isExperience && workflowStep !== undefined && workflowStep % 2 === 0)
      ? experienceSectionAlt
      : isExperience
        ? 'bg-[#f7f4ef]'
        : tone === 'muted'
          ? 'bg-stone-50/60'
          : 'bg-white';

  return (
    <section id={id} className={`scroll-mt-20 border-b border-stone-200/80 py-16 md:py-20 ${bg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-10 max-w-2xl">
          {resolvedEyebrow && <p className={experienceEyebrow}>{resolvedEyebrow}</p>}
          <h2 className={experienceTitle}>{resolvedTitle}</h2>
          {resolvedSubtitle && <p className={experienceSubtitle}>{resolvedSubtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
