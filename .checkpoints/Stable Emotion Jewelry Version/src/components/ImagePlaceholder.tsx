interface ImagePlaceholderProps {
  hue: number;
  id: string;
  className?: string;
  compact?: boolean;
}

export function ImagePlaceholder({ hue, id, className = '', compact = false }: ImagePlaceholderProps) {
  const size = compact ? 48 : 80;
  return (
    <div
      className={`relative overflow-hidden rounded border border-stone-300 bg-stone-100 ${className}`}
      aria-label={`Pankou image placeholder for ${id}`}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${hue}, 35%, 88%)`} />
            <stop offset="100%" stopColor={`hsl(${hue}, 45%, 72%)`} />
          </linearGradient>
        </defs>
        <rect width="120" height="120" fill={`url(#grad-${id})`} />
        <circle cx="60" cy="60" r={size * 0.45} fill="none" stroke={`hsl(${hue}, 40%, 45%)`} strokeWidth="1.5" opacity="0.7" />
        <path
          d="M60 25 C45 45, 35 60, 60 95 C85 60, 75 45, 60 25"
          fill="none"
          stroke={`hsl(${hue}, 50%, 38%)`}
          strokeWidth="1.2"
          opacity="0.6"
        />
        <path
          d="M30 60 Q60 40, 90 60 Q60 80, 30 60"
          fill="none"
          stroke={`hsl(${hue}, 30%, 50%)`}
          strokeWidth="0.8"
          opacity="0.4"
        />
        <text x="60" y="112" textAnchor="middle" fontSize="7" fill={`hsl(${hue}, 25%, 40%)`} fontFamily="Inter, sans-serif">
          {id}
        </text>
      </svg>
    </div>
  );
}
