export const PANKOU_TYPES = [
  { id: 'straight', label: '一字扣 / Straight Pankou' },
  { id: 'floral-coiled', label: '盘花扣 / Floral Coiled Pankou' },
  { id: 'butterfly', label: '蝴蝶扣 / Butterfly Pankou' },
  { id: 'ruyi', label: '如意扣 / Ruyi Pankou' },
  { id: 'cloud', label: '云纹扣 / Cloud Motif Pankou' },
  { id: 'geometric', label: '几何扣 / Geometric Pankou' },
  { id: 'composite', label: '复合装饰扣 / Composite Decorative Pankou' },
] as const;

export type PankouTypeId = (typeof PANKOU_TYPES)[number]['id'];

export const VISUAL_FEATURES = [
  'axial symmetry',
  'bilateral symmetry',
  'radial layout',
  'loop structure',
  'modular repetition',
  'curved contour',
  'geometric contour',
  'dense node arrangement',
  'open negative space',
  'closed circular frame',
  'floral rhythm',
  'wing-like silhouette',
] as const;

export type VisualFeature = (typeof VISUAL_FEATURES)[number];

export const STRUCTURAL_SKELETONS = [
  'Axis skeleton',
  'Bilateral skeleton',
  'Radial skeleton',
  'Loop skeleton',
  'Modular skeleton',
] as const;

export type StructuralSkeleton = (typeof STRUCTURAL_SKELETONS)[number];

export const CLASSIFICATION_FORMS = [
  'Bilateral pair',
  'Coiled loop',
  'Linear band',
  'Radial rosette',
  'Asymmetric fold',
  'Concentric medallion',
] as const;

export const CLASSIFICATION_CRAFTS = [
  'Silk wrapping',
  'Embroidered core',
  'Gold thread binding',
  'Satin wrapping',
  'Brocade inlay',
  'Cord braiding',
] as const;

export const CLASSIFICATION_MATERIALS = [
  'Silk cord',
  'Satin wrap',
  'Gold thread',
  'Brocade fabric',
  'Braided cord',
  'Pearl-accented silk',
] as const;

export const CLASSIFICATION_COLORS = [
  'Ivory',
  'Cinnabar red',
  'Jade green',
  'Indigo',
  'Gold',
  'Plum',
  'Pearl white',
] as const;

export const CLASSIFICATION_COMPOSITIONS = [
  'Bilateral symmetric',
  'Radial centered',
  'Linear repeated',
  'Layered continuous',
  'Modular hybrid',
  'Asymmetric balanced',
] as const;

export const MOTIF_SEMANTICS = [
  'Auspicious Blessing',
  'Longevity',
  'Prosperity',
  'Harmony',
  'Protection',
  'Elegance',
] as const;

export const MOTIF_CLASSES = [
  'Butterfly',
  'Floral',
  'Dragon',
  'Cloud',
  'Bat',
  'Lotus',
  'Phoenix',
  'Geometric',
] as const;

export function pankouTypeLabel(id: PankouTypeId): string {
  return PANKOU_TYPES.find((t) => t.id === id)?.label ?? id;
}

export const CLASSIFICATION_DIMENSIONS = [
  { key: 'form', label: 'Form', options: CLASSIFICATION_FORMS },
  { key: 'craft', label: 'Craft', options: CLASSIFICATION_CRAFTS },
  { key: 'material', label: 'Material', options: CLASSIFICATION_MATERIALS },
  { key: 'color', label: 'Color', options: CLASSIFICATION_COLORS },
  { key: 'composition', label: 'Composition', options: CLASSIFICATION_COMPOSITIONS },
  { key: 'motifSemantics', label: 'Motif Semantics', options: MOTIF_SEMANTICS },
  { key: 'structuralSkeleton', label: 'Structural Skeleton', options: STRUCTURAL_SKELETONS },
] as const;
