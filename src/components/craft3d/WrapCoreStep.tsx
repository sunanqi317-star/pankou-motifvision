import { btnExperiencePrimary } from '../ui/experienceStyles';
import type { WrapStage } from './wrapStage';

interface WrapCoreStepProps {
  wrapStage: WrapStage;
  wrapAnimating: boolean;
  onInsertCore: () => void;
  onFoldIntoCord: () => void;
}

export function WrapCoreStep({
  wrapStage,
  wrapAnimating,
  onInsertCore,
  onFoldIntoCord,
}: WrapCoreStepProps) {
  const coreInserted = wrapStage !== 'flat';
  const wrapped = wrapStage === 'wrapped';

  return (
    <>
      <p className="text-sm font-medium text-[#2c2825]">Step 2 — Insert Core &amp; Wrap</p>
      <p className="text-xs text-stone-500">
        Insert a thin metal wire core, then fold the fabric around it to prepare a Pankou cord.
      </p>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">A. Insert Core</p>
        {wrapStage === 'flat' ? (
          <button type="button" onClick={onInsertCore} className={btnExperiencePrimary}>
            Insert Metal Wire Core
          </button>
        ) : (
          <p className="text-xs text-amber-900/80">Metal wire core inserted.</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">B. Wrap Fabric</p>
        {wrapped ? (
          <p className="text-xs text-amber-900/80">Wrapped cord prepared.</p>
        ) : (
          <button
            type="button"
            onClick={onFoldIntoCord}
            disabled={wrapStage === 'flat' || wrapAnimating}
            className={btnExperiencePrimary}
          >
            {wrapAnimating ? 'Folding fabric...' : 'Fold into Wrapped Cord'}
          </button>
        )}
      </div>

      <div className="space-y-1 text-xs text-stone-500">
        <p>Core inserted: {coreInserted ? 'yes' : 'no'}</p>
        <p>Wrapped cord: {wrapped ? 'yes' : 'no'}</p>
      </div>
    </>
  );
}
