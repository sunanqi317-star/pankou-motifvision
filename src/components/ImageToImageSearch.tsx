import { useEffect, useState } from 'react';
import { pankouItems } from '../data/pankouData';
import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import type { PankouItem, SimilarityResult } from '../types';
import { explainSimilarity, findSimilarImages, getSimilarityInterpretation } from '../utils/search';
import { getSkeletonLabel } from '../utils/specimen';
import { ImagePlaceholder } from './ImagePlaceholder';
import { WorkflowSubsection } from './WorkflowSubsection';
import { card, panel, technicalNote } from './ui/researchStyles';

function QuerySpecimenPanel() {
  const { selectedSpecimen, setSelectedSpecimen } = useSelectedSpecimen();

  return (
    <aside className={`${panel} p-4`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Query Image</p>
      <div className="mt-3 overflow-hidden rounded border border-stone-200 bg-white">
        <div className="h-40">
          <ImagePlaceholder
            hue={selectedSpecimen.hue}
            id={selectedSpecimen.id}
            className="h-full w-full"
          />
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-xs">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Object ID
          </dt>
          <dd className="mt-0.5 font-mono text-slate-800">{selectedSpecimen.id}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Chinese Name
          </dt>
          <dd className="mt-0.5 text-slate-800">{selectedSpecimen.chineseName}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            English Name
          </dt>
          <dd className="mt-0.5 text-stone-700">{selectedSpecimen.englishName}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-400">Motif</dt>
          <dd className="mt-0.5 text-slate-800">{selectedSpecimen.motif}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Structure
          </dt>
          <dd className="mt-0.5 text-slate-800">{selectedSpecimen.structure}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Skeleton
          </dt>
          <dd className="mt-0.5 text-slate-800">{getSkeletonLabel(selectedSpecimen)}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Symbolic Meaning
          </dt>
          <dd className="mt-0.5 text-slate-800">{selectedSpecimen.symbolicMeaning}</dd>
        </div>
      </dl>
      <div className="mt-4 border-t border-stone-200 pt-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
          Quick Select
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pankouItems.slice(0, 8).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSpecimen(item)}
              className={`rounded border px-2 py-1 font-mono text-[10px] transition-colors ${
                selectedSpecimen.id === item.id
                  ? 'border-slate-600 bg-slate-800 text-white'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
            >
              {item.id}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SimilarityResultRow({
  result,
  rank,
  source,
  selected,
  onSelect,
}: {
  result: SimilarityResult;
  rank: number;
  source: PankouItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const { item, score, sharedFeatures } = result;
  const interpretation = getSimilarityInterpretation(source, item, sharedFeatures, score);

  return (
    <article
      className={`rounded border bg-white p-4 transition-colors ${
        selected ? 'border-slate-500 ring-1 ring-slate-400/30' : 'border-stone-200'
      }`}
    >
      <div className="flex gap-4">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] text-white">
            {rank}
          </span>
          <div className="h-16 w-16 overflow-hidden rounded border border-stone-200">
            <ImagePlaceholder hue={item.hue} id={item.id} className="h-full w-full" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-xs text-stone-500">{item.id}</p>
              <p className="text-sm font-medium text-slate-800">{item.chineseName}</p>
              <p className="text-xs text-stone-600">{item.englishName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
                Similarity
              </p>
              <p className="font-mono text-lg text-slate-800">{(score * 100).toFixed(1)}%</p>
            </div>
          </div>
          {sharedFeatures.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
                Shared Visual Features
              </p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {sharedFeatures.map((f) => (
                  <li
                    key={f}
                    className="rounded bg-stone-100 px-2 py-0.5 text-[10px] text-stone-700"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-stone-600">
            <span className="font-medium text-stone-500">Interpretation:</span>{' '}
            {interpretation}
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-stone-400">{explainSimilarity(sharedFeatures)}</p>
          <button
            type="button"
            onClick={onSelect}
            className="mt-3 text-xs text-slate-600 underline hover:text-slate-900"
          >
            Set as query specimen
          </button>
        </div>
      </div>
    </article>
  );
}

export function ImageToImageSearch() {
  const { selectedSpecimen, setSelectedSpecimen } = useSelectedSpecimen();
  const [similar, setSimilar] = useState<SimilarityResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    findSimilarImages(selectedSpecimen, pankouItems, 5).then((results) => {
      if (!cancelled) {
        setSimilar(results);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSpecimen]);

  return (
    <WorkflowSubsection>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <QuerySpecimenPanel />

        <div className={card}>
          <div className="border-b border-stone-200 bg-stone-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Retrieval Results
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Top 5 similar specimens ranked by mock ViT/CLIP-style embedding proximity and metadata
              affinity relative to query{' '}
              <span className="font-mono text-slate-700">{selectedSpecimen.id}</span>.
            </p>
          </div>

          <div className="space-y-3 p-4" aria-live="polite">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded border border-stone-100 bg-stone-50 p-4"
                >
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded bg-stone-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 rounded bg-stone-200" />
                      <div className="h-4 w-40 rounded bg-stone-200" />
                      <div className="h-3 w-full rounded bg-stone-100" />
                    </div>
                  </div>
                </div>
              ))}

            {!loading &&
              similar.map((r, i) => (
                <SimilarityResultRow
                  key={r.item.id}
                  result={r}
                  rank={i + 1}
                  source={selectedSpecimen}
                  selected={selectedSpecimen.id === r.item.id}
                  onSelect={() => setSelectedSpecimen(r.item)}
                />
              ))}
          </div>
        </div>
      </div>

      <p className={`mt-6 ${technicalNote}`}>
        <span className="font-semibold text-slate-700">Technical note:</span> This section currently
        uses mock similarity scores to simulate visual transformer-based image retrieval. Future
        versions can integrate CLIP ViT-B/32 or DINOv2 embeddings.
      </p>
    </WorkflowSubsection>
  );
}
