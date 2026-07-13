import {
  NEUTRAL_SAMPLE_COLOR,
  getMaterialProfile,
  normalizeFabricType,
  type FabricMaterialStyle,
  type FabricTypeId,
} from './fabricMaterials';
import { getRenderedFabricColor } from './fabricMaterialFactory';

export interface Step1StripView {
  fabricType: FabricTypeId;
  colorHex: string;
  materialStyle: FabricMaterialStyle;
  selectionComplete: boolean;
}

export function resolveStep1StripView(
  fabricType: FabricTypeId,
  fabricColor: string,
  fabricStyle: FabricMaterialStyle,
  hasFabricSelected: boolean,
  hasColorSelected: boolean,
): Step1StripView {
  const normalizedType = normalizeFabricType(fabricType);
  const selectionComplete = hasFabricSelected && hasColorSelected;

  return {
    fabricType: normalizedType,
    colorHex: selectionComplete
      ? fabricColor
      : getRenderedFabricColor(NEUTRAL_SAMPLE_COLOR),
    materialStyle: selectionComplete
      ? fabricStyle
      : getMaterialProfile('cotton'),
    selectionComplete,
  };
}
