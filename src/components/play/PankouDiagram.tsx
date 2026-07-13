import type { PlaySpecimen } from '../../types/play';

interface PankouDiagramProps {
  specimen: PlaySpecimen;
  highlightedParts?: Set<string>;
  onPartClick?: (partId: string) => void;
  interactive?: boolean;
}

export function PankouDiagram({
  specimen,
  highlightedParts,
  onPartClick,
  interactive = false,
}: PankouDiagramProps) {
  const hue = specimen.hue;

  return (
    <svg
      viewBox="0 0 100 90"
      className="mx-auto w-full max-w-xs"
      role={interactive ? 'img' : undefined}
      aria-label={`${specimen.englishName} structural diagram`}
    >
      <defs>
        <linearGradient id={`grad-${specimen.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue}, 45%, 75%)`} />
          <stop offset="100%" stopColor={`hsl(${hue}, 55%, 55%)`} />
        </linearGradient>
      </defs>

      <rect x="5" y="5" width="90" height="80" rx="8" fill="#fafaf9" stroke="#e7e5e4" />

      {/* Base silhouette */}
      <ellipse cx="30" cy="42" rx="14" ry="18" fill={`url(#grad-${specimen.id})`} opacity="0.7" />
      <ellipse cx="70" cy="42" rx="14" ry="18" fill={`url(#grad-${specimen.id})`} opacity="0.7" />
      <circle cx="50" cy="38" r="8" fill={`hsl(${hue}, 50%, 45%)`} />
      <path
        d="M 46 58 Q 50 68 54 58"
        fill="none"
        stroke={`hsl(${hue}, 40%, 40%)`}
        strokeWidth="2"
      />
      <line x1="50" y1="46" x2="50" y2="72" stroke={`hsl(${hue}, 30%, 50%)`} strokeWidth="1.5" />

      {specimen.deconstructRegions.map((region) => {
        const active = highlightedParts?.has(region.id);
        return (
          <g key={region.id}>
            <rect
              x={region.x}
              y={region.y}
              width={region.width}
              height={region.height}
              fill={active ? `hsl(${hue}, 70%, 60%)` : 'transparent'}
              fillOpacity={active ? 0.35 : 0}
              stroke={active ? `hsl(${hue}, 60%, 40%)` : 'transparent'}
              strokeWidth={active ? 1.5 : 0}
              strokeDasharray={active ? undefined : '3 2'}
              rx={3}
              className={interactive ? 'cursor-pointer transition-all hover:fill-opacity-20' : ''}
              onClick={interactive ? () => onPartClick?.(region.id) : undefined}
            />
            {active && (
              <text
                x={region.x + region.width / 2}
                y={region.y - 2}
                textAnchor="middle"
                className="fill-amber-900 text-[4px] font-semibold"
              >
                {region.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
