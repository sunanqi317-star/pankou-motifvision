import {
  craftColorTile,
  craftColorTileSelected,
  craftColorTileUnselected,
  craftMaterialCard,
  craftMaterialCardSelected,
  craftMaterialCardUnselected,
  craftSectionLabel,
} from '../ui/experienceStyles';
import {
  FABRIC_MATERIALS,
  SHARED_COLOR_PALETTE,
  type FabricColorSwatch,
  type FabricMaterial,
  type FabricTypeId,
} from './fabricMaterials';
import { ColorSwatchFace } from './ColorSwatchFace';
import { DEFAULT_PREVIEW_COLOR, FabricThumbnail } from './FabricThumbnail';

interface FabricMaterialStepProps {
  selectedFabricType: FabricTypeId | null;
  selectedFabricColor: FabricColorSwatch | null;
  onSelectFabric: (id: FabricTypeId) => void;
  onSelectColor: (swatch: FabricColorSwatch) => void;
  compact?: boolean;
}

function SelectionBadge({ compact }: { compact?: boolean }) {
  return (
    <span
      className={`absolute flex items-center justify-center rounded-full bg-[#8e5b38] text-white shadow-sm ${
        compact ? 'right-1.5 top-1.5 h-4 w-4' : 'right-2 top-2 h-5 w-5'
      }`}
      aria-hidden
    >
      <svg
        viewBox="0 0 12 12"
        className={compact ? 'h-2.5 w-2.5' : 'h-3 w-3'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function FabricMaterialStep({
  selectedFabricType,
  selectedFabricColor,
  onSelectFabric,
  onSelectColor,
  compact = false,
}: FabricMaterialStepProps) {
  const previewHex = selectedFabricColor?.hex ?? DEFAULT_PREVIEW_COLOR;

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <header>
        <p className="text-sm font-medium text-[#2c2825]">Step 1 — Material</p>
        <p className="mt-1 text-xs text-stone-500">Pick a fabric, then choose a shared color.</p>
      </header>

      <section className="space-y-2" aria-labelledby="choose-fabric-heading">
        <h3 id="choose-fabric-heading" className={craftSectionLabel}>
          A. Choose Fabric
        </h3>
        <div className={compact ? 'flex flex-col gap-2' : 'grid gap-3 sm:grid-cols-2'}>
          {FABRIC_MATERIALS.map((fabric) => (
            <FabricCard
              key={fabric.id}
              fabric={fabric}
              selected={selectedFabricType === fabric.id}
              previewColorHex={previewHex}
              showColorHint={!selectedFabricColor}
              compact={compact}
              onSelect={() => onSelectFabric(fabric.id)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-2" aria-labelledby="choose-color-heading">
        <h3 id="choose-color-heading" className={craftSectionLabel}>
          B. Choose Color
        </h3>
        <div className={compact ? 'grid grid-cols-5 gap-1.5' : 'grid grid-cols-2 gap-2 sm:grid-cols-5'}>
          {SHARED_COLOR_PALETTE.map((swatch) => {
            const isSelected = selectedFabricColor?.name === swatch.name;
            return (
              <button
                key={swatch.name}
                type="button"
                onClick={() => onSelectColor(swatch)}
                aria-pressed={isSelected}
                className={`${craftColorTile} relative ${compact ? '!gap-0.5 !p-1' : ''} ${
                  isSelected ? craftColorTileSelected : craftColorTileUnselected
                }`}
              >
                {isSelected && (
                  <span className="absolute right-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#8e5b38] text-white">
                    <svg
                      viewBox="0 0 12 12"
                      className="h-1.5 w-1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <ColorSwatchFace hex={swatch.hex} compact={compact} />
                <span
                  className={`line-clamp-1 text-center leading-tight text-stone-600 ${
                    compact ? 'text-[8px]' : 'text-[9px]'
                  }`}
                >
                  {swatch.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function FabricCard({
  fabric,
  selected,
  previewColorHex,
  showColorHint,
  compact,
  onSelect,
}: {
  fabric: FabricMaterial;
  selected: boolean;
  previewColorHex: string;
  showColorHint: boolean;
  compact?: boolean;
  onSelect: () => void;
}) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`${craftMaterialCard} flex flex-row items-stretch overflow-hidden text-left ${
          selected ? craftMaterialCardSelected : craftMaterialCardUnselected
        }`}
        style={selected ? { borderWidth: 2 } : undefined}
      >
        {selected && <SelectionBadge compact />}
        <div className="w-[4.5rem] shrink-0 border-r border-stone-100/80">
          <FabricThumbnail
            fabricId={fabric.id}
            colorHex={previewColorHex}
            showColorHint={showColorHint}
            compact
            dense
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-2.5 py-2">
          <p className="text-[11px] font-medium leading-tight text-[#2c2825]">{fabric.name}</p>
          <p className="text-[9px] text-stone-500">{fabric.surfaceSummary}</p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`${craftMaterialCard} ${
        selected ? craftMaterialCardSelected : craftMaterialCardUnselected
      }`}
      style={selected ? { borderWidth: 2 } : undefined}
    >
      {selected && <SelectionBadge />}
      <FabricThumbnail
        fabricId={fabric.id}
        colorHex={previewColorHex}
        showColorHint={showColorHint}
        compact
      />
      <div className="flex flex-col gap-1.5 p-3">
        <p className="text-xs font-medium text-[#2c2825]">{fabric.name}</p>
        <p className="text-[9px] text-stone-500">{fabric.surfaceSummary}</p>
      </div>
    </button>
  );
}
