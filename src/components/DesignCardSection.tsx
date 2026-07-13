import { useDesignStudio } from '../context/DesignStudioContext';
import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import { ImagePlaceholder } from './ImagePlaceholder';
import { PortfolioSection } from './PortfolioSection';
import { experienceCard, experiencePanel } from './ui/experienceStyles';

export function DesignCardSection() {
  const { selectedSpecimen } = useSelectedSpecimen();
  const studio = useDesignStudio();

  if (!studio.concept) {
    return null;
  }

  const statement = studio.concept.designStatement || studio.designStatement;
  const culturalTags = [
    selectedSpecimen.motif,
    selectedSpecimen.classification.structuralSkeleton,
    selectedSpecimen.symbolicMeaning,
  ];

  return (
    <PortfolioSection
      id="design-card"
      title="Design Card"
      subtitle="Portfolio summary of your generated jewelry reinterpretation."
      tone="warm"
    >
      <article className={`${experiencePanel} overflow-hidden shadow-md`}>
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-stone-200/60 bg-white/60 p-6 lg:border-b-0 lg:border-r">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-900/70">
              Generated Jewelry
            </p>
            <div className="mt-4 flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-stone-200/80 bg-[#faf8f4] lg:min-h-[420px]">
              {studio.generatedImageUrl ? (
                <img
                  src={studio.generatedImageUrl}
                  alt={`Design card for ${selectedSpecimen.id}`}
                  className="h-full max-h-[420px] w-full object-contain p-6"
                />
              ) : (
                <div className="p-8 text-center">
                  <p className="text-base font-medium text-[#2c2825]">{studio.concept.designTitle}</p>
                  <p className="mt-2 text-sm text-stone-500">
                    Concept generated. Run image preview in the studio for a rendered result.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 p-6 lg:p-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Source Pankou</p>
              <div className="mt-3 flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <ImagePlaceholder
                    hue={selectedSpecimen.hue}
                    id={selectedSpecimen.id}
                    className="h-full w-full border-0"
                  />
                </div>
                <div>
                  <p className="font-mono text-xs text-stone-500">{selectedSpecimen.id}</p>
                  <p className="text-base font-medium text-[#2c2825]">{selectedSpecimen.chineseName}</p>
                  <p className="text-sm text-stone-600">{selectedSpecimen.englishName}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">Cultural Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {culturalTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stone-200/80 bg-[#faf8f4] px-2.5 py-1 text-xs text-stone-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <dl className="space-y-2 text-sm">
              {[
                ['Cultural Emphasis', studio.culturalEmphasis],
                ['Jewelry Type', studio.jewelryType],
                ['Material', studio.material],
                ['Color', studio.colorPalette],
                ['Design Style', studio.style],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[1fr_1.2fr] gap-3 border-b border-stone-100 pb-2">
                  <dt className="text-stone-400">{label}</dt>
                  <dd className="text-[#2c2825]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className={`${experienceCard} p-4`}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Design Statement</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-700 lg:text-base">{statement}</p>
            </div>
          </div>
        </div>
      </article>
    </PortfolioSection>
  );
}
