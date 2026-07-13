import type { PankouItem } from '../types';

const SKELETON_LABELS: Record<string, string> = {
  'skeleton:curved': 'Curved skeleton',
  'skeleton:serpentine': 'Serpentine skeleton',
  'skeleton:petal-ring': 'Petal-ring skeleton',
  'skeleton:angular': 'Angular skeleton',
  'skeleton:looping': 'Looping cloud skeleton',
  'skeleton:plume': 'Plume-like extension',
  'skeleton:vine': 'Vine interlace',
  'skeleton:wing-fold': 'Wing-fold structure',
};

export function getSkeletonLabel(item: PankouItem): string {
  if (item.skeletonType) return item.skeletonType;
  const tag = item.features.find((f) => f.startsWith('skeleton:'));
  if (!tag) return item.structure;
  return SKELETON_LABELS[tag] ?? tag.replace('skeleton:', '').replace(/-/g, ' ');
}

export const PIPELINE_STAGE_LABELS = [
  'Corpus',
  'Retrieval',
  'Similarity',
  'Affinity',
  'Interpretation',
  'Reinterpretation',
] as const;

export type PipelineStageIndex = 1 | 2 | 3 | 4 | 5 | 6;
