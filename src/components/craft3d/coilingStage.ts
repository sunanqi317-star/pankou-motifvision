export type CoilingStage =
  | 'idle'
  | 'centerCord'
  | 'leftSpiral'
  | 'rightSpiral'
  | 'outerPetals'
  | 'centralKnot'
  | 'complete';

/** Ordered segments shown in the Step 3 panel (5 steps). */
export const COILING_SEQUENCE: Exclude<CoilingStage, 'idle' | 'complete'>[] = [
  'centerCord',
  'leftSpiral',
  'rightSpiral',
  'outerPetals',
  'centralKnot',
];

export const COILING_STAGE_LABELS: Record<Exclude<CoilingStage, 'idle' | 'complete'>, string> = {
  centerCord: 'Center connection',
  leftSpiral: 'Left spiral flower',
  rightSpiral: 'Right spiral flower',
  outerPetals: 'Outer petals',
  centralKnot: 'Central knot',
};

export function getNextCoilingStage(stage: CoilingStage): CoilingStage {
  if (stage === 'idle') return 'centerCord';
  const index = COILING_SEQUENCE.indexOf(stage as (typeof COILING_SEQUENCE)[number]);
  if (index < 0 || index >= COILING_SEQUENCE.length - 1) return 'complete';
  return COILING_SEQUENCE[index + 1];
}

export function getCoilingStageIndex(stage: CoilingStage): number {
  if (stage === 'idle') return 0;
  if (stage === 'complete') return COILING_SEQUENCE.length;
  return COILING_SEQUENCE.indexOf(stage) + 1;
}

export function isCoilingStarted(stage: CoilingStage): boolean {
  return stage !== 'idle';
}

export function isCoilingFinished(stage: CoilingStage): boolean {
  return stage === 'complete';
}
