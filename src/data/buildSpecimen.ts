import type { PankouClassification, PankouItem } from '../types';
import {
  type PankouTypeId,
  type StructuralSkeleton,
  type VisualFeature,
  pankouTypeLabel,
} from './pankouTaxonomy';
import { enrichSkeletonFields, type PathOrganization } from './skeletonTaxonomy';

const SKELETON_TO_PATH: Record<StructuralSkeleton, PathOrganization> = {
  'Axis skeleton': 'Linear',
  'Bilateral skeleton': 'Mirrored',
  'Radial skeleton': 'Radial',
  'Loop skeleton': 'Continuous',
  'Modular skeleton': 'Multi-path',
};

const PATH_BY_ID: Record<string, PathOrganization> = {
  'PK-001': 'Mirrored',
  'PK-002': 'Radial',
  'PK-003': 'Mirrored',
  'PK-004': 'Continuous',
  'PK-005': 'Mirrored',
  'PK-006': 'Radial',
  'PK-007': 'Multi-path',
  'PK-008': 'Linear',
  'PK-009': 'Multi-path',
  'PK-010': 'Continuous',
  'PK-011': 'Continuous',
  'PK-012': 'Continuous',
  'PK-013': 'Radial',
  'PK-014': 'Radial',
  'PK-015': 'Mirrored',
  'PK-016': 'Radial',
  'PK-017': 'Linear',
  'PK-018': 'Radial',
  'PK-019': 'Mirrored',
  'PK-020': 'Linear',
  'PK-021': 'Multi-path',
  'PK-022': 'Multi-path',
  'PK-023': 'Linear',
  'PK-024': 'Continuous',
  'PK-025': 'Radial',
  'PK-026': 'Radial',
  'PK-027': 'Radial',
  'PK-028': 'Continuous',
  'PK-029': 'Continuous',
  'PK-030': 'Continuous',
};

const PATH_TO_SKELETON: Record<PathOrganization, StructuralSkeleton> = {
  Linear: 'Axis skeleton',
  Mirrored: 'Bilateral skeleton',
  Radial: 'Radial skeleton',
  Continuous: 'Loop skeleton',
  'Multi-path': 'Modular skeleton',
};

export interface SpecimenSeed {
  id: string;
  chineseName: string;
  englishName: string;
  pankouType: PankouTypeId;
  motif: string;
  legacyStructure: string;
  emotionalTone: string;
  hue: number;
  cluster: string;
  classification: PankouClassification;
  visualFeatures: VisualFeature[];
  culturalKeywords: string[];
  recommendedJewelryForms: string[];
  generationPromptKeywords: string[];
  negativePromptHints: string[];
  relatedSpecimenIds: string[];
  legacyFeatures: string[];
}

function formForStructure(structure: string): PankouClassification['form'] {
  if (structure.includes('Radial')) return 'Radial rosette';
  if (structure.includes('Linear')) return 'Linear band';
  if (structure.includes('Concentric')) return 'Concentric medallion';
  if (structure.includes('Asymmetric')) return 'Asymmetric fold';
  if (structure.includes('Curved')) return 'Coiled loop';
  return 'Bilateral pair';
}

function compositionForPath(path: PathOrganization): PankouClassification['composition'] {
  switch (path) {
    case 'Linear':
      return 'Linear repeated';
    case 'Mirrored':
      return 'Bilateral symmetric';
    case 'Radial':
      return 'Radial centered';
    case 'Continuous':
      return 'Layered continuous';
    default:
      return 'Modular hybrid';
  }
}

function craftNormalized(craft: string): PankouClassification['craft'] {
  const map: Record<string, PankouClassification['craft']> = {
    'Silk Wrapping': 'Silk wrapping',
    'Embroidered Core': 'Embroidered core',
    'Gold Thread Binding': 'Gold thread binding',
    'Satin Wrapping': 'Satin wrapping',
    'Brocade Inlay': 'Brocade inlay',
    'Cord Braiding': 'Cord braiding',
  };
  return map[craft] ?? 'Silk wrapping';
}

function materialForCraft(craft: string): PankouClassification['material'] {
  if (craft.includes('Gold')) return 'Gold thread';
  if (craft.includes('Brocade')) return 'Brocade fabric';
  if (craft.includes('Cord') || craft.includes('Braiding')) return 'Braided cord';
  if (craft.includes('Satin')) return 'Satin wrap';
  if (craft.includes('Embroidered')) return 'Pearl-accented silk';
  return 'Silk cord';
}

function colorForHue(hue: number): PankouClassification['color'] {
  if (hue < 30 || hue > 330) return 'Cinnabar red';
  if (hue < 80) return 'Gold';
  if (hue < 150) return 'Jade green';
  if (hue < 220) return 'Indigo';
  if (hue < 280) return 'Plum';
  return 'Pearl white';
}

function visualFeaturesFromLegacy(
  features: string[],
  motif: string,
  structure: string,
): VisualFeature[] {
  const out = new Set<VisualFeature>();
  if (features.some((f) => f.includes('bilateral'))) out.add('bilateral symmetry');
  if (features.some((f) => f.includes('radial'))) out.add('radial layout');
  if (features.some((f) => f.includes('translational'))) out.add('axial symmetry');
  if (structure.includes('Curved')) out.add('curved contour');
  if (structure.includes('Linear') || structure.includes('Geometric')) out.add('geometric contour');
  if (structure.includes('Concentric')) out.add('closed circular frame');
  if (structure.includes('Asymmetric')) out.add('open negative space');
  if (motif === 'Butterfly' || motif === 'Bat') out.add('wing-like silhouette');
  if (motif === 'Floral' || motif === 'Lotus') out.add('floral rhythm');
  if (features.some((f) => f.includes('vine') || f.includes('looping'))) out.add('loop structure');
  if (features.some((f) => f.includes('modular') || structure.includes('Multi'))) {
    out.add('modular repetition');
  }
  if (structure.includes('Radial') || structure.includes('Concentric')) out.add('dense node arrangement');
  if (out.size === 0) out.add('bilateral symmetry');
  return [...out];
}

function jewelryFormsFor(motif: string, skeleton: StructuralSkeleton): string[] {
  const base = ['Pendant necklace', 'Brooch', 'Earrings'];
  if (skeleton === 'Modular skeleton') return ['Modular jewelry set', 'Brooch', 'Garment pin'];
  if (motif === 'Butterfly') return ['Pendant necklace', 'Brooch', 'Collar ornament'];
  if (motif === 'Floral' || motif === 'Lotus') return ['Brooch', 'Pendant necklace', 'Earrings'];
  return base;
}

const PANKOU_TYPE_BY_ID: Record<string, PankouTypeId> = {
  'PK-001': 'butterfly',
  'PK-002': 'floral-coiled',
  'PK-003': 'composite',
  'PK-004': 'cloud',
  'PK-005': 'composite',
  'PK-006': 'floral-coiled',
  'PK-007': 'composite',
  'PK-008': 'straight',
  'PK-009': 'butterfly',
  'PK-010': 'floral-coiled',
  'PK-011': 'ruyi',
  'PK-012': 'composite',
  'PK-013': 'floral-coiled',
  'PK-014': 'geometric',
  'PK-015': 'butterfly',
  'PK-016': 'composite',
  'PK-017': 'cloud',
  'PK-018': 'composite',
  'PK-019': 'floral-coiled',
  'PK-020': 'composite',
  'PK-021': 'geometric',
  'PK-022': 'floral-coiled',
  'PK-023': 'butterfly',
  'PK-024': 'cloud',
  'PK-025': 'composite',
  'PK-026': 'geometric',
  'PK-027': 'composite',
  'PK-028': 'floral-coiled',
  'PK-029': 'composite',
  'PK-030': 'ruyi',
};

const CLUSTER_RELATED: Record<string, string[]> = {
  'Cluster A - Insect Motifs': ['PK-001', 'PK-009', 'PK-015', 'PK-023'],
  'Cluster B - Floral Motifs': ['PK-002', 'PK-006', 'PK-013', 'PK-019'],
  'Cluster C - Mythic Motifs': ['PK-003', 'PK-007', 'PK-012', 'PK-016'],
  'Cluster D - Atmospheric Motifs': ['PK-004', 'PK-011', 'PK-017', 'PK-024'],
  'Cluster E - Geometric Motifs': ['PK-008', 'PK-014', 'PK-021', 'PK-026'],
};

export function buildSpecimenFromLegacy(seed: {
  id: string;
  chineseName: string;
  englishName: string;
  motif: string;
  structure: string;
  craft: string;
  symbolicMeaning: string;
  emotionalTone: string;
  hue: number;
  searchText: string;
  features: string[];
  cluster: string;
}): PankouItem {
  const path = PATH_BY_ID[seed.id] ?? 'Mirrored';
  const structuralSkeleton = PATH_TO_SKELETON[path];
  const pankouType = PANKOU_TYPE_BY_ID[seed.id] ?? 'composite';

  const classification: PankouClassification = {
    form: formForStructure(seed.structure),
    craft: craftNormalized(seed.craft),
    material: materialForCraft(seed.craft),
    color: colorForHue(seed.hue),
    composition: compositionForPath(path),
    motifSemantics: seed.symbolicMeaning,
    structuralSkeleton,
  };

  const visualFeatures = visualFeaturesFromLegacy(seed.features, seed.motif, seed.structure);
  const related = (CLUSTER_RELATED[seed.cluster] ?? []).filter((id) => id !== seed.id).slice(0, 3);

  const generationPromptKeywords = [
    seed.englishName.toLowerCase(),
    pankouTypeLabel(pankouType).split('/')[1]?.trim().toLowerCase() ?? pankouType,
    seed.motif.toLowerCase(),
    classification.structuralSkeleton.toLowerCase(),
    ...visualFeatures.slice(0, 4),
  ];

  const culturalKeywords = seed.searchText.split(/\s+/).filter((w) => w.length > 3).slice(0, 8);

  return enrichSpecimen({
    id: seed.id,
    chineseName: seed.chineseName,
    englishName: seed.englishName,
    pankouType,
    motif: seed.motif,
    legacyStructure: seed.structure,
    emotionalTone: seed.emotionalTone,
    hue: seed.hue,
    cluster: seed.cluster,
    classification,
    visualFeatures,
    culturalKeywords,
    recommendedJewelryForms: jewelryFormsFor(seed.motif, structuralSkeleton),
    generationPromptKeywords,
    negativePromptHints: [
      'distorted knot structure',
      'broken symmetry',
      'unclear motif contour',
      'overexposed textile glare',
    ],
    relatedSpecimenIds: related,
    legacyFeatures: seed.features,
    searchText: seed.searchText,
  });
}

interface EnrichInput extends SpecimenSeed {
  searchText: string;
}

export function enrichSpecimen(seed: EnrichInput): PankouItem {
  const path = SKELETON_TO_PATH[seed.classification.structuralSkeleton as StructuralSkeleton]
    ?? PATH_BY_ID[seed.id]
    ?? 'Mirrored';

  const skeletonEnriched = enrichSkeletonFields({
    id: seed.id,
    chineseName: seed.chineseName,
    englishName: seed.englishName,
    pankouType: seed.pankouType,
    pankouTypeLabel: pankouTypeLabel(seed.pankouType),
    classification: {
      ...seed.classification,
      structuralSkeleton: seed.classification.structuralSkeleton
        ?? PATH_TO_SKELETON[path],
    },
    visualFeatures: seed.visualFeatures,
    culturalKeywords: seed.culturalKeywords,
    recommendedJewelryForms: seed.recommendedJewelryForms,
    generationPromptKeywords: seed.generationPromptKeywords,
    negativePromptHints: seed.negativePromptHints,
    relatedSpecimenIds: seed.relatedSpecimenIds,
    emotionalTone: seed.emotionalTone,
    hue: seed.hue,
    cluster: seed.cluster,
    searchText: [
      seed.searchText,
      seed.culturalKeywords.join(' '),
      seed.generationPromptKeywords.join(' '),
      seed.visualFeatures.join(' '),
    ].join(' ').trim(),
    features: seed.legacyFeatures,
    motif: seed.motif,
    structure: seed.legacyStructure,
    craft: seed.classification.craft,
    symbolicMeaning: seed.classification.motifSemantics,
    pathOrganization: path,
  });

  return skeletonEnriched;
}
