import type { PankouItem } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';

interface GeneSourceCardProps {
  item: PankouItem;
  selected?: boolean;
  onClick?: () => void;
}

export function GeneSourceCard({ item, selected = false, onClick }: GeneSourceCardProps) {
  const chips = [item.motif, item.classification.structuralSkeleton, item.symbolicMeaning];

  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={selected}
      className={`overflow-hidden rounded-[22px] border bg-white/95 shadow-sm transition-all duration-200 ${
        selected
          ? 'border-[rgba(142,91,56,0.55)] shadow-[0_12px_32px_rgba(80,60,40,0.12)]'
          : 'border-stone-200/70 hover:-translate-y-1 hover:border-stone-300/80 hover:shadow-[0_10px_28px_rgba(80,60,40,0.08)]'
      } ${onClick ? 'cursor-pointer' : ''}`}
      style={selected ? { borderWidth: 2 } : undefined}
    >
      <div className="h-[248px] overflow-hidden bg-[#faf8f4]">
        <ImagePlaceholder hue={item.hue} id={item.id} className="h-full w-full rounded-none border-0" />
      </div>
      <div className="space-y-1 px-3.5 py-3">
        <p className="font-mono text-[10px] text-stone-400">{item.id}</p>
        <h3 className="truncate text-sm font-medium leading-snug text-[#2c2825]">{item.chineseName}</h3>
        <p className="truncate text-[11px] leading-snug text-stone-500">{item.englishName}</p>
        <div className="flex flex-wrap gap-1 pt-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="max-w-full truncate rounded-full bg-[#f5f1ea] px-2 py-0.5 text-[9px] leading-tight text-stone-600"
              title={chip}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
