import type { WrapStage } from './wrapStage';

export const CRAFT_STEPS = ['Material', 'Wrap', 'Coil', 'Fix', 'Shape', 'Assemble'] as const;

export type CraftStepName = (typeof CRAFT_STEPS)[number];

export type Shaping = 'soft' | 'strong';

export interface CraftProgress {
  selectedFabricType: string | null;
  selectedFabricColor: string | null;
  wrapStage: WrapStage;
  wrapped: boolean;
  coiled: boolean;
  nodesFixed: boolean;
  shaping: Shaping | null;
  assembled: boolean;
  wrapAnimating: boolean;
  coilAnimating: boolean;
}

export function stepIndex(stepName: CraftStepName): number {
  return CRAFT_STEPS.indexOf(stepName);
}

/** Step-specific hint when Next is disabled; null when the user may continue. */
export function getStepContinueHint(step: number, progress: CraftProgress): string | null {
  if (canContinueStep(step, progress)) return null;
  if (progress.wrapAnimating || progress.coilAnimating) {
    return 'Please wait for the current animation to finish.';
  }

  switch (step) {
    case 1:
      return 'Choose one fabric and one color to continue.';
    case 2:
      if (progress.wrapStage === 'flat') return 'Insert the metal wire core to continue.';
      if (progress.wrapStage === 'coreInserted') return 'Press “Fold into Wrapped Cord” to continue.';
      return 'Complete the folding animation to continue.';
    case 3:
      if (!progress.coiled) return 'Click each path segment in order on the operation table to continue.';
      return null;
    case 4:
      return 'Fix all key nodes in the 3D view to continue.';
    case 5:
      return 'Choose a shaping method to continue.';
    case 6:
      return 'Add clasp and loop to complete the Pankou.';
    default:
      return 'Complete the current step to continue.';
  }
}

export function getStepNextLabel(step: number, canContinue: boolean): string {
  if (step === 1 && canContinue) return 'Continue to Wrap';
  if (step === 2 && canContinue) return 'Continue to Coil';
  if (step === 3 && canContinue) return 'Continue to Fix';
  if (step === 6) return 'Finish';
  return 'Next';
}

/** Optional helper shown when the user may advance from a step. */
export function getStepNextHelper(step: number, canContinue: boolean): string | null {
  if (!canContinue) return null;
  if (step === 1) return 'Next: insert a core and wrap the fabric into a cord.';
  if (step === 2 && canContinue) return 'Next: coil the cord into the hard floral Pankou.';
  if (step === 3 && canContinue) return 'Next: fix key nodes on the coiled shape.';
  return null;
}

export function canContinueStep(step: number, progress: CraftProgress): boolean {
  if (progress.wrapAnimating || progress.coilAnimating) return false;

  switch (step) {
    case 1:
      return Boolean(progress.selectedFabricType && progress.selectedFabricColor);
    case 2:
      return progress.wrapStage === 'wrapped' && progress.wrapped;
    case 3:
      return progress.coiled;
    case 4:
      return progress.nodesFixed;
    case 5:
      return progress.shaping !== null;
    case 6:
      return progress.assembled;
    default:
      return false;
  }
}

/** Highest step the user may remain on after resetting from a given step. */
export function clampStepAfterReset(fromStep: CraftStepName): number {
  switch (fromStep) {
    case 'Material':
      return 1;
    case 'Wrap':
      return 2;
    case 'Coil':
      return 3;
    case 'Fix':
      return 4;
    case 'Shape':
      return 5;
    case 'Assemble':
      return 6;
    default:
      return 1;
  }
}
