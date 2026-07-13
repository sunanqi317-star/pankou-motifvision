import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelectedSpecimen } from '../../context/SelectedSpecimenContext';
import type { CraftType } from '../../utils/craftGame';
import { PortfolioSection } from '../PortfolioSection';
import {
  btnExperiencePrimary,
  btnExperienceSecondary,
  btnExperienceWarm,
  craftCanvasCard,
  craftCanvasColumn,
  craftLayout,
  stepControlPanel,
  experienceCard,
} from '../ui/experienceStyles';
import {
  canContinueStep,
  clampStepAfterReset,
  CRAFT_STEPS,
  getStepContinueHint,
  getStepNextHelper,
  getStepNextLabel,
  type CraftStepName,
  type CraftProgress,
  type Shaping,
} from './craftNavigation';
import { DEFAULT_PREVIEW_COLOR } from './FabricThumbnail';
import { easeInOutCubic } from './animationEasing';
import { FabricMaterialStep } from './FabricMaterialStep';
import {
  applyMaterialProfile,
  craftTypeForFabric,
  getFabricMaterial,
  NEUTRAL_SAMPLE_COLOR,
  normalizeFabricType,
  type FabricColorSwatch,
  type FabricTypeId,
} from './fabricMaterials';
import { getRenderedFabricColor } from './fabricMaterialFactory';
import { CanvasOverlays, getFabricDisplayName } from './CanvasOverlays';
import { CoilPathStep } from './CoilPathStep';
import { PankouScene, type Craft3DStep } from './PankouScene';
import { getHardFloralCoilPath } from './pankouCurves';
import { SvgPankouCoilOverlay } from './SvgPankouCoilOverlay';
import {
  correctPathOrder,
  getCurrentTargetPathId,
  PANKOU_PATH_COUNT,
  WRONG_PATH_HINT,
} from './pankouSvgLoader';
import { WrapCoreStep } from './WrapCoreStep';
import type { WrapStage } from './wrapStage';

function stepToScene(step: number, completed: boolean): Craft3DStep {
  if (completed) return 'complete';
  const map: Record<number, Craft3DStep> = {
    1: 'material',
    2: 'wrap',
    3: 'coil',
    4: 'fix',
    5: 'shape',
    6: 'assemble',
  };
  return map[step] ?? 'material';
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
        active
          ? 'border-amber-900/40 bg-amber-50 text-amber-950'
          : 'border-stone-200 bg-white text-stone-600 hover:border-amber-900/20'
      }`}
    >
      {children}
    </button>
  );
}

export function CraftExperience3D() {
  const { selectedSpecimen } = useSelectedSpecimen();

  const [step, setStep] = useState(1);
  const [selectedFabricType, setSelectedFabricType] = useState<FabricTypeId | null>(null);
  const [selectedFabricColor, setSelectedFabricColor] = useState<FabricColorSwatch | null>(null);
  const [wrapStage, setWrapStage] = useState<WrapStage>('flat');
  const [wrapProgress, setWrapProgress] = useState(0);
  const [wrapAnimating, setWrapAnimating] = useState(false);
  const [wrapped, setWrapped] = useState(false);
  const [completedPathCount, setCompletedPathCount] = useState(0);
  const [animatingPathId, setAnimatingPathId] = useState<string | null>(null);
  const [pathProgress, setPathProgress] = useState(0);
  const [coilAnimating, setCoilAnimating] = useState(false);
  const [coilReplaying, setCoilReplaying] = useState(false);
  const [coiled, setCoiled] = useState(false);
  const [coilDebugMode, setCoilDebugMode] = useState(false);
  const [coilErrorHint, setCoilErrorHint] = useState<string | null>(null);
  const [coilHintActive, setCoilHintActive] = useState(false);
  const [errorFlashPathId, setErrorFlashPathId] = useState<string | null>(null);
  const [fixedNodeIds, setFixedNodeIds] = useState<Set<string>>(new Set());
  const [shaping, setShaping] = useState<Shaping | null>(null);
  const [assembled, setAssembled] = useState(false);
  const [completed, setCompleted] = useState(false);

  const animTokenRef = useRef(0);
  const prevPankouTypeRef = useRef(selectedSpecimen.pankouType);

  const appliedMaterial =
    selectedFabricType && selectedFabricColor
      ? applyMaterialProfile(normalizeFabricType(selectedFabricType), selectedFabricColor)
      : null;
  const previewFabric = selectedFabricType
    ? getFabricMaterial(normalizeFabricType(selectedFabricType))
    : null;
  const selectedFabric = appliedMaterial?.fabric ?? previewFabric;
  const selectedFabricColorHex =
    appliedMaterial?.colorHex ??
    (selectedFabricType ? NEUTRAL_SAMPLE_COLOR : DEFAULT_PREVIEW_COLOR);
  const selectedFabricTextureStyle =
    appliedMaterial?.materialStyle ??
    previewFabric?.materialStyle ??
    getFabricMaterial('cotton').materialStyle;

  const safeFabricType = normalizeFabricType(selectedFabricType);
  const renderedFabricColor = useMemo(
    () => getRenderedFabricColor(selectedFabricColorHex),
    [selectedFabricColorHex],
  );

  const craftType: CraftType | null = selectedFabricType
    ? craftTypeForFabric(safeFabricType)
    : null;
  const curveConfig = useMemo(() => getHardFloralCoilPath(), []);

  const requiredNodeIds =
    craftType === 'Hard Pankou' ? curveConfig.hardNodeIds : curveConfig.softNodeIds;
  const nodesFixed = requiredNodeIds.every((id) => fixedNodeIds.has(id));

  const sceneStep = stepToScene(step, completed);
  const hasFabricSelected = Boolean(selectedFabricType);
  const hasColorSelected = Boolean(selectedFabricColor);

  const cancelAnimations = useCallback(() => {
    animTokenRef.current += 1;
    setWrapAnimating(false);
    setCoilAnimating(false);
    setAnimatingPathId(null);
    setPathProgress(0);
  }, []);

  const resetAssembly = useCallback(() => {
    setAssembled(false);
    setCompleted(false);
  }, []);

  const resetShapeAndAfter = useCallback(() => {
    setShaping(null);
    resetAssembly();
  }, [resetAssembly]);

  const resetFixAndAfter = useCallback(() => {
    setFixedNodeIds(new Set());
    resetShapeAndAfter();
  }, [resetShapeAndAfter]);

  const resetCoilAndAfter = useCallback(() => {
    cancelAnimations();
    setCompletedPathCount(0);
    setAnimatingPathId(null);
    setPathProgress(0);
    setCoilReplaying(false);
    setCoiled(false);
    setCoilErrorHint(null);
    setCoilHintActive(false);
    setErrorFlashPathId(null);
    resetFixAndAfter();
  }, [cancelAnimations, resetFixAndAfter]);

  const resetWrapAndAfter = useCallback(() => {
    cancelAnimations();
    setWrapStage('flat');
    setWrapProgress(0);
    setWrapped(false);
    resetCoilAndAfter();
  }, [cancelAnimations, resetCoilAndAfter]);

  const resetAfterStep = useCallback(
    (stepName: CraftStepName, options?: { clampStep?: boolean }) => {
      switch (stepName) {
        case 'Material':
        case 'Wrap':
          resetWrapAndAfter();
          break;
        case 'Coil':
          resetCoilAndAfter();
          break;
        case 'Fix':
          resetFixAndAfter();
          break;
        case 'Shape':
          resetAssembly();
          break;
        case 'Assemble':
          break;
      }

      if (options?.clampStep) {
        const maxStep = clampStepAfterReset(stepName);
        setStep((current) => Math.min(current, maxStep));
      }
    },
    [resetWrapAndAfter, resetCoilAndAfter, resetFixAndAfter, resetAssembly],
  );

  const restartCraft = useCallback(() => {
    cancelAnimations();
    setStep(1);
    setSelectedFabricType(null);
    setSelectedFabricColor(null);
    setWrapStage('flat');
    setWrapProgress(0);
    setWrapped(false);
    setCompletedPathCount(0);
    setAnimatingPathId(null);
    setPathProgress(0);
    setCoilReplaying(false);
    setCoiled(false);
    setCoilErrorHint(null);
    setCoilHintActive(false);
    setErrorFlashPathId(null);
    setCoilDebugMode(false);
    setFixedNodeIds(new Set());
    setShaping(null);
    setAssembled(false);
    setCompleted(false);
  }, [cancelAnimations]);

  const canContinue = useCallback(() => {
    return canContinueStep(step, {
      selectedFabricType,
      selectedFabricColor: selectedFabricColor?.name ?? null,
      wrapStage,
      wrapped,
      coiled,
      nodesFixed,
      shaping,
      assembled,
      wrapAnimating,
      coilAnimating,
    });
  }, [
    step,
    selectedFabricType,
    selectedFabricColor,
    wrapStage,
    wrapped,
    coiled,
    nodesFixed,
    shaping,
    assembled,
    wrapAnimating,
    coilAnimating,
  ]);

  const goBack = useCallback(() => {
    if (completed) {
      setCompleted(false);
      return;
    }
    if (step <= 1) return;

    if (step === 2 && wrapAnimating) {
      cancelAnimations();
      setWrapProgress(0);
      setWrapStage('coreInserted');
      setWrapped(false);
    }
    if (step === 3 && coilAnimating) {
      cancelAnimations();
      setPathProgress(0);
      setAnimatingPathId(null);
      if (completedPathCount === 0) {
        setCoiled(false);
      }
    }

    setStep((current) => current - 1);
  }, [completed, step, wrapAnimating, coilAnimating, completedPathCount, cancelAnimations]);

  const goNext = useCallback(() => {
    if (!canContinue()) return;

    if (step === 6) {
      setCompleted(true);
      return;
    }

    setStep((current) => Math.min(current + 1, CRAFT_STEPS.length));
  }, [canContinue, step]);

  useEffect(() => {
    if (prevPankouTypeRef.current === selectedSpecimen.pankouType) return;
    prevPankouTypeRef.current = selectedSpecimen.pankouType;
    resetAfterStep('Coil', { clampStep: true });
  }, [selectedSpecimen.pankouType, resetAfterStep]);

  const handleSelectFabric = (id: FabricTypeId) => {
    if (id !== selectedFabricType) {
      setSelectedFabricType(id);
      resetAfterStep('Material', { clampStep: true });
    }
  };

  const handleSelectColor = (swatch: FabricColorSwatch) => {
    const colorChanged = selectedFabricColor?.name !== swatch.name;
    setSelectedFabricColor(swatch);
    if (colorChanged && (wrapped || coiled || fixedNodeIds.size > 0 || shaping || assembled)) {
      resetAfterStep('Material', { clampStep: true });
    }
  };

  const handleInsertCore = useCallback(() => {
    if (wrapStage !== 'flat') return;
    setWrapStage('coreInserted');
  }, [wrapStage]);

  const handleFoldIntoCord = useCallback(() => {
    if (wrapStage !== 'coreInserted') return;
    cancelAnimations();
    setWrapStage('folding');
    setWrapAnimating(true);
    setWrapProgress(0);
    setWrapped(false);
    const token = animTokenRef.current;
    const start = performance.now();
    const duration = 1600;

    const tick = (now: number) => {
      if (token !== animTokenRef.current) return;
      const linear = Math.min(1, (now - start) / duration);
      const t = easeInOutCubic(linear);
      setWrapProgress(t);
      if (linear < 1) requestAnimationFrame(tick);
      else {
        setWrapAnimating(false);
        setWrapStage('wrapped');
        setWrapped(true);
        setWrapProgress(1);
      }
    };
    requestAnimationFrame(tick);
  }, [wrapStage, cancelAnimations]);

  const animatePathDraw = useCallback(
    (pathId: string, onComplete: () => void) => {
      setAnimatingPathId(pathId);
      setPathProgress(0);
      setCoilAnimating(true);
      const token = animTokenRef.current;
      const start = performance.now();
      const duration = 900;

      const tick = (now: number) => {
        if (token !== animTokenRef.current) return;
        const linear = Math.min(1, (now - start) / duration);
        setPathProgress(easeInOutCubic(linear));
        if (linear < 1) {
          requestAnimationFrame(tick);
          return;
        }

        setPathProgress(1);
        setAnimatingPathId(null);
        setCoilAnimating(false);
        onComplete();
      };

      requestAnimationFrame(tick);
    },
    [],
  );

  const handlePathClick = useCallback(
    (pathId: string) => {
      if (coilDebugMode || coilAnimating || coilReplaying || coiled) return;

      const expected = getCurrentTargetPathId(completedPathCount);
      if (!expected) return;

      if (pathId !== expected) {
        setCoilErrorHint(WRONG_PATH_HINT);
        setErrorFlashPathId(pathId);
        window.setTimeout(() => setErrorFlashPathId(null), 700);
        return;
      }

      setCoilErrorHint(null);
      animatePathDraw(pathId, () => {
        const nextCount = completedPathCount + 1;
        setCompletedPathCount(nextCount);
        if (nextCount >= PANKOU_PATH_COUNT) {
          setCoiled(true);
        }
      });
    },
    [
      coilDebugMode,
      coilAnimating,
      coilReplaying,
      coiled,
      completedPathCount,
      animatePathDraw,
    ],
  );

  const handleShowCoilHint = useCallback(() => {
    if (coiled || coilAnimating || coilReplaying) return;
    setCoilHintActive(true);
    window.setTimeout(() => setCoilHintActive(false), 2200);
  }, [coiled, coilAnimating, coilReplaying]);

  const handleReplayCompleted = useCallback(() => {
    if (completedPathCount === 0 || coilAnimating || coilReplaying) return;

    cancelAnimations();
    setCoilReplaying(true);

    const pathsToReplay = correctPathOrder.slice(0, completedPathCount);
    let index = 0;

    const replayNext = () => {
      if (index >= pathsToReplay.length) {
        setCoilReplaying(false);
        return;
      }

      const pathId = pathsToReplay[index];
      index += 1;
      animatePathDraw(pathId, replayNext);
    };

    replayNext();
  }, [completedPathCount, coilAnimating, coilReplaying, cancelAnimations, animatePathDraw]);

  const handleToggleCoilDebugMode = useCallback(() => {
    setCoilDebugMode((value) => !value);
  }, []);

  const handleResetCoil = useCallback(() => {
    if (coilAnimating || coilReplaying) return;
    resetCoilAndAfter();
  }, [coilAnimating, coilReplaying, resetCoilAndAfter]);

  const handleAssemble = () => {
    setAssembled(true);
  };

  const handleShaping = (value: Shaping) => {
    if (shaping !== value) {
      setShaping(value);
      if (assembled || completed) {
        resetAfterStep('Shape');
      }
    }
  };

  const handleNodeClick = (id: string) => {
    setFixedNodeIds((prev) => new Set([...prev, id]));
  };

  const craftProgress: CraftProgress = {
    selectedFabricType,
    selectedFabricColor: selectedFabricColor?.name ?? null,
    wrapStage,
    wrapped,
    coiled,
    nodesFixed,
    shaping,
    assembled,
    wrapAnimating,
    coilAnimating,
  };
  const stepComplete = canContinue();
  const continueHint = !completed ? getStepContinueHint(step, craftProgress) : null;
  const showBack = step > 1 || completed;
  const nextLabel = getStepNextLabel(step, stepComplete);
  const nextHelper = getStepNextHelper(step, stepComplete);
  const nextButtonClass = step === 1 ? btnExperienceWarm : btnExperiencePrimary;
  const isStep1Layout = step === 1 && !completed;

  const craftWorkspace = (
    <div className={`${craftCanvasCard} operation-table${step === 3 ? ' craft-canvas-card--coil' : ''}`}>
      <div className="operation-table-surface">
        <PankouScene
          curveConfig={curveConfig}
          craftType={craftType}
          step={sceneStep}
          wrapProgress={wrapStage === 'wrapped' ? 1 : wrapProgress}
          wrapStage={wrapStage}
          coilAnimating={coilAnimating}
          coiled={coiled}
          svgCoilActive={step === 3 || completedPathCount > 0 || coiled || coilAnimating}
          guidePoints={curveConfig.points}
          fixedNodeIds={fixedNodeIds}
          onNodeClick={handleNodeClick}
          shaping={shaping}
          showClasp={assembled}
          showLoop={assembled}
          fabricColor={renderedFabricColor}
          fabricStyle={selectedFabricTextureStyle}
          fabricType={safeFabricType}
          hasFabricSelected={hasFabricSelected}
          hasColorSelected={hasColorSelected}
        />
      </div>
      {(step === 3 || (step > 3 && coiled)) && (
        <SvgPankouCoilOverlay
          forceTableDebug
          debugMode={coilDebugMode}
          strokeColor={selectedFabricColorHex}
          fabricType={selectedFabricType}
          completedPathCount={coiled ? PANKOU_PATH_COUNT : completedPathCount}
          animatingPathId={animatingPathId}
          pathProgress={pathProgress}
          hintActive={coilHintActive}
          errorFlashPathId={errorFlashPathId}
          interactive={step === 3 && !coilDebugMode && !coiled && !coilReplaying}
          onPathClick={handlePathClick}
          visible
        />
      )}
      <CanvasOverlays
        step={step}
        completed={completed}
        fabricType={selectedFabricType}
        fabricName={selectedFabricType ? getFabricDisplayName(selectedFabricType) : null}
        colorName={selectedFabricColor?.name ?? null}
        hasFabricSelected={hasFabricSelected}
        hasColorSelected={hasColorSelected}
      />
    </div>
  );

  const stepNavigation = !completed && (
    <div className="space-y-2 border-t border-stone-100 pt-4">
      {nextHelper && <p className="text-[11px] text-stone-500">{nextHelper}</p>}
      <div className="flex flex-wrap items-center gap-3">
        {showBack && (
          <button type="button" onClick={goBack} className={btnExperienceSecondary}>
            Back
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          disabled={!stepComplete}
          className={nextButtonClass}
        >
          {nextLabel}
        </button>
      </div>
      {continueHint && <p className="text-xs text-stone-500">{continueHint}</p>}
    </div>
  );

  const craftFooter = (
    <div
      className={`flex items-center border-t border-stone-100/80 pt-3 ${
        isStep1Layout ? 'justify-end' : 'justify-between gap-4'
      }`}
    >
      {!isStep1Layout && (
        <p className="min-w-0 text-[11px] text-stone-400">
          {completed
            ? 'Craft experience complete.'
            : stepComplete
              ? `Step ${step} ready — continue when you are.`
              : continueHint ?? `Step ${step} in progress.`}
        </p>
      )}
      <button
        type="button"
        onClick={restartCraft}
        className="shrink-0 text-[10px] text-stone-400 underline-offset-2 transition-colors hover:text-[#8e5b38] hover:underline"
      >
        Restart Craft Experience
      </button>
    </div>
  );

  return (
    <PortfolioSection
      id="make-pankou"
      title="3D Craft Experience: Make a Pankou"
      subtitle="Click through the basic Pankou making process in an interactive 3D workspace."
      tone="warm"
    >
      <div className="space-y-6">
        <nav aria-label="3D craft progress">
          <ol className="flex flex-wrap gap-2">
            {CRAFT_STEPS.map((label, i) => {
              const n = i + 1;
              const done = n < step || (n === 6 && completed);
              const active = step === n && !completed;
              return (
                <li
                  key={label}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    done
                      ? 'bg-amber-900/90 text-white'
                      : active
                        ? 'bg-amber-100 text-amber-950 ring-1 ring-amber-900/20'
                        : 'bg-white text-stone-500'
                  }`}
                >
                  {n}. {label}
                </li>
              );
            })}
          </ol>
        </nav>

        {!completed ? (
          <div className={craftLayout}>
            <div className={craftCanvasColumn}>{craftWorkspace}</div>
            <div className={`${experienceCard} ${stepControlPanel} space-y-4 p-5 lg:p-7`}>
              {isStep1Layout ? (
                <>
                  <FabricMaterialStep
                    selectedFabricType={selectedFabricType}
                    selectedFabricColor={selectedFabricColor}
                    onSelectFabric={handleSelectFabric}
                    onSelectColor={handleSelectColor}
                    compact
                  />
                  {selectedFabricType && selectedFabricColor && (
                    <p className="text-[11px] text-stone-600">
                      Selected: {getFabricDisplayName(selectedFabricType)} ·{' '}
                      {selectedFabricColor.name}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {step === 2 && (
                    <WrapCoreStep
                      wrapStage={wrapStage}
                      wrapAnimating={wrapAnimating}
                      onInsertCore={handleInsertCore}
                      onFoldIntoCord={handleFoldIntoCord}
                    />
                  )}

                  {step === 3 && (
                    <CoilPathStep
                      completedPathCount={completedPathCount}
                      isCoilComplete={coiled}
                      isAnimating={coilAnimating}
                      isReplaying={coilReplaying}
                      debugMode={coilDebugMode}
                      errorHint={coilErrorHint}
                      hintActive={coilHintActive}
                      onToggleDebugMode={handleToggleCoilDebugMode}
                      onShowHint={handleShowCoilHint}
                      onReplayCompleted={handleReplayCompleted}
                      onReset={handleResetCoil}
                    />
                  )}

                  {step === 4 && (
                    <>
                      <p className="text-sm font-medium text-[#2c2825]">Step 4 — Fix</p>
                      <p className="text-xs text-stone-500">
                        Click each key node in the 3D view ({fixedNodeIds.size}/{requiredNodeIds.length}{' '}
                        fixed).
                        {craftType === 'Soft Pankou'
                          ? ' Soft Pankou requires 3 nodes.'
                          : ` Hard Pankou requires ${requiredNodeIds.length} nodes.`}
                      </p>
                      {nodesFixed && (
                        <p className="text-xs text-amber-900/80">Key nodes secured.</p>
                      )}
                    </>
                  )}

                  {step === 5 && (
                    <>
                      <p className="text-sm font-medium text-[#2c2825]">Step 5 — Shape</p>
                      <p className="text-xs text-stone-500">Choose how to shape the finished form.</p>
                      <div className="flex flex-wrap gap-2">
                        <Chip active={shaping === 'soft'} onClick={() => handleShaping('soft')}>
                          Soft shaping
                        </Chip>
                        <Chip active={shaping === 'strong'} onClick={() => handleShaping('strong')}>
                          Strong shaping
                        </Chip>
                      </div>
                      {shaping && (
                        <p className="text-xs text-amber-900/80">The Pankou is shaped.</p>
                      )}
                    </>
                  )}

                  {step === 6 && (
                    <>
                      <p className="text-sm font-medium text-[#2c2825]">Step 6 — Assemble</p>
                      <p className="text-xs text-stone-500">
                        Add clasp and loop fastening to complete the Pankou.
                      </p>
                      {!assembled ? (
                        <button type="button" onClick={handleAssemble} className={btnExperiencePrimary}>
                          Add Clasp and Loop
                        </button>
                      ) : (
                        <p className="text-xs text-amber-900/80">Clasp and loop attached.</p>
                      )}
                    </>
                  )}
                </>
              )}

              {stepNavigation}
              {craftFooter}
            </div>
          </div>
        ) : (
          <div className={craftLayout}>
            <div className={craftCanvasColumn}>{craftWorkspace}</div>
            <div className={`${experienceCard} ${stepControlPanel} space-y-4 p-5 lg:p-7`}>
              {selectedFabric && selectedFabricColor && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <span className="rounded-full border border-amber-900/25 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-950">
                      Pankou Completed
                    </span>
                  </div>
                  <div className="grid gap-3 text-xs">
                    {[
                      ['Selected Pankou type', selectedSpecimen.pankouTypeLabel],
                      ['Craft type', craftType],
                      ['Fabric material', selectedFabric.name],
                      ['Fabric color', selectedFabricColor.name],
                      ['Coiling path', curveConfig.pathLabel],
                      ['Fixed node count', `${fixedNodeIds.size}`],
                      ['Shaping method', shaping === 'soft' ? 'Soft shaping' : 'Strong shaping'],
                      ['Assembly', 'Clasp and loop completed'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-stone-100 bg-[#faf8f4] px-3 py-2">
                        <dt className="text-stone-500">{label}</dt>
                        <dd className="mt-0.5 font-medium text-[#2c2825]">{value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-stone-100 pt-4">
                <button type="button" onClick={goBack} className={btnExperienceSecondary}>
                  Back
                </button>
              </div>
              {craftFooter}
            </div>
          </div>
        )}
      </div>
    </PortfolioSection>
  );
}
