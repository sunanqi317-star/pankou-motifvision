import { workflowSteps } from '../data/pankouData';
import { experienceCardMuted } from './ui/experienceStyles';

export function MethodologyContent() {
  return (
    <div className="space-y-6">
      <div className={`${experienceCardMuted} overflow-x-auto p-4`}>
        <div className="flex min-w-[720px] items-center justify-between gap-1">
          {workflowSteps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-900/30 bg-white font-mono text-xs text-[#2c2825]">
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
      <p className="text-sm leading-relaxed text-stone-600">
        The pipeline separates corpus construction and annotation from embedding-based retrieval,
        relational visualization, interpretive reporting, and generative prompt synthesis. A single
        selected specimen propagates metadata across later stages without re-annotation.
      </p>
    </div>
  );
}
