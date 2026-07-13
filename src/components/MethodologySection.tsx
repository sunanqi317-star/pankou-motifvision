import { workflowSteps } from '../data/pankouData';
import { Section } from './Section';

export function MethodologySection() {
  return (
    <Section
      id="methodology"
      title="Methodology"
      subtitle="Computational pipeline architecture underlying the six-stage research demonstrator, from image collection through cultural interpretation."
    >
      <div className="overflow-x-auto">
        <div className="flex min-w-[720px] items-center justify-between gap-1">
          {workflowSteps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-700 bg-white font-mono text-xs text-slate-800">
                  {i + 1}
                </div>
                <p className="mt-2 max-w-[90px] text-[10px] leading-tight text-stone-600 sm:text-xs">
                  {step}
                </p>
              </div>
              {i < workflowSteps.length - 1 && (
                <div className="mx-1 h-px flex-1 bg-stone-300" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-4 text-sm leading-relaxed text-stone-600">
        <p>
          The methodology separates corpus construction, skeleton-based structural classification, and
          annotation from embedding-based retrieval,
          relational visualization, interpretive report generation, and generative prompt synthesis.
          Each stage consumes outputs from the prior stage while maintaining explicit data
          provenance to the annotated Pankou record.
        </p>
        <p>
          Global specimen selection propagates motif class and metadata across Steps 3 to 6, enabling
          consistent cross-stage analysis without re-annotation. This design reflects a common
          digital humanities workflow in which a single object record anchors multiple analytical
          perspectives.
        </p>
      </div>
    </Section>
  );
}
