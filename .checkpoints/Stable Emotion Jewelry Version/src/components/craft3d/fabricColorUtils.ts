const WARM_IVORY = { r: 232, g: 221, b: 197 }; // #E8DDC5

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Softens a swatch color for 3D fabric rendering — warmer, slightly desaturated, lifted.
 * UI swatches use the raw palette hex; 3D materials use this softened value.
 */
export function softenFabricColor(hex: string, ivoryMix = 0.21): string {
  const { r, g, b } = hexToRgb(hex);
  let nr = r * (1 - ivoryMix) + WARM_IVORY.r * ivoryMix;
  let ng = g * (1 - ivoryMix) + WARM_IVORY.g * ivoryMix;
  let nb = b * (1 - ivoryMix) + WARM_IVORY.b * ivoryMix;

  const gray = 0.299 * nr + 0.587 * ng + 0.114 * nb;
  const saturation = 0.9;
  nr = gray + (nr - gray) * saturation;
  ng = gray + (ng - gray) * saturation;
  nb = gray + (nb - gray) * saturation;

  const lift = 255 * 0.1;
  return rgbToHex(nr + lift, ng + lift, nb + lift);
}

/** UI thumbnail preview — slightly softened but closer to swatch than 3D. */
export function softenPreviewColor(hex: string): string {
  return softenFabricColor(hex, 0.1);
}

const RENDER_IVORY = '#F2E8D8';

/** Step 1 strip color — lifted mix for contrast on the warm table. */
export function darkenColor(hex: string, amount = 0.15): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - amount;
  return rgbToHex(r * factor, g * factor, b * factor);
}

export function mixRenderColor(hex: string, ivoryMix = 0.18): string {
  const { r, g, b } = hexToRgb(hex);
  const { r: ir, g: ig, b: ib } = hexToRgb(RENDER_IVORY);
  const lift = 255 * 0.06;
  return rgbToHex(
    r * (1 - ivoryMix) + ir * ivoryMix + lift,
    g * (1 - ivoryMix) + ig * ivoryMix + lift,
    b * (1 - ivoryMix) + ib * ivoryMix + lift,
  );
}

export function mixHexColors(a: string, b: string, amount: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const t = Math.max(0, Math.min(1, amount));
  return rgbToHex(
    ca.r * (1 - t) + cb.r * t,
    ca.g * (1 - t) + cb.g * t,
    ca.b * (1 - t) + cb.b * t,
  );
}

/** Silk strip palette — warm base, soft highlight, gentle shadow (no pure white). */
export function silkStripColors(hex: string): {
  base: string;
  highlight: string;
  shadow: string;
} {
  const base = mixRenderColor(hex, 0.18);
  return {
    base,
    highlight: mixHexColors(base, '#FFF5E8', 0.35),
    shadow: mixHexColors(base, '#6A4A45', 0.12),
  };
}
