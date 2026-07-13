/**
 * Step 3 click-coiling configuration.
 * Adjust correctPathOrder or animationStages to match your Illustrator export.
 */
export interface AnimationStage {
  id: 'left-side' | 'center-knot' | 'right-side';
  label: string;
  instruction: string;
  playingFeedback: string;
  pathIds: readonly string[];
}

export const animationStages: readonly AnimationStage[] = [
  {
    id: 'left-side',
    label: 'Coil the left floral end',
    instruction: 'Guide the wrapped cord into the left floral structure.',
    playingFeedback: 'Coiling the left floral end…',
    pathIds: ['path1', 'path2', 'path3', 'path4'],
  },
  {
    id: 'center-knot',
    label: 'Form the central knot',
    instruction: 'Shape and tighten the central knot.',
    playingFeedback: 'Forming the central knot…',
    pathIds: ['path5'],
  },
  {
    id: 'right-side',
    label: 'Coil the right floral end',
    instruction: 'Repeat the coiling process on the right side to complete the Pankou.',
    playingFeedback: 'Completing the right floral end…',
    pathIds: ['path6', 'path7', 'path8', 'path9', 'path10', 'path11'],
  },
] as const;

export const ALL_PATH_IDS = [
  'path1',
  'path2',
  'path3',
  'path4',
  'path5',
  'path6',
  'path7',
  'path8',
  'path9',
  'path10',
  'path11',
] as const;

/** Required click order for the Step 3 coiling mini-game. */
export const correctPathOrder: readonly string[] = [...ALL_PATH_IDS];

export const ANIMATION_PATH_ORDER = correctPathOrder;

export const PANKOU_PATH_COUNT = correctPathOrder.length;

export const STAGE_COUNT = animationStages.length;

export const COIL_COMPLETE_MESSAGE = 'The hard floral Pankou structure is complete.';

export const WRONG_PATH_HINT =
  'This is not the next coiling segment. Follow the highlighted guide.';

export type PankouSvgPathId = (typeof ALL_PATH_IDS)[number];

export function getCurrentTargetPathId(completedPathCount: number): string | null {
  return correctPathOrder[completedPathCount] ?? null;
}

export function getStageForPathId(pathId: string): AnimationStage | null {
  return animationStages.find((stage) => stage.pathIds.includes(pathId)) ?? null;
}

export function getStageEndPathCount(stageIndex: number): number {
  let count = 0;
  for (let i = 0; i <= stageIndex; i += 1) {
    count += animationStages[i]?.pathIds.length ?? 0;
  }
  return count;
}

export function getCurrentStageIndex(completedPathCount: number): number {
  for (let i = 0; i < animationStages.length; i += 1) {
    if (completedPathCount < getStageEndPathCount(i)) return i;
  }
  return animationStages.length - 1;
}

export function isStageComplete(stageIndex: number, completedPathCount: number): boolean {
  return completedPathCount >= getStageEndPathCount(stageIndex);
}

export function getClickGameInstruction(completedPathCount: number, coiled: boolean): string {
  if (coiled) return COIL_COMPLETE_MESSAGE;

  const target = getCurrentTargetPathId(completedPathCount);
  if (!target) return COIL_COMPLETE_MESSAGE;

  const stage = getStageForPathId(target);
  if (completedPathCount === 0) {
    return `Click ${target} on the operation table to begin coiling the left floral end.`;
  }

  return stage
    ? `${stage.instruction} Next segment: ${target}.`
    : `Click ${target} on the operation table to continue coiling.`;
}

export function getPathIndex(pathId: string): number {
  return correctPathOrder.indexOf(pathId);
}

export function dashOffsetForProgress(pathLength: number, progress: number): number {
  return pathLength * (1 - Math.max(0, Math.min(1, progress)));
}
