export const WEARING_POSITIONS = [
  'Qipao collar',
  'Front placket',
  'Sleeve cuff',
  'Jewelry inspiration',
] as const;

export const CRAFT_PANKOU_TYPES = [
  'Straight Pankou',
  'Floral Pankou',
  'Butterfly Pankou',
  'Ruyi Pankou',
] as const;

export const CORE_MATERIALS = [
  'Soft cotton core',
  'Silk cord',
  'Paper cord',
  'Hemp cord',
  'Thin metal wire',
] as const;

export const FINISHING_OPTIONS = [
  'Shape',
  'Add clasp head',
  'Add loop fastening',
] as const;

export type WearingPosition = (typeof WEARING_POSITIONS)[number];
export type CraftPankouType = (typeof CRAFT_PANKOU_TYPES)[number];
export type CoreMaterial = (typeof CORE_MATERIALS)[number];
export type FinishingOption = (typeof FINISHING_OPTIONS)[number];
export type CraftType = 'Soft Pankou' | 'Hard Pankou';

export interface PathPoint {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface PankouPathConfig {
  pathD: string;
  allNodes: PathPoint[];
  softRequiredNodeIds: string[];
  hardRequiredNodeIds: string[];
  pathLabel: string;
}

export interface CraftSummary {
  pankouType: CraftPankouType;
  craftType: CraftType;
  coreMaterial: CoreMaterial;
  coilingPath: string;
  nodeFixingStyle: string;
  finishingMethod: string;
}

const PATH_CONFIGS: Record<CraftPankouType, PankouPathConfig> = {
  'Straight Pankou': {
    pathD: 'M 48 120 L 272 120',
    pathLabel: 'Straight path',
    allNodes: [
      { id: 'n-center', x: 160, y: 120, label: 'Center node' },
      { id: 'n-turn-a', x: 104, y: 120, label: 'Turning node' },
      { id: 'n-turn-b', x: 216, y: 120, label: 'Turning node' },
      { id: 'n-end-a', x: 48, y: 120, label: 'End node' },
      { id: 'n-end-b', x: 272, y: 120, label: 'End node' },
    ],
    softRequiredNodeIds: ['n-center', 'n-turn-a'],
    hardRequiredNodeIds: ['n-center', 'n-turn-a', 'n-turn-b', 'n-end-a', 'n-end-b'],
  },
  'Butterfly Pankou': {
    pathD: 'M 160 44 C 96 72, 72 120, 96 168 C 120 196, 160 204, 200 196 C 224 168, 224 120, 200 72 C 176 52, 160 44, 160 44 Z',
    pathLabel: 'Butterfly path',
    allNodes: [
      { id: 'n-center', x: 160, y: 120, label: 'Center node' },
      { id: 'n-turn-a', x: 96, y: 72, label: 'Wing turn' },
      { id: 'n-turn-b', x: 200, y: 72, label: 'Wing turn' },
      { id: 'n-wing-l', x: 72, y: 120, label: 'Body joint' },
      { id: 'n-wing-r', x: 224, y: 120, label: 'Body joint' },
    ],
    softRequiredNodeIds: ['n-center', 'n-turn-a'],
    hardRequiredNodeIds: ['n-center', 'n-turn-a', 'n-turn-b', 'n-wing-l', 'n-wing-r'],
  },
  'Floral Pankou': {
    pathD: 'M 160 120 m -56 0 a 56 56 0 1 0 112 0 a 56 56 0 1 0 -112 0 M 160 64 L 160 176 M 104 120 L 216 120 M 128 88 L 192 152 M 192 88 L 128 152',
    pathLabel: 'Floral path',
    allNodes: [
      { id: 'n-center', x: 160, y: 120, label: 'Center node' },
      { id: 'n-turn-a', x: 160, y: 64, label: 'Petal node' },
      { id: 'n-turn-b', x: 216, y: 120, label: 'Petal node' },
      { id: 'n-petal-c', x: 160, y: 176, label: 'Petal node' },
      { id: 'n-petal-d', x: 104, y: 120, label: 'Petal node' },
    ],
    softRequiredNodeIds: ['n-center', 'n-turn-a'],
    hardRequiredNodeIds: ['n-center', 'n-turn-a', 'n-turn-b', 'n-petal-c', 'n-petal-d'],
  },
  'Ruyi Pankou': {
    pathD: 'M 88 152 C 88 96, 120 64, 160 64 C 200 64, 232 96, 232 152 C 232 176, 200 196, 160 196 C 120 196, 88 176, 88 152 Z',
    pathLabel: 'Ruyi path',
    allNodes: [
      { id: 'n-center', x: 160, y: 120, label: 'Center node' },
      { id: 'n-turn-a', x: 120, y: 72, label: 'Curve node' },
      { id: 'n-turn-b', x: 200, y: 72, label: 'Curve node' },
      { id: 'n-loop-a', x: 88, y: 152, label: 'Loop anchor' },
      { id: 'n-loop-b', x: 232, y: 152, label: 'Loop anchor' },
    ],
    softRequiredNodeIds: ['n-center', 'n-turn-a'],
    hardRequiredNodeIds: ['n-center', 'n-turn-a', 'n-turn-b', 'n-loop-a', 'n-loop-b'],
  },
};

export function getPathConfig(type: CraftPankouType): PankouPathConfig {
  return PATH_CONFIGS[type];
}

export function classifyCraftType(material: CoreMaterial): CraftType {
  if (material === 'Soft cotton core' || material === 'Silk cord') {
    return 'Soft Pankou';
  }
  return 'Hard Pankou';
}

export function craftTypeDescription(craftType: CraftType): string {
  if (craftType === 'Soft Pankou') {
    return 'Soft Pankou: soft curves, flexible shaping, restrained fixing.';
  }
  return 'Hard Pankou: stable structure, clear shape, reinforced fixing.';
}

export function nodeFixingStyle(craftType: CraftType): string {
  if (craftType === 'Soft Pankou') {
    return 'Restrained hidden stitching';
  }
  return 'Reinforced fixing points';
}
