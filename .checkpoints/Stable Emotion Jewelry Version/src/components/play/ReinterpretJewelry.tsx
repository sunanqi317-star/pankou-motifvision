import { useMemo, useState } from 'react';
import { usePlaySession } from '../../context/PlaySessionContext';
import {
  DEFAULT_NEGATIVE_PROMPT,
  DESIGN_DIRECTIONS,
  generateJewelryConcept,
  JEWELRY_FORMS,
  MATERIAL_STRATEGIES,
  STRUCTURE_STRATEGIES,
} from '../../utils/loraJewelry';
import type { JewelryConceptOptions, LoRAJewelrySettings, PankouItem } from '../../types';
import { craftBadge, craftButton, craftButtonSecondary, craftCard, craftPanel } from '../ui/craftStyles';

function toPankouItem(specimen: NonNullable<ReturnType<typeof usePlaySession>['selectedSpecimen']>): PankouItem {
  return {
    id: specimen.id,
    chineseName: specimen.chineseName,
    englishName: specimen.englishName,
    pankouType: 'butterfly',
    pankouTypeLabel: '蝴蝶扣 / Butterfly Pankou',
    classification: {
      form: 'Coiled loop',
      craft: 'Silk wrapping',
      material: 'Silk cord',
      color: 'Ivory',
      composition: 'Bilateral symmetric',
      motifSemantics: specimen.symbolicMeaning,
      structuralSkeleton: specimen.skeletonType,
    },
    visualFeatures: ['bilateral symmetry', 'curved contour'],
    culturalKeywords: [specimen.motif.toLowerCase(), specimen.symbolicMeaning.toLowerCase()],
    recommendedJewelryForms: ['Brooch', 'Pendant Necklace'],
    generationPromptKeywords: [specimen.motif.toLowerCase(), 'haipai pankou'],
    negativePromptHints: ['human body', 'face'],
    relatedSpecimenIds: [],
    motif: specimen.motif,
    structure: specimen.skeletonType,
    craft: 'Silk wrapping',
    symbolicMeaning: specimen.symbolicMeaning,
    emotionalTone: specimen.emotionalTone,
    pathOrganization: specimen.pathOrganization,
    nodeDensity: 'Medium node density',
    constraintPattern: 'Axial symmetry',
    skeletonType: specimen.skeletonType,
    representativeType: specimen.englishName,
    hue: specimen.hue,
    searchText: `${specimen.englishName} ${specimen.motif} ${specimen.symbolicMeaning}`,
    features: [],
    cluster: 'Play Mode',
  };
}

const DEFAULT_SETTINGS: LoRAJewelrySettings = {
  triggerWords: 'pankou, chinese knot, structure-constrained jewelry',
  loraWeight: 0.75,
  imageSize: '768x768',
  cfgScale: 7,
  steps: 30,
  negativePrompt: DEFAULT_NEGATIVE_PROMPT,
};

export function ReinterpretJewelry() {
  const { selectedSpecimen, canAccessReinterpret, setStep, markStepComplete } = usePlaySession();

  const [options, setOptions] = useState<JewelryConceptOptions>({
    jewelryType: JEWELRY_FORMS[0],
    material: MATERIAL_STRATEGIES[0],
    style: DESIGN_DIRECTIONS[1],
    emotion: '',
    structureStrategy: STRUCTURE_STRATEGIES[0],
  });

  const [generated, setGenerated] = useState(false);

  const concept = useMemo(() => {
    if (!selectedSpecimen || !generated) return null;
    const item = toPankouItem(selectedSpecimen);
    return generateJewelryConcept(item, {
      ...options,
      emotion: selectedSpecimen.emotionalTone,
    }, DEFAULT_SETTINGS);
  }, [selectedSpecimen, options, generated]);

  if (!selectedSpecimen) {
    return (
      <p className="text-stone-600">
        Please choose a Pankou first.{' '}
        <button type="button" className="text-amber-700 underline" onClick={() => setStep('choose')}>
          Go back
        </button>
      </p>
    );
  }

  if (!canAccessReinterpret) {
    return (
      <div className={`${craftCard} p-8 text-center`}>
        <span className="text-4xl" aria-hidden>
          🔒
        </span>
        <h2 className="mt-4 text-xl font-bold text-stone-900">Module locked</h2>
        <p className="mt-2 text-stone-600">
          Complete deconstruction, assembly evaluation, and meaning matching to unlock
          human-AI reinterpretation.
        </p>
        <button type="button" className={`${craftButton} mt-6`} onClick={() => setStep('deconstruct')}>
          Return to learning tasks
        </button>
      </div>
    );
  }

  const handleGenerate = () => {
    setGenerated(true);
    markStepComplete('reinterpret');
  };

  const handleContinue = () => setStep('reflection');

  const copyPrompt = () => {
    if (!concept) return;
    void navigator.clipboard.writeText(concept.positivePrompt);
  };

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Reinterpret as Jewelry</h2>
        <p className="mt-1 text-stone-600">
          Transform craft knowledge into a jewelry concept. Emotional tone is inherited from{' '}
          <strong>{selectedSpecimen.englishName}</strong>: {selectedSpecimen.emotionalTone}.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${craftCard} space-y-4 p-6`}>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Jewelry form</label>
            <select
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              value={options.jewelryType}
              onChange={(e) => setOptions((o) => ({ ...o, jewelryType: e.target.value }))}
            >
              {JEWELRY_FORMS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Material strategy
            </label>
            <select
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              value={options.material}
              onChange={(e) => setOptions((o) => ({ ...o, material: e.target.value }))}
            >
              {MATERIAL_STRATEGIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Design direction
            </label>
            <select
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              value={options.style}
              onChange={(e) => setOptions((o) => ({ ...o, style: e.target.value }))}
            >
              {DESIGN_DIRECTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Structure strategy
            </label>
            <select
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              value={options.structureStrategy}
              onChange={(e) => setOptions((o) => ({ ...o, structureStrategy: e.target.value }))}
            >
              {STRUCTURE_STRATEGIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={craftPanel}>
            <p className="text-xs text-stone-500">Inherited emotional tone</p>
            <p className="font-medium text-amber-900">{selectedSpecimen.emotionalTone}</p>
          </div>

          <button type="button" className={craftButton} onClick={handleGenerate}>
            Generate Jewelry Concept
          </button>
        </div>

        <div className="space-y-4">
          {concept ? (
            <>
              <div className={`${craftCard} p-6`}>
                <span className={craftBadge}>Concept</span>
                <h3 className="mt-2 text-lg font-bold text-stone-900">{concept.designTitle}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-700">
                  {concept.culturalInterpretation}
                </p>
              </div>
              <div className={`${craftCard} p-5`}>
                <h4 className="text-sm font-semibold text-stone-800">
                  Skeleton-based transformation
                </h4>
                <p className="mt-2 text-sm text-stone-600">{concept.skeletonBasedTransformation}</p>
              </div>
              <div className={`${craftCard} p-5`}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-stone-800">LoRA-ready prompt</h4>
                  <button type="button" className={craftButtonSecondary} onClick={copyPrompt}>
                    Copy
                  </button>
                </div>
                <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-stone-100 p-3 text-xs text-stone-700 whitespace-pre-wrap">
                  {concept.positivePrompt}
                </pre>
              </div>
              <button type="button" className={craftButton} onClick={handleContinue}>
                Reflect on Learning →
              </button>
            </>
          ) : (
            <div className={`${craftCard} flex min-h-[280px] items-center justify-center p-8 text-center text-sm text-stone-500`}>
              Configure options and generate a research-oriented jewelry concept—not a commercial
              product render.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
