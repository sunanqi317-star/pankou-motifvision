import type { PankouItem } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { experienceCard } from './ui/experienceStyles';

interface PankouCardProps {
  item: PankouItem;
  onClick?: () => void;
  score?: number;
  compact?: boolean;
  selected?: boolean;
}

export function PankouCard({ item, onClick, score, compact = false, selected = false }: PankouCardProps) {
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
      className={`group flex flex-col overflow-hidden ${experienceCard} transition-all ${
        selected
          ? 'border-amber-900/30 ring-2 ring-amber-900/15'
          : 'hover:border-amber-900/20'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={compact ? 'h-28' : 'h-36'}>
        <ImagePlaceholder hue={item.hue} id={item.id} className="h-full w-full rounded-none border-0" />
      </div>
      <div className={`flex flex-1 flex-col ${compact ? 'p-2.5' : 'p-3'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-[10px] text-stone-400">{item.id}</p>
            <h3 className={`truncate text-[#2c2825] ${compact ? 'text-sm' : 'text-base'}`}>
              {item.chineseName}
            </h3>
            <p className="truncate text-xs text-stone-500">{item.englishName}</p>
          </div>
          {score !== undefined && (
            <span className="shrink-0 rounded-full bg-[#faf8f4] px-1.5 py-0.5 font-mono text-[10px] text-[#2c2825]">
              {(score * 100).toFixed(1)}%
            </span>
          )}
        </div>
        {!compact && (
          <>
            <p className="mt-2 line-clamp-1 text-[10px] text-amber-950/70">{item.pankouTypeLabel}</p>
            <dl className="mt-2 space-y-1 text-[11px] text-stone-600">
              <div className="flex gap-1">
                <dt className="text-stone-400">Form</dt>
                <dd className="truncate">{item.classification.form}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-stone-400">Skeleton</dt>
                <dd className="truncate">{item.classification.structuralSkeleton}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-stone-400">Semantics</dt>
                <dd className="truncate">{item.classification.motifSemantics}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </article>
  );
}
