import type { ReactNode } from 'react';
import type { FabricTypeId } from './fabricMaterials';
import { softenPreviewColor } from './fabricColorUtils';

interface FabricThumbnailProps {
  fabricId: FabricTypeId;
  colorHex?: string;
  showColorHint?: boolean;
  compact?: boolean;
  dense?: boolean;
}

function shadeHex(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const shift = (c: number) => clamp(c + amount * 255);
  return `#${[shift(r), shift(g), shift(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export const DEFAULT_PREVIEW_COLOR = '#D3AA55';

export function FabricThumbnail({
  fabricId,
  colorHex = DEFAULT_PREVIEW_COLOR,
  showColorHint = false,
  compact = false,
  dense = false,
}: FabricThumbnailProps) {
  const base = softenPreviewColor(colorHex);
  const dark = shadeHex(base, -0.12);
  const light = shadeHex(base, 0.1);
  const heightClass = dense ? 'h-14' : compact ? 'h-16' : 'h-20';

  const surface = (children: ReactNode) => (
    <div className={`relative w-full overflow-hidden ${heightClass}`} aria-hidden>
      {children}
      {showColorHint && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#faf8f4]/75 px-2 text-center text-[9px] leading-tight text-stone-500">
          Choose a color to preview material
        </div>
      )}
    </div>
  );

  if (fabricId === 'silk') {
    const sheen = shadeHex(base, 0.14);
    return surface(
      <>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${dark}99 0%, ${base} 28%, ${light} 50%, ${base} 72%, ${dark}99 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(94deg, transparent 18%, ${sheen}55 42%, ${sheen}66 50%, ${sheen}55 58%, transparent 78%)`,
          }}
        />
      </>,
    );
  }

  return surface(
    <>
      <div className="absolute inset-0" style={{ background: base }} />
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, ${dark}55 0 1px, transparent 1px 9px),
            repeating-linear-gradient(90deg, ${dark}44 0 1px, transparent 1px 9px)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
    </>,
  );
}
