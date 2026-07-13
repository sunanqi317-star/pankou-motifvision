import type { FabricTypeId } from './fabricMaterials';
import { getMaterialSurfaceLine } from './fabricMaterials';

const STEP_INFO: { title: string; description: string }[] = [
  {
    title: 'Material Selection',
    description: 'Prepare a fabric strip before wrapping it into a cord.',
  },
  {
    title: 'Insert Core & Wrap',
    description: 'Place a metal wire inside the fabric, then fold it into a Pankou cord.',
  },
  {
    title: 'Coil Floral Pankou',
    description: 'The wrapped cord follows a fixed floral structure.',
  },
  {
    title: 'Fix Key Nodes',
    description: 'Click each node in the 3D view to secure the shape.',
  },
  {
    title: 'Shape and Stabilize',
    description: 'Choose soft or strong shaping for the finished form.',
  },
  {
    title: 'Assemble Clasp and Loop',
    description: 'Add clasp and loop fastening to complete the Pankou.',
  },
];

interface CanvasOverlaysProps {
  step: number;
  completed: boolean;
  fabricType: FabricTypeId | null;
  fabricName: string | null;
  colorName: string | null;
  hasFabricSelected: boolean;
  hasColorSelected: boolean;
}

export function CanvasOverlays({
  step,
  completed,
  fabricType,
  fabricName,
  colorName,
  hasFabricSelected,
  hasColorSelected,
}: CanvasOverlaysProps) {
  const displayStep = completed ? 6 : step;
  const info = STEP_INFO[Math.max(0, Math.min(displayStep - 1, STEP_INFO.length - 1))];
  const surfaceLine = fabricType ? getMaterialSurfaceLine(fabricType) : null;
  const selectionReady = hasFabricSelected && hasColorSelected;

  return (
    <>
      <div
        className="pointer-events-none absolute left-6 top-6 z-[80] max-w-[240px] rounded-xl border border-amber-900/10 bg-[rgba(255,252,247,0.88)] px-3 py-2 shadow-[0_2px_12px_rgba(80,60,40,0.08)] backdrop-blur-[2px]"
        aria-live="polite"
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-900/70">
          Step {displayStep} / 6
        </p>
        <p className="mt-0.5 text-xs font-medium text-[#2c2825]">{info.title}</p>
        <p className="mt-0.5 text-[10px] leading-snug text-stone-500">{info.description}</p>
      </div>

      {step === 1 && !selectionReady && (
        <div className="pointer-events-none absolute inset-x-0 top-[42%] z-[5] flex justify-center px-8">
          <p className="max-w-sm text-center text-sm text-stone-500/90">
            Select a fabric and color to prepare the material strip.
          </p>
        </div>
      )}

      <div
        className="pointer-events-none absolute bottom-6 right-6 z-[80] max-w-[280px] rounded-xl border border-amber-900/10 bg-[rgba(255,252,247,0.88)] px-3 py-2 shadow-[0_2px_12px_rgba(80,60,40,0.08)] backdrop-blur-[2px]"
      >
        {selectionReady && fabricName && colorName ? (
          <>
            <p className="text-[10px] font-medium text-[#2c2825]">
              Selected: {fabricName} · {colorName}
            </p>
            {surfaceLine && (
              <p className="mt-0.5 text-[10px] leading-snug text-stone-500">Surface: {surfaceLine}</p>
            )}
          </>
        ) : (
          <>
            <p className="text-[10px] font-medium text-[#2c2825]">Selected: Not ready</p>
            <p className="mt-0.5 text-[10px] leading-snug text-stone-500">
              Choose one fabric and one color.
            </p>
          </>
        )}
      </div>
    </>
  );
}

export function getFabricDisplayName(fabricType: FabricTypeId): string {
  const names: Record<FabricTypeId, string> = {
    silk: 'Silk fabric',
    cotton: 'Cotton fabric',
  };
  return names[fabricType];
}
