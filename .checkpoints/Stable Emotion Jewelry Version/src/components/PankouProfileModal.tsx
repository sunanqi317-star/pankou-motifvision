import { useEffect, useMemo } from 'react';
import type { PankouItem } from '../types';
import {
  CULTURAL_EMPHASIS_OPTIONS,
  type CulturalEmphasis,
  getCulturalPathChips,
} from '../utils/culturalFramework';
import { ImagePlaceholder } from './ImagePlaceholder';

const METADATA_ROWS: { key: keyof PankouItem['classification']; label: string }[] = [
  { key: 'form', label: 'Form' },
  { key: 'craft', label: 'Craft' },
  { key: 'material', label: 'Material' },
  { key: 'color', label: 'Color' },
  { key: 'composition', label: 'Composition' },
  { key: 'motifSemantics', label: 'Motif Semantics' },
  { key: 'structuralSkeleton', label: 'Structural Skeleton' },
];

function modalCulturalReading(specimen: PankouItem, emphasis: CulturalEmphasis): string {
  return (
    `This ${specimen.motif.toLowerCase()} Pankou expresses ${specimen.symbolicMeaning.toLowerCase()} through a ${specimen.classification.structuralSkeleton.toLowerCase()} structure. ` +
    `As a Haipai fastening form, it offers a clear path from garment ornament to contemporary jewelry. ` +
    `With emphasis on ${emphasis.toLowerCase()}, the reading stays focused on wearable elegance rather than heavy documentation.`
  );
}

interface PankouProfileModalProps {
  specimen: PankouItem;
  isOpen: boolean;
  selectedCulturalEmphasis: CulturalEmphasis;
  isMetadataOpen: boolean;
  onClose: () => void;
  onEmphasisChange: (emphasis: CulturalEmphasis) => void;
  onMetadataToggle: (open: boolean) => void;
}

export function PankouProfileModal({
  specimen,
  isOpen,
  selectedCulturalEmphasis,
  isMetadataOpen,
  onClose,
  onEmphasisChange,
  onMetadataToggle,
}: PankouProfileModalProps) {
  const pathChips = useMemo(() => getCulturalPathChips(specimen), [specimen]);
  const culturalReading = useMemo(
    () => modalCulturalReading(specimen, selectedCulturalEmphasis),
    [specimen, selectedCulturalEmphasis],
  );

  const keyChips = [
    specimen.motif,
    specimen.classification.structuralSkeleton,
    specimen.symbolicMeaning,
  ];

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pankou-profile-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/28" aria-hidden />

      <div
        className="relative max-h-[90vh] w-full max-w-[1024px] overflow-y-auto rounded-[24px] bg-[#fdfbf7] p-8 shadow-[0_24px_64px_rgba(40,30,20,0.18)] md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/80 bg-white text-stone-500 transition-colors hover:border-stone-300 hover:text-stone-800"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 id="pankou-profile-title" className="mb-6 pr-10 text-lg font-semibold text-[#2c2825]">
          Pankou Profile
        </h2>

        <div className="grid gap-6 md:grid-cols-[32%_68%] md:gap-8">
          <div>
            <div className="overflow-hidden rounded-2xl bg-[#faf8f4]">
              <ImagePlaceholder hue={specimen.hue} id={specimen.id} className="aspect-square w-full border-0" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-mono text-xs text-stone-400">{specimen.id}</p>
              <p className="mt-1 text-xl font-medium text-[#2c2825]">{specimen.chineseName}</p>
              <p className="text-sm text-stone-600">{specimen.englishName}</p>
              {specimen.pankouTypeLabel && (
                <p className="mt-1 text-xs text-stone-500">{specimen.pankouTypeLabel}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keyChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-stone-200/80 bg-[#f5f1ea] px-2.5 py-1 text-[11px] text-stone-600"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-stone-400">Cultural Path</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {pathChips.map((chip, index) => (
                <div key={chip} className="flex items-center gap-1.5">
                  <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-[#2c2825]">
                    {chip}
                  </span>
                  {index < pathChips.length - 1 && <span className="text-xs text-stone-300">→</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-stone-400">Cultural Reading</p>
            <p className="text-sm leading-relaxed text-stone-700">{culturalReading}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-stone-600">Choose Cultural Emphasis</p>
            <div className="flex flex-wrap gap-2">
              {CULTURAL_EMPHASIS_OPTIONS.map((emphasis) => (
                <button
                  key={emphasis}
                  type="button"
                  onClick={() => onEmphasisChange(emphasis)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                    selectedCulturalEmphasis === emphasis
                      ? 'bg-amber-900/90 text-[#faf8f4]'
                      : 'border border-stone-200 bg-white text-stone-600 hover:border-amber-800/30'
                  }`}
                >
                  {emphasis}
                </button>
              ))}
            </div>
          </div>

          <details
            open={isMetadataOpen}
            onToggle={(e) => onMetadataToggle((e.target as HTMLDetailsElement).open)}
            className="rounded-xl border border-stone-200/80 bg-[#faf8f4]"
          >
            <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-stone-600">
              View Seven-Dimension Metadata
            </summary>
            <div className="overflow-x-auto border-t border-stone-200/80">
              <table className="w-full min-w-[400px] text-xs">
                <tbody>
                  {METADATA_ROWS.map(({ key, label }) => (
                    <tr key={key} className="border-b border-stone-100 last:border-0">
                      <th className="w-[38%] px-4 py-2 text-left font-normal text-stone-400">{label}</th>
                      <td className="px-4 py-2 text-[#2c2825]">{specimen.classification[key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
