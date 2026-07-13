import type { PankouItem } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { experienceCard } from './ui/experienceStyles';

interface MetadataModalProps {
  item: PankouItem | null;
  onClose: () => void;
}

const CLASSIFICATION_LABELS: { key: keyof PankouItem['classification']; label: string }[] = [
  { key: 'form', label: 'Form' },
  { key: 'craft', label: 'Craft' },
  { key: 'material', label: 'Material' },
  { key: 'color', label: 'Color' },
  { key: 'composition', label: 'Composition' },
  { key: 'motifSemantics', label: 'Motif Semantics' },
  { key: 'structuralSkeleton', label: 'Structural Skeleton' },
];

export function MetadataModal({ item, onClose }: MetadataModalProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="metadata-title"
    >
      <div
        className={`max-h-[90vh] w-full max-w-lg overflow-y-auto ${experienceCard} shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200/80 px-5 py-4">
          <h3 id="metadata-title" className="text-lg text-[#2c2825]">
            Specimen Detail
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs text-stone-500 hover:bg-stone-100"
            aria-label="Close"
          >
            Close
          </button>
        </div>
        <div className="p-5">
          <div className="mb-4 h-48 overflow-hidden rounded-xl">
            <ImagePlaceholder hue={item.hue} id={item.id} className="h-full w-full border-0" />
          </div>

          <dl className="space-y-2 text-sm">
            {[
              ['Object ID', item.id],
              ['Chinese Name', item.chineseName],
              ['English Name', item.englishName],
              ['Pankou Type', item.pankouTypeLabel],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-3 gap-2 border-b border-stone-100 pb-2">
                <dt className="text-stone-500">{label}</dt>
                <dd className="col-span-2 text-[#2c2825]">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-900/70">
              Seven Classification Dimensions
            </p>
            <dl className="mt-2 space-y-2 text-sm">
              {CLASSIFICATION_LABELS.map(({ key, label }) => (
                <div key={key} className="grid grid-cols-3 gap-2 border-b border-stone-100 pb-2">
                  <dt className="text-stone-500">{label}</dt>
                  <dd className="col-span-2 text-[#2c2825]">{item.classification[key]}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-stone-500">Visual Features</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {item.visualFeatures.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-[#faf8f4] px-2 py-0.5 text-[10px] text-stone-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500">Cultural Keywords</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {item.culturalKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-stone-200 px-2 py-0.5 text-[10px] text-stone-600"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-stone-500">Recommended Jewelry Forms</p>
            <p className="mt-1 text-sm text-stone-700">{item.recommendedJewelryForms.join(' · ')}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-stone-500">Generation Prompt Keywords</p>
            <p className="mt-1 text-xs text-stone-600">{item.generationPromptKeywords.join(', ')}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-stone-500">Negative Prompt Hints</p>
            <p className="mt-1 text-xs text-stone-600">{item.negativePromptHints.join(', ')}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-stone-500">Related Specimens</p>
            <p className="mt-1 font-mono text-xs text-stone-700">
              {item.relatedSpecimenIds.length > 0
                ? item.relatedSpecimenIds.join(', ')
                : 'None listed'}
            </p>
          </div>

          <dl className="mt-5 space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-600">
            <div className="grid grid-cols-3 gap-2">
              <dt>Emotional Tone</dt>
              <dd className="col-span-2">{item.emotionalTone}</dd>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <dt>Cluster</dt>
              <dd className="col-span-2">{item.cluster}</dd>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <dt>Path Organization</dt>
              <dd className="col-span-2">{item.pathOrganization}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
