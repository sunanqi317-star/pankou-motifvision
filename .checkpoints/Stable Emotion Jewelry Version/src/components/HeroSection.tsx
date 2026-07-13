import { btnExperiencePrimary, portfolioContainer, portfolioSection } from './ui/experienceStyles';

export function HeroSection() {
  return (
    <section
      id="start"
      className={`scroll-mt-20 border-b border-stone-200/80 bg-gradient-to-b from-[#faf6ef] via-[#f7f4ef] to-[#f3efe8] ${portfolioSection}`}
    >
      <div className={portfolioContainer}>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-900/75">
          Interactive Cultural AI Prototype
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#2c2825] md:text-4xl lg:text-[2.75rem]">
          Pankou MotifVision
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-700 md:text-lg">
          From Cultural Gene to Generative Design: a digital framework for interpreting and
          recreating Haipai Pankou heritage as AI jewelry.
        </p>
        <a href="#cultural-gene-source" className={`${btnExperiencePrimary} mt-8 inline-block`}>
          Begin with Cultural Gene Source
        </a>
      </div>
    </section>
  );
}
