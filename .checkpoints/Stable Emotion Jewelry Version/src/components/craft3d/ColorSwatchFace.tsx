function shadeHex(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const shift = (c: number) => clamp(c + amount * 255);
  return `#${[shift(r), shift(g), shift(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E")`;

export function ColorSwatchFace({ hex, compact = false }: { hex: string; compact?: boolean }) {
  const lighter = shadeHex(hex, 0.06);
  const darker = shadeHex(hex, -0.04);

  return (
    <span
      className={`relative block w-full overflow-hidden rounded-md border border-black/[0.04] ${
        compact ? 'h-6' : 'h-8'
      }`}
    >
      <span
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${lighter} 0%, ${hex} 58%, ${darker} 100%)`,
        }}
      />
      <span
        className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: '72px 72px' }}
      />
      <span
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)',
        }}
      />
    </span>
  );
}
