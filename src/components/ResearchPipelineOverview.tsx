import { experienceCard } from './ui/experienceStyles';

const PIPELINE_STEPS = [
  {
    title: 'Choose a Pankou',
    sentence: 'Browse annotated heritage specimens and select your source object.',
    href: '#choose-pankou',
  },
  {
    title: 'Search by Motif',
    sentence: 'Find related specimens through cultural language and motif queries.',
    href: '#search-motif',
  },
  {
    title: 'Find Similar Forms',
    sentence: 'Compare visual structure and shared craft features across the corpus.',
    href: '#find-similar',
  },
  {
    title: 'Discover Cultural Relations',
    sentence: 'Explore motif, skeleton, and meaning connections as a relational graph.',
    href: '#cultural-relations',
  },
  {
    title: 'Read Cultural Meaning',
    sentence: 'Open an interpretation of pattern, structure, and symbolic reading.',
    href: '#cultural-meaning',
  },
  {
    title: 'Open AI Jewelry Studio',
    sentence: 'Transform interpretation into LoRA-guided jewelry design concepts.',
    href: '#jewelry-studio',
  },
] as const;

function StepArrow() {
  return (
    <div
      className="flex w-5 shrink-0 items-center justify-center self-center text-stone-300 lg:w-6"
      aria-hidden="true"
    >
      →
    </div>
  );
}

export function ResearchPipelineOverview({ embedded = false }: { embedded?: boolean }) {
  const content = (
    <>
      <div className="overflow-x-auto pb-1">
        <ol className="flex min-w-[920px] items-stretch lg:min-w-0">
          {PIPELINE_STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-1 items-stretch">
              <a
                href={step.href}
                className={`group flex flex-1 flex-col ${experienceCard} px-3 py-3 transition-all hover:shadow-md`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-900/30 font-mono text-[10px] text-[#2c2825]">
                    {i + 1}
                  </span>
                  <h3 className="text-xs font-semibold leading-snug text-[#2c2825]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-stone-600">{step.sentence}</p>
              </a>
              {i < PIPELINE_STEPS.length - 1 && <StepArrow />}
            </li>
          ))}
        </ol>
      </div>
      {!embedded && (
        <p className="mt-6 text-center text-xs text-stone-500">
          <a href="#choose-pankou" className="font-medium text-amber-950 hover:underline">
            Start the journey
          </a>
        </p>
      )}
    </>
  );

  if (embedded) return content;

  return (
    <section id="pipeline" className="scroll-mt-20 border-b border-stone-200/80 bg-[#f3efe8] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{content}</div>
    </section>
  );
}
