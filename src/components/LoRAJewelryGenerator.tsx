import { useDesignStudio } from '../context/DesignStudioContext';
import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import { STRUCTURE_PRESERVATION_LEVELS } from '../utils/culturalFramework';
import {
  COLOR_PALETTES,
  DESIGN_DIRECTIONS,
  JEWELRY_FORMS,
  MATERIAL_STRATEGIES,
  VARIATION_PRESETS,
  type VariationPreset,
} from '../utils/loraJewelry';
import { ImagePlaceholder } from './ImagePlaceholder';
import { PortfolioSection } from './PortfolioSection';
import { ChipGroup } from './ui/ChipGroup';
import {
  btnExperiencePrimary,
  btnExperienceSecondary,
  experienceCard,
  experienceInput,
  experienceSelect,
  portfolioPreviewFrame,
} from './ui/experienceStyles';

const IMAGE_SIZES = ['768x768', '1024x1024', '1024x1536'] as const;

export function LoRAJewelryGenerator() {
  const studio = useDesignStudio();
  const { selectedSpecimen } = useSelectedSpecimen();

  return (
    <PortfolioSection
      id="jewelry-studio"
      eyebrow="Application Layer"
      title="AI Jewelry Studio"
      subtitle="LoRA-based generative design from cultural profile and structure constraints."
    >
      <div className="space-y-8">
        <div className={`${experienceCard} flex flex-col gap-4 p-4 sm:flex-row sm:items-center lg:p-5`}>
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
            <ImagePlaceholder
              hue={selectedSpecimen.hue}
              id={selectedSpecimen.id}
              className="h-full w-full border-0"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Selected Source</p>
            <p className="font-mono text-xs text-stone-500">{selectedSpecimen.id}</p>
            <p className="text-base font-medium text-[#2c2825]">{selectedSpecimen.chineseName}</p>
            <p className="text-sm text-stone-600">{selectedSpecimen.englishName}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {[selectedSpecimen.motif, selectedSpecimen.symbolicMeaning, studio.culturalEmphasis].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-stone-200/80 bg-[#faf8f4] px-2.5 py-1 text-[11px] text-stone-600"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChipGroup
            label="Jewelry Type"
            options={JEWELRY_FORMS}
            value={studio.jewelryType}
            onChange={studio.setJewelryType}
          />
          <ChipGroup
            label="Material Style"
            options={MATERIAL_STRATEGIES}
            value={studio.material}
            onChange={studio.setMaterial}
          />
          <ChipGroup
            label="Color Style"
            options={COLOR_PALETTES}
            value={studio.colorPalette}
            onChange={studio.setColorPalette}
          />
          <ChipGroup
            label="Design Style"
            options={DESIGN_DIRECTIONS}
            value={studio.style}
            onChange={studio.setStyle}
          />
        </div>

        <div className={`${experienceCard} p-4 lg:p-5`}>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-stone-600">Structure Preservation</span>
            <span className="text-stone-500">{studio.preservationLabel}</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={studio.structurePreservationLevel}
            onChange={(e) => studio.setStructurePreservationLevel(Number(e.target.value))}
            className="w-full accent-amber-900"
          />
          <div className="mt-1 flex justify-between text-[10px] text-stone-400">
            {STRUCTURE_PRESERVATION_LEVELS.map((level) => (
              <span key={level.level}>{level.level}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-stone-600">Generation Direction</p>
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(VARIATION_PRESETS) as VariationPreset[]).map((key) => {
              const preset = VARIATION_PRESETS[key];
              const active = studio.variation === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => studio.setVariation(key)}
                  className={`${experienceCard} p-4 text-left transition-all ${
                    active ? 'border-amber-900/35 bg-[#faf8f4]' : 'hover:border-amber-900/20'
                  }`}
                >
                  <p className="text-sm font-medium text-[#2c2825]">{preset.label}</p>
                  <p className="mt-1 text-[11px] text-stone-500">{preset.style}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-stone-600">Generated Jewelry Preview</p>
          <div className={portfolioPreviewFrame}>
            {studio.generatedImageUrl ? (
              <img
                src={studio.generatedImageUrl}
                alt="Generated jewelry preview"
                className="h-full max-h-[480px] w-full object-contain p-8"
              />
            ) : studio.concept ? (
              <div className="max-w-lg px-8 text-center">
                <p className="text-lg font-medium text-[#2c2825]">{studio.concept.designTitle}</p>
                <p className="mt-2 text-sm text-stone-500">
                  Concept ready. Generate an image preview or review the prompt below.
                </p>
              </div>
            ) : (
              <div className="px-8 text-center">
                <p className="text-sm font-medium text-stone-500">Preview will appear here</p>
                <p className="mt-1 text-xs text-stone-400">
                  Configure design controls, then generate with LoRA
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-stone-600">Prompt Preview</p>
            <button
              type="button"
              onClick={() => void studio.copyPrompt()}
              className={`${btnExperienceSecondary} px-3 py-1.5 text-xs`}
            >
              {studio.copyStatus === 'copied' ? 'Copied' : 'Copy Prompt'}
            </button>
          </div>
          <pre className={`${experienceCard} max-h-48 overflow-y-auto whitespace-pre-wrap p-4 font-mono text-[10px] leading-relaxed text-stone-700 lg:text-xs`}>
            {studio.concept?.positivePrompt ?? studio.livePrompt}
          </pre>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={studio.generateConcept}
            disabled={studio.isGeneratingConcept}
            className={`${btnExperiencePrimary} flex-1`}
          >
            {studio.isGeneratingConcept ? 'Generating...' : 'Generate with LoRA'}
          </button>
          {studio.concept && (
            <button
              type="button"
              onClick={() => void studio.generateImage()}
              disabled={studio.isGeneratingConcept || studio.cloudStatus === 'generating'}
              className={`${btnExperienceSecondary} flex-1`}
            >
              {studio.cloudStatus === 'generating' ? 'Rendering...' : 'Generate Image Preview'}
            </button>
          )}
        </div>

        {studio.cloudError && <p className="text-xs text-red-800/80">{studio.cloudError}</p>}

        <details className={`${experienceCard} overflow-hidden`}>
          <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-stone-600 lg:text-sm">
            Advanced LoRA Settings
          </summary>
          <div className="space-y-3 border-t border-stone-100 px-4 py-4 text-xs lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            <label className="block lg:col-span-2">
              <span className="mb-1 block text-stone-500">LoRA Trigger Words</span>
              <input
                type="text"
                value={studio.triggerWords}
                onChange={(e) => studio.setTriggerWords(e.target.value)}
                className={experienceInput}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1 flex justify-between text-stone-500">
                <span>LoRA Strength</span>
                <span className="font-mono">{studio.loraWeight.toFixed(1)}</span>
              </span>
              <input
                type="range"
                min={0.3}
                max={1.2}
                step={0.1}
                value={studio.loraWeight}
                onChange={(e) => studio.setLoraWeight(Number(e.target.value))}
                className="w-full accent-amber-900"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-stone-500">Image Size</span>
              <select
                value={studio.imageSize}
                onChange={(e) => studio.setImageSize(e.target.value)}
                className={experienceSelect}
              >
                {IMAGE_SIZES.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-stone-500">Sampler</span>
              <input
                type="text"
                value={studio.sampler}
                onChange={(e) => studio.setSampler(e.target.value)}
                className={experienceInput}
              />
            </label>
            <label className="block">
              <span className="mb-1 flex justify-between text-stone-500">
                <span>CFG Scale</span>
                <span className="font-mono">{studio.cfgScale}</span>
              </span>
              <input
                type="range"
                min={4}
                max={12}
                step={1}
                value={studio.cfgScale}
                onChange={(e) => studio.setCfgScale(Number(e.target.value))}
                className="w-full accent-amber-900"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex justify-between text-stone-500">
                <span>Steps</span>
                <span className="font-mono">{studio.steps}</span>
              </span>
              <input
                type="range"
                min={20}
                max={40}
                step={1}
                value={studio.steps}
                onChange={(e) => studio.setSteps(Number(e.target.value))}
                className="w-full accent-amber-900"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-stone-500">Seed</span>
              <input
                type="text"
                value={studio.seed}
                onChange={(e) => studio.setSeed(e.target.value)}
                className={experienceInput}
                placeholder="-1 for random"
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1 block text-stone-500">Negative Prompt</span>
              <textarea
                value={studio.negativePrompt}
                onChange={(e) => studio.setNegativePrompt(e.target.value)}
                rows={3}
                className={`${experienceInput} resize-y text-[11px]`}
              />
            </label>
          </div>
        </details>
      </div>
    </PortfolioSection>
  );
}
