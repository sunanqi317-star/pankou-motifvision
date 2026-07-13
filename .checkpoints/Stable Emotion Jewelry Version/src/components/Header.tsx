import { portfolioContainer } from './ui/experienceStyles';

const NAV = [
  { href: '#start', label: 'Start' },
  { href: '#cultural-gene-source', label: 'Source' },
  { href: '#make-pankou', label: 'Craft' },
  { href: '#jewelry-studio', label: 'Studio' },
  { href: '#design-card', label: 'Card' },
  { href: '#behind-system', label: 'System' },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#f7f4ef]/95 backdrop-blur-md">
      <div className={`${portfolioContainer} flex items-center justify-between gap-4 py-3 lg:py-4`}>
        <a href="#start" className="min-w-0 shrink-0">
          <span className="block truncate text-sm font-semibold text-[#2c2825] lg:text-base">
            Pankou MotifVision
          </span>
          <span className="hidden text-xs text-stone-500 md:block">
            Cultural Gene to Generative Design
          </span>
        </a>
        <nav
          className="flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Main navigation"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] text-stone-600 transition-colors hover:bg-white/80 hover:text-amber-950 sm:text-xs lg:px-3"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
