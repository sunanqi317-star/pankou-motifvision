import { useEffect, useState, type ReactNode } from 'react';
import {
  loadPk001CaseStudy,
  PK001_SPECIMEN,
  PK001_TEXT_QUERIES,
  type Pk001CaseStudyData,
} from '../data/pk001CaseStudy';
import { ImagePlaceholder } from './ImagePlaceholder';
import { experienceCard, experienceCardMuted } from './ui/experienceStyles';

function formatScore(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

function CaseTimelineItem({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <li className="relative pl-6">
      <span
        className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border border-amber-900/40 bg-white"
        aria-hidden="true"
      />
      <a href={href} className="group block">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-950/80 group-hover:text-amber-950">
          {label}
        </h3>
        <div className="mt-2">{children}</div>
      </a>
    </li>
  );
}

export function EndToEndCaseStudy({ embedded = false }: { embedded?: boolean }) {
  const [caseData, setCaseData] = useState<Pk001CaseStudyData | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadPk001CaseStudy().then((data) => {
      if (!cancelled) setCaseData(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const specimen = PK001_SPECIMEN;

  const content = (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
      <aside className={`${experienceCard} lg:sticky lg:top-24 lg:self-start`}>
        <div className="border-b border-stone-200/80 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
            Selected Specimen
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-stone-200/80">
            <ImagePlaceholder hue={specimen.hue} id={specimen.id} className="h-36 w-full border-0" />
          </div>
          <p className="mt-3 font-mono text-sm text-[#2c2825]">{specimen.id}</p>
          <p className="text-sm font-medium text-[#2c2825]">{specimen.chineseName}</p>
          <p className="text-sm text-stone-600">{specimen.englishName}</p>
        </div>
        <dl className="space-y-3 p-4 text-sm">
          {[
            ['Motif', specimen.motif],
            ['Structure', specimen.structure],
            ['Symbolic Meaning', specimen.symbolicMeaning],
            ['Emotional Tone', specimen.emotionalTone],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
                {label}
              </dt>
              <dd className="mt-0.5 text-[#2c2825]">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-stone-200/80 px-4 py-3">
          <a href="#choose-pankou" className="text-xs font-medium text-amber-950 hover:underline">
            Open in corpus viewer →
          </a>
        </div>
      </aside>

      <div>
        {!caseData ? (
          <p className={`${experienceCardMuted} p-4 text-center text-sm text-stone-600`}>
            Computing specimen outputs…
          </p>
        ) : (
          <ol className="space-y-7 border-l border-stone-200/80">
            <CaseTimelineItem label="Text Retrieval Queries" href="#search-motif">
              <div className="flex flex-wrap gap-2">
                {PK001_TEXT_QUERIES.map((query) => (
                  <span
                    key={query}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-700"
                  >
                    &quot;{query}&quot;
                  </span>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                {caseData.textRetrieval.map(({ query, topHits }) => (
                  <p key={query} className="text-xs text-stone-600">
                    <span className="font-mono text-[#2c2825]">&quot;{query}&quot;</span>
                    {' → '}
                    {topHits.map((hit) => `${hit.id} (${formatScore(hit.score)})`).join(', ')}
                  </p>
                ))}
              </div>
            </CaseTimelineItem>

            <CaseTimelineItem label="Top Similar Specimens" href="#find-similar">
              <ul className="space-y-1.5 text-sm text-stone-700">
                {caseData.similarSpecimens.map((hit, index) => (
                  <li key={hit.id} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-xs text-stone-400">{index + 1}.</span>
                    <span className="font-mono text-[#2c2825]">{hit.id}</span>
                    <span className="text-stone-600">{hit.name}</span>
                    <span className="font-mono text-xs text-stone-600">
                      {formatScore(hit.score)}
                    </span>
                  </li>
                ))}
              </ul>
            </CaseTimelineItem>

            <CaseTimelineItem label="Shared Visual Features" href="#find-similar">
              <div className="flex flex-wrap gap-1.5">
                {caseData.sharedFeatures.length > 0 ? (
                  caseData.sharedFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-xs text-stone-700"
                    >
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-stone-600">
                    Embedding proximity without discrete tag overlap
                  </span>
                )}
              </div>
            </CaseTimelineItem>

            <CaseTimelineItem label="Motif Affinity Path" href="#cultural-relations">
              <p className="text-sm leading-relaxed text-[#2c2825]">
                {caseData.affinityPath.join(' → ')}
              </p>
            </CaseTimelineItem>

            <CaseTimelineItem label="Cultural Interpretation" href="#cultural-meaning">
              <p className="line-clamp-4 text-sm leading-relaxed text-stone-700">
                {caseData.culturalInterpretation}
              </p>
            </CaseTimelineItem>

            <CaseTimelineItem label="LoRA Reinterpretation Output" href="#jewelry-studio">
              <div className={`${experienceCardMuted} space-y-3 p-3`}>
                <p className="text-sm font-medium text-[#2c2825]">
                  {caseData.reinterpretation.designTitle}
                </p>
                <p className="line-clamp-3 text-xs leading-relaxed text-stone-600">
                  {caseData.reinterpretation.culturalExcerpt}
                </p>
                <pre className="line-clamp-4 overflow-x-auto whitespace-pre-wrap rounded-lg border border-stone-200/80 bg-white p-2 font-mono text-[10px] leading-relaxed text-stone-700">
                  {caseData.reinterpretation.positivePrompt}
                </pre>
              </div>
            </CaseTimelineItem>
          </ol>
        )}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <section id="case-study" className="scroll-mt-20 border-b border-stone-200/80 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{content}</div>
    </section>
  );
}
