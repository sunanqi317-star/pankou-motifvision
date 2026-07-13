import { portfolioContainer } from './ui/experienceStyles';

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-[#f3efe8] py-12 lg:py-16">
      <div className={`${portfolioContainer} text-center`}>
        <p className="text-sm font-medium text-[#2c2825] lg:text-base">Pankou MotifVision</p>
        <p className="mt-1 text-xs text-stone-600 lg:text-sm">
          From Cultural Gene to Generative Design · Haipai Pankou heritage to LoRA jewelry
        </p>
      </div>
    </footer>
  );
}
