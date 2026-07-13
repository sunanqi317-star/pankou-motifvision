export type WrapStage = 'flat' | 'coreInserted' | 'folding' | 'wrapped';

export function isWrapComplete(stage: WrapStage): boolean {
  return stage === 'wrapped';
}
