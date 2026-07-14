export type ReconstructionModelId = 'hudie' | 'san';

export type EulerRotation = readonly [number, number, number];

export interface ReconstructionModelTransform {
  name: string;
  path: string;
  /** Initial Euler rotation in radians [x, y, z] — faces the decorative front toward the camera. */
  rotation: EulerRotation;
  scale: number;
}

export interface ReconstructionModelConfig extends ReconstructionModelTransform {
  id: ReconstructionModelId;
  chineseName: string;
  referenceImage: string;
  specs: { label: string; value: string }[];
}

/**
 * Reusable Pankou reconstruction model mapping — kept separate from rendering.
 * Rotation is applied in the viewer (GLB files are left unchanged).
 *
 * Per-model `rotation` [x, y, z] in radians — face the brighter decorative side toward the camera.
 */
export const models = {
  hudie: {
    name: 'Hudie Knot',
    path: '/assets/models/hudie.glb',
    rotation: [0, Math.PI / 2, 0] as EulerRotation,
    scale: 1,
  },
  san: {
    name: 'San Knot',
    path: '/assets/models/san.glb',
    // Brighter detailed face toward camera (180° Y from prior backside-forward pose)
    rotation: [0, Math.PI / 2, 0] as EulerRotation,
    scale: 1,
  },
} as const satisfies Record<ReconstructionModelId, ReconstructionModelTransform>;

export const RECONSTRUCTION_MODELS: ReconstructionModelConfig[] = [
  {
    id: 'hudie',
    name: models.hudie.name,
    path: models.hudie.path,
    rotation: models.hudie.rotation,
    scale: models.hudie.scale,
    chineseName: '蝴蝶扣',
    referenceImage: '/images/panhua.png',
    specs: [
      { label: 'Skeleton Type', value: 'Continuous loop' },
      { label: 'Craft Category', value: 'Hard flower knot (Panhua)' },
      { label: 'Structural Logic', value: 'Radial petal assembly' },
    ],
  },
  {
    id: 'san',
    name: models.san.name,
    path: models.san.path,
    rotation: models.san.rotation,
    scale: models.san.scale,
    chineseName: '三扣',
    referenceImage: '/images/yizi.png',
    specs: [
      { label: 'Skeleton Type', value: 'Linear-axis' },
      { label: 'Craft Category', value: 'Soft flower knot' },
      { label: 'Structural Logic', value: 'Single-axis cord loop' },
    ],
  },
];

export const DEFAULT_RECONSTRUCTION_MODEL: ReconstructionModelId = 'hudie';

export function getReconstructionModel(
  id: ReconstructionModelId,
): ReconstructionModelConfig {
  return RECONSTRUCTION_MODELS.find((model) => model.id === id) ?? RECONSTRUCTION_MODELS[0];
}
