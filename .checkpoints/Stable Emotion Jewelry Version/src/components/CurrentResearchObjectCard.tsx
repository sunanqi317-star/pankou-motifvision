import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import { PIPELINE_STAGE_LABELS, type PipelineStageIndex } from '../utils/specimen';
import { card } from './ui/researchStyles';

interface CurrentResearchObjectCardProps {
  /** Highlight the active stage in the pipeline path (1 to 6). */
  activeStage?: PipelineStageIndex;
  className?: string;
}

export function CurrentResearchObjectCard({
  activeStage,
  className = '',
}: CurrentResearchObjectCardProps) {
  const { selectedSpecimen } = useSelectedSpecimen();

  return (
    <aside
      className={`${card} ${className}`}
      aria-label="Current research object summary"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-stone-100 px-4 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">
          Current Research Object
        </p>
        <p className="font-mono text-xs text-slate-800">{selectedSpecimen.id}</p>
        <p className="text-sm text-slate-800">
          {selectedSpecimen.chineseName}
          <span className="text-stone-400"> · </span>
          <span className="text-stone-600">{selectedSpecimen.englishName}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-xs text-stone-600">
        <span>
          <span className="text-stone-400">Motif</span>{' '}
          <span className="text-slate-800">{selectedSpecimen.motif}</span>
        </span>
        <span className="hidden text-stone-200 sm:inline" aria-hidden="true">
          |
        </span>
        <span>
          <span className="text-stone-400">Structure</span>{' '}
          <span className="text-slate-800">{selectedSpecimen.structure}</span>
        </span>
        <span className="hidden text-stone-200 sm:inline" aria-hidden="true">
          |
        </span>
        <span>
          <span className="text-stone-400">Symbolic</span>{' '}
          <span className="text-slate-800">{selectedSpecimen.symbolicMeaning}</span>
        </span>
      </div>

      <div className="border-t border-stone-100 px-4 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
          Current Pipeline Path
        </p>
        <ol className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] text-stone-500">
          {PIPELINE_STAGE_LABELS.map((stage, i) => {
            const stageNumber = (i + 1) as PipelineStageIndex;
            const isActive = activeStage === stageNumber;
            return (
              <li key={stage} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="text-stone-300" aria-hidden="true">
                    →
                  </span>
                )}
                <span
                  className={
                    isActive
                      ? 'rounded bg-slate-700 px-1.5 py-0.5 font-medium text-white'
                      : 'text-stone-500'
                  }
                >
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

export function CurrentResearchObjectBanner() {
  return (
    <section
      id="research-object"
      className="sticky top-14 z-40 scroll-mt-20 border-b border-stone-200 bg-white/95 py-3 backdrop-blur-sm md:py-4"
      aria-label="Current research object status"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-2 text-xs text-stone-500">
          Selected specimen driving the pipeline below. Browse and change selection in Step 1.
        </p>
        <CurrentResearchObjectCard />
      </div>
    </section>
  );
}
