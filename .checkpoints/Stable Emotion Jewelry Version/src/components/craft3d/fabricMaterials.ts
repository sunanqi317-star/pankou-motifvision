export type FabricTypeId = 'silk' | 'cotton';
export type TextureType = 'silkGradient' | 'cottonNoise';

export interface FabricColorSwatch {
  name: string;
  hex: string;
}

export interface FabricMaterialStyle {
  roughness: number;
  metalness: number;
  sheen: number;
  clearcoat: number;
  clearcoatRoughness: number;
  bumpScale: number;
  textureType: TextureType;
  surfaceLabel: string;
  surfaceQuality: string;
  saturation: number;
  brightness: number;
}

export type FabricMaterialTraits = [string, string, string];

export interface FabricMaterial {
  id: FabricTypeId;
  name: string;
  description: string;
  finish: string;
  craftFeeling: string;
  surfaceSummary: string;
  traits: FabricMaterialTraits;
  materialStyle: FabricMaterialStyle;
}

export const FABRIC_MATERIAL_TRAITS: Record<FabricTypeId, FabricMaterialTraits> = {
  silk: ['Glossy', 'Smooth', 'Elegant'],
  cotton: ['Woven', 'Matte', 'Textured'],
};

export const FABRIC_MATERIAL_CHIPS: Record<FabricTypeId, [string, string]> = {
  silk: ['Glossy', 'Smooth'],
  cotton: ['Woven', 'Matte'],
};

export const NEUTRAL_SAMPLE_COLOR = '#E8DDC5';

export const SHARED_COLOR_PALETTE: FabricColorSwatch[] = [
  { name: 'Teal', hex: '#6FAFA7' },
  { name: 'Crimson', hex: '#B85A63' },
  { name: 'Deep Blue', hex: '#6F93B4' },
  { name: 'Rose', hex: '#D59A9A' },
  { name: 'Gold', hex: '#D3AA55' },
  { name: 'Violet', hex: '#A987B5' },
  { name: 'Amber', hex: '#D89A44' },
  { name: 'Brown', hex: '#9A715F' },
  { name: 'Ivory', hex: '#E8DDC5' },
  { name: 'Black', hex: '#3A3733' },
];

export const MATERIAL_PROFILES: Record<FabricTypeId, FabricMaterialStyle> = {
  silk: {
    roughness: 0.42,
    metalness: 0,
    sheen: 0.92,
    clearcoat: 0.08,
    clearcoatRoughness: 0.6,
    bumpScale: 0.004,
    textureType: 'silkGradient',
    surfaceLabel: 'lustrous',
    surfaceQuality: 'elegant',
    saturation: 0.96,
    brightness: 0.05,
  },
  cotton: {
    roughness: 0.92,
    metalness: 0,
    sheen: 0.08,
    clearcoat: 0,
    clearcoatRoughness: 1,
    bumpScale: 0.02,
    textureType: 'cottonNoise',
    surfaceLabel: 'matte',
    surfaceQuality: 'textured',
    saturation: 0.9,
    brightness: 0.02,
  },
};

export const FABRIC_MATERIALS: FabricMaterial[] = [
  {
    id: 'silk',
    name: 'Silk fabric',
    description: 'Smooth, lustrous, and elegant fabric for flowing Pankou curves.',
    finish: 'elegant and flowing',
    craftFeeling: 'Smooth luster · flexible · elegant',
    surfaceSummary: 'Glossy · smooth · elegant',
    traits: FABRIC_MATERIAL_TRAITS.silk,
    materialStyle: MATERIAL_PROFILES.silk,
  },
  {
    id: 'cotton',
    name: 'Cotton fabric',
    description: 'Matte, woven, and textured fabric with stable everyday structure.',
    finish: 'matte and stable',
    craftFeeling: 'Woven texture · matte · stable',
    surfaceSummary: 'Woven · matte · textured',
    traits: FABRIC_MATERIAL_TRAITS.cotton,
    materialStyle: MATERIAL_PROFILES.cotton,
  },
];

export interface AppliedFabricMaterial {
  fabricType: FabricTypeId;
  fabric: FabricMaterial;
  color: FabricColorSwatch;
  materialStyle: FabricMaterialStyle;
  colorHex: string;
}

/** Ensures only silk or cotton — never undefined or legacy ids. */
export function normalizeFabricType(id: string | null | undefined): FabricTypeId {
  if (id === 'silk' || id === 'cotton') return id;
  return 'cotton';
}

export function getFabricMaterial(id: FabricTypeId): FabricMaterial {
  return FABRIC_MATERIALS.find((m) => m.id === id) ?? FABRIC_MATERIALS[0];
}

export function getMaterialProfile(id: FabricTypeId): FabricMaterialStyle {
  return MATERIAL_PROFILES[id];
}

export function applyMaterialProfile(
  fabricType: FabricTypeId,
  color: FabricColorSwatch,
): AppliedFabricMaterial {
  const fabric = getFabricMaterial(fabricType);
  return {
    fabricType,
    fabric,
    color,
    materialStyle: fabric.materialStyle,
    colorHex: color.hex,
  };
}

export function craftTypeForFabric(id: FabricTypeId): 'Soft Pankou' | 'Hard Pankou' {
  return id === 'cotton' ? 'Hard Pankou' : 'Soft Pankou';
}

const SURFACE_LINES: Record<FabricTypeId, string> = {
  silk: 'Smooth lustrous fabric',
  cotton: 'Matte woven fabric',
};

export function getMaterialSurfaceLine(id: FabricTypeId): string {
  return SURFACE_LINES[id];
}

export function getMaterialCraftFeeling(id: FabricTypeId): string {
  return getFabricMaterial(id).craftFeeling;
}
