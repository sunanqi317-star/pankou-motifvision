import {
  btnExperienceReset,
  btnExperienceSecondary,
} from '../ui/experienceStyles';
import {
  animationStages,
  COIL_COMPLETE_MESSAGE,
  getClickGameInstruction,
  getCurrentStageIndex,
  getCurrentTargetPathId,
  PANKOU_PATH_COUNT,
  WRONG_PATH_HINT,
} from './pankouSvgLoader';

interface CoilPathStepProps {
  completedPathCount: number;
  isCoilComplete: boolean;
  isAnimating: boolean;
  isReplaying: boolean;
  debugMode: boolean;
  errorHint: string | null;
  hintActive: boolean;
  onToggleDebugMode: () => void;
  onShowHint: () => void;
  onReplayCompleted: () => void;
  onReset: () => void;
}

export function CoilPathStep({
  completedPathCount,
  isCoilComplete,
  isAnimating,
  isReplaying,
  debugMode,
  errorHint,
  hintActive,
  onToggleDebugMode,
  onShowHint,
  onReplayCompleted,
  onReset,
}: CoilPathStepProps) {
  const progressPercent = Math.round((completedPathCount / PANKOU_PATH_COUNT) * 100);
  const currentStage = animationStages[getCurrentStageIndex(completedPathCount)];
  const currentTarget = getCurrentTargetPathId(completedPathCount);
  const instruction = getClickGameInstruction(completedPathCount, isCoilComplete);

  return (
    <>
      <p className="text-sm font-medium text-[#2c2825]">Step 3 — Coil the Floral Pankou</p>
      <p className="text-xs text-stone-500">
        Click each hand-traced path segment on the operation table in the correct coiling order.
      </p>

      <label className="flex items-center gap-2 text-xs text-stone-600">
        <input
          type="checkbox"
          checked={debugMode}
          onChange={onToggleDebugMode}
          className="rounded border-stone-300"
        />
        Debug mode (green centerlines + path labels)
      </label>

      {debugMode ? (
        <p className="rounded-lg border border-emerald-200/80 bg-emerald-50/70 px-3 py-2 text-xs text-emerald-900">
          Debug view: all paths shown as thin green lines with path1–path11 labels. Uncheck to play
          the click-coiling game.
        </p>
      ) : (
        <>
          <div className="rounded-lg border border-amber-900/10 bg-[#faf6ef] px-3 py-2 text-xs text-amber-950">
            <p className="font-medium">{currentStage?.label ?? 'Coil the Pankou'}</p>
            <p className="mt-1 text-stone-600">{instruction}</p>
            {!isCoilComplete && currentTarget && (
              <p className="mt-1 text-[11px] font-medium text-amber-900/90">
                Current target: {currentTarget}
                {hintActive ? ' (highlighted on table)' : ''}
              </p>
            )}
            {errorHint && (
              <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-red-800">
                {errorHint}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onShowHint}
              disabled={isCoilComplete || isAnimating || isReplaying || debugMode}
              className={btnExperienceSecondary}
            >
              Show Hint
            </button>
            <button
              type="button"
              onClick={onReplayCompleted}
              disabled={completedPathCount === 0 || isAnimating || isReplaying}
              className={btnExperienceSecondary}
            >
              {isReplaying ? 'Replaying…' : 'Replay Completed'}
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={isAnimating || isReplaying}
              className={btnExperienceReset}
            >
              Reset Coiling
            </button>
          </div>

          <p className="text-xs text-stone-500">
            Progress: {progressPercent}% ({completedPathCount} / {PANKOU_PATH_COUNT} paths)
          </p>

          {isCoilComplete && (
            <p className="text-xs text-amber-900/80">{COIL_COMPLETE_MESSAGE} Continue to Step 4.</p>
          )}

          {!isCoilComplete && !isAnimating && (
            <p className="text-[11px] text-stone-500">{WRONG_PATH_HINT}</p>
          )}
        </>
      )}
    </>
  );
}
