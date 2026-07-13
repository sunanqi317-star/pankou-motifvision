import type { PankouItem } from '../types';
import type { StructureStrategy, VariationPreset } from './loraJewelry';

export const CULTURAL_EMPHASIS_OPTIONS = [
  'Auspicious Blessing',
  'Feminine Elegance',
  'Transformation',
  'Festival Ornament',
  'Prosperity',
  'Longevity',
  'Protection',
  'Harmony',
] as const;

export type CulturalEmphasis = (typeof CULTURAL_EMPHASIS_OPTIONS)[number];

export const STRUCTURE_PRESERVATION_LEVELS = [
  { level: 1, label: 'Symbolic inspiration only', strategy: 'Abstract Motif into Frame' as StructureStrategy },
  { level: 2, label: 'Keep general silhouette', strategy: 'Transform Closure into Pendant' as StructureStrategy },
  { level: 3, label: 'Preserve symmetry', strategy: 'Emphasize Symmetry' as StructureStrategy },
  { level: 4, label: 'Preserve skeleton logic', strategy: 'Modularize Repeated Units' as StructureStrategy },
  { level: 5, label: 'Preserve original Pankou skeleton', strategy: 'Preserve Original Skeleton' as StructureStrategy },
] as const;

export function structureStrategyForLevel(level: number): StructureStrategy {
  const entry = STRUCTURE_PRESERVATION_LEVELS.find((l) => l.level === level);
  return entry?.strategy ?? 'Preserve Original Skeleton';
}

export function preservationLabelForLevel(level: number): string {
  const entry = STRUCTURE_PRESERVATION_LEVELS.find((l) => l.level === level);
  return entry?.label.toLowerCase() ?? 'preserve original pankou skeleton';
}

export function getCulturalPathChips(item: PankouItem): string[] {
  return [
    item.motif,
    item.classification.structuralSkeleton,
    item.symbolicMeaning,
    'Jewelry Direction',
  ];
}

const EMPHASIS_READING: Record<CulturalEmphasis, string> = {
  'Auspicious Blessing': 'blessing-oriented ornament and celebratory proportion',
  'Feminine Elegance': 'refined scale, soft contour, and graceful symmetry',
  Transformation: 'motif abstraction and wearable reinterpretation of fastening logic',
  'Festival Ornament': 'festive visibility, central focal emphasis, and rich surface rhythm',
  Prosperity: 'abundant repetition, radiant material contrast, and auspicious density',
  Longevity: 'enduring loop logic, stable armature, and heirloom continuity',
  Protection: 'contained silhouette, guarded symmetry, and authoritative structure',
  Harmony: 'balanced bilateral rhythm and reconciled motif distribution',
};

export function generateCulturalReading(
  item: PankouItem,
  emphasis: CulturalEmphasis,
): string {
  const skeleton = item.classification.structuralSkeleton;
  const emphasisNote = EMPHASIS_READING[emphasis] ?? emphasis.toLowerCase();

  return (
    `${item.chineseName} (${item.id}) presents a ${item.motif.toLowerCase()} motif within ${item.structure.toLowerCase()} structure, ` +
    `read through ${skeleton.toLowerCase()} and symbolic meaning "${item.symbolicMeaning.toLowerCase()}". ` +
    `With cultural emphasis on ${emphasis.toLowerCase()}, the jewelry direction favors ${emphasisNote}.`
  );
}

export function generateDesignStatement(
  item: PankouItem,
  emphasis: CulturalEmphasis,
  jewelryType: string,
  material: string,
  colorPalette: string,
  preservationLevel: number,
  direction: VariationPreset,
): string {
  const preservation = preservationLabelForLevel(preservationLevel);
  const directionLabel = direction.replace(/-/g, ' ');

  return (
    `A ${directionLabel} ${jewelryType.toLowerCase()} derived from ${item.englishName}, ` +
    `using ${material.toLowerCase()} with ${colorPalette.toLowerCase()} color styling. ` +
    `The design keeps ${preservation} while emphasizing ${emphasis.toLowerCase()}.`
  );
}

export function sharedFeatureReason(source: PankouItem, related: PankouItem): string {
  const sharedVisual = source.visualFeatures.find((f) => related.visualFeatures.includes(f));
  if (sharedVisual) return `Shared ${sharedVisual}`;
  if (source.motif === related.motif) return `Same ${source.motif.toLowerCase()} motif family`;
  if (source.classification.structuralSkeleton === related.classification.structuralSkeleton) {
    return `Same ${related.classification.structuralSkeleton.toLowerCase()}`;
  }
  if (source.symbolicMeaning === related.symbolicMeaning) {
    return `Shared ${related.symbolicMeaning.toLowerCase()} meaning`;
  }
  return 'Related corpus affinity';
}

export function defaultEmphasisForSpecimen(item: PankouItem): CulturalEmphasis {
  const meaning = item.symbolicMeaning;
  if (meaning.includes('Blessing')) return 'Auspicious Blessing';
  if (meaning.includes('Prosperity')) return 'Prosperity';
  if (meaning.includes('Longevity')) return 'Longevity';
  if (meaning.includes('Protection')) return 'Protection';
  if (meaning.includes('Harmony')) return 'Harmony';
  if (meaning.includes('Elegance')) return 'Feminine Elegance';
  return 'Transformation';
}
