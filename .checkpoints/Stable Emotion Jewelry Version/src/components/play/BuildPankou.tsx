import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { usePlaySession } from '../../context/PlaySessionContext';
import { averageScore, feedbackMessage, scoreAssembly } from '../../utils/assemblyScoring';
import { craftButton, craftCard, craftPanel } from '../ui/craftStyles';

function DraggableComponent({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 shadow-sm active:cursor-grabbing ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      {label}
    </div>
  );
}

function DropSlot({
  slotId,
  label,
  placedLabel,
}: {
  slotId: string;
  label: string;
  placedLabel?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: slotId });
  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[52px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-2 py-2 text-center transition ${
        isOver
          ? 'border-amber-500 bg-amber-50'
          : placedLabel
            ? 'border-amber-400 bg-amber-50/80'
            : 'border-stone-300 bg-stone-50'
      }`}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide text-stone-500">
        {label}
      </span>
      {placedLabel && (
        <span className="mt-1 text-xs font-semibold text-amber-900">{placedLabel}</span>
      )}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-stone-600">{label}</span>
        <span className="font-semibold text-amber-800">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-amber-600 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function BuildPankou() {
  const {
    selectedSpecimen,
    assemblyPlacements,
    setPlacement,
    assemblyScores,
    setAssemblyScores,
    setStep,
    markStepComplete,
  } = usePlaySession();

  const [activeId, setActiveId] = useState<string | null>(null);

  if (!selectedSpecimen) {
    return (
      <p className="text-stone-600">
        Please choose a Pankou first.{' '}
        <button type="button" className="text-amber-700 underline" onClick={() => setStep('choose')}>
          Go back
        </button>
      </p>
    );
  }

  const placedComponentIds = new Set(
    Object.values(assemblyPlacements).filter(Boolean) as string[],
  );

  const getLabel = (componentId: string) =>
    selectedSpecimen.assemblyComponents.find((c) => c.id === componentId)?.label ?? componentId;

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const componentId = String(e.active.id);
    const slotId = e.over ? String(e.over.id) : null;

    if (!slotId || !slotId.startsWith('slot-')) return;

    const existingSlot = Object.entries(assemblyPlacements).find(([, v]) => v === componentId)?.[0];
    if (existingSlot) setPlacement(existingSlot, null);

    const displaced = assemblyPlacements[slotId];
    if (displaced) {
      const prevSlot = Object.entries(assemblyPlacements).find(
        ([, v]) => v === componentId,
      )?.[0];
      if (prevSlot && prevSlot !== slotId) setPlacement(prevSlot, displaced);
    }

    setPlacement(slotId, componentId);
  };

  const handleEvaluate = () => {
    const scores = scoreAssembly(assemblyPlacements, selectedSpecimen);
    setAssemblyScores(scores);
  };

  const handleContinue = () => {
    markStepComplete('build');
    setStep('match');
  };

  const filledSlots = Object.values(assemblyPlacements).filter(Boolean).length;

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Build Your Pankou</h2>
        <p className="mt-1 text-stone-600">
          Drag components onto the canvas slots to assemble a {selectedSpecimen.englishName}.
        </p>
      </header>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className={`${craftCard} p-6`}>
            <p className="mb-4 text-center text-xs text-stone-500">Assembly canvas</p>
            <div className="relative mx-auto aspect-square max-w-md rounded-xl bg-gradient-to-b from-stone-100 to-amber-50/50 p-4">
              <div className="grid h-full grid-cols-3 grid-rows-4 gap-2">
                <div className="col-start-2">
                  <DropSlot
                    slotId="slot-motif"
                    label="Decorative Motif"
                    placedLabel={
                      assemblyPlacements['slot-motif']
                        ? getLabel(assemblyPlacements['slot-motif']!)
                        : undefined
                    }
                  />
                </div>
                <div>
                  <DropSlot
                    slotId="slot-left"
                    label="Left Loop"
                    placedLabel={
                      assemblyPlacements['slot-left']
                        ? getLabel(assemblyPlacements['slot-left']!)
                        : undefined
                    }
                  />
                </div>
                <div>
                  <DropSlot
                    slotId="slot-center"
                    label="Central Knot"
                    placedLabel={
                      assemblyPlacements['slot-center']
                        ? getLabel(assemblyPlacements['slot-center']!)
                        : undefined
                    }
                  />
                </div>
                <div>
                  <DropSlot
                    slotId="slot-right"
                    label="Right Loop"
                    placedLabel={
                      assemblyPlacements['slot-right']
                        ? getLabel(assemblyPlacements['slot-right']!)
                        : undefined
                    }
                  />
                </div>
                <div className="col-start-2">
                  <DropSlot
                    slotId="slot-closure"
                    label="Closure Node"
                    placedLabel={
                      assemblyPlacements['slot-closure']
                        ? getLabel(assemblyPlacements['slot-closure']!)
                        : undefined
                    }
                  />
                </div>
                <div className="col-start-2">
                  <DropSlot
                    slotId="slot-tail"
                    label="Tail Cord"
                    placedLabel={
                      assemblyPlacements['slot-tail']
                        ? getLabel(assemblyPlacements['slot-tail']!)
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`${craftCard} p-4`}>
              <h3 className="mb-3 text-sm font-semibold text-stone-800">Components</h3>
              <div className="flex flex-col gap-2">
                {selectedSpecimen.assemblyComponents.map((c) => (
                  <DraggableComponent
                    key={c.id}
                    id={c.id}
                    label={placedComponentIds.has(c.id) ? `${c.label} (placed)` : c.label}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`${craftButton} w-full`}
              disabled={filledSlots < 4}
              onClick={handleEvaluate}
            >
              Evaluate Assembly
            </button>

            {assemblyScores && (
              <div className={craftPanel}>
                <p className="mb-3 text-sm font-semibold text-amber-900">
                  Overall: {averageScore(assemblyScores)}%
                </p>
                <div className="space-y-3">
                  <ScoreBar label="Symmetry" value={assemblyScores.symmetry} />
                  <ScoreBar label="Path continuity" value={assemblyScores.pathContinuity} />
                  <ScoreBar label="Closure logic" value={assemblyScores.closureLogic} />
                  <ScoreBar label="Cultural match" value={assemblyScores.culturalMatch} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-stone-700">
                  {feedbackMessage(assemblyScores)}
                </p>
                <button type="button" className={`${craftButton} mt-4 w-full`} onClick={handleContinue}>
                  Match Meaning →
                </button>
              </div>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-sm font-medium shadow-lg">
              {getLabel(activeId)}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
