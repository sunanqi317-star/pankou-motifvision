import type { PankouItem } from '../types';

export type PathOrganization = 'Linear' | 'Mirrored' | 'Radial' | 'Continuous' | 'Multi-path';

export interface SkeletonTaxonomyEntry {
  pathOrganization: PathOrganization;
  nodeDensity: string;
  constraintPattern: string;
  skeletonType: string;
  representativeType: string;
}

export const SKELETON_TAXONOMY: Record<PathOrganization, SkeletonTaxonomyEntry> = {
  Linear: {
    pathOrganization: 'Linear',
    nodeDensity: 'Low node density',
    constraintPattern: 'Axial symmetry',
    skeletonType: 'Axis skeleton',
    representativeType: 'Straight-type Pankou',
  },
  Mirrored: {
    pathOrganization: 'Mirrored',
    nodeDensity: 'Medium node density',
    constraintPattern: 'Axial symmetry',
    skeletonType: 'Bilateral skeleton',
    representativeType: 'Butterfly-knot Pankou',
  },
  Radial: {
    pathOrganization: 'Radial',
    nodeDensity: 'Medium node density',
    constraintPattern: 'Approximate symmetry',
    skeletonType: 'Radial skeleton',
    representativeType: 'Floral Pankou',
  },
  Continuous: {
    pathOrganization: 'Continuous',
    nodeDensity: 'High node density',
    constraintPattern: 'Dynamic balance',
    skeletonType: 'Loop skeleton',
    representativeType: 'Ruyi-knot Pankou',
  },
  'Multi-path': {
    pathOrganization: 'Multi-path',
    nodeDensity: 'Multi-centered',
    constraintPattern: 'Hybrid structural',
    skeletonType: 'Modular skeleton',
    representativeType: 'Composite decorative Pankou',
  },
};

export type SkeletonEnrichedItem = Omit<
  PankouItem,
  'pathOrganization' | 'nodeDensity' | 'constraintPattern' | 'skeletonType' | 'representativeType'
> & {
  pathOrganization: PathOrganization;
};

/** Align skeleton taxonomy with classification.structuralSkeleton when present. */
export function pathFromStructuralSkeleton(skeleton: string): PathOrganization | undefined {
  const map: Record<string, PathOrganization> = {
    'Axis skeleton': 'Linear',
    'Bilateral skeleton': 'Mirrored',
    'Radial skeleton': 'Radial',
    'Loop skeleton': 'Continuous',
    'Modular skeleton': 'Multi-path',
  };
  return map[skeleton];
}

export function enrichSkeletonFields(item: SkeletonEnrichedItem): PankouItem {
  const taxonomy = SKELETON_TAXONOMY[item.pathOrganization];
  return { ...item, ...taxonomy };
}

const PROMPT_TERMS: Record<PathOrganization, string[]> = {
  Linear: ['axis skeleton', 'axial symmetry'],
  Mirrored: ['bilateral skeleton', 'axial symmetry'],
  Radial: ['radial skeleton', 'approximate symmetry'],
  Continuous: ['loop skeleton', 'dynamic balance'],
  'Multi-path': ['modular skeleton', 'hybrid structural'],
};

export function getSkeletonPromptTerms(item: PankouItem): string[] {
  return PROMPT_TERMS[item.pathOrganization as PathOrganization] ?? [];
}

export function formatStructuralClassification(item: PankouItem): string {
  return [
    `Path organization: ${item.pathOrganization} (${item.representativeType}).`,
    `Skeleton type: ${item.skeletonType}; ${item.nodeDensity.toLowerCase()}; ${item.constraintPattern.toLowerCase()}.`,
  ].join(' ');
}
