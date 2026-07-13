import * as THREE from 'three';
import type { FabricMaterialStyle, TextureType } from './fabricMaterials';
import { mixHexColors, mixRenderColor } from './fabricColorUtils';
import {
  adjustFabricColor,
  createCottonTexture,
  createSilkTexture,
  type FabricTextureSet,
} from './fabricTextures';

export type FabricCraftStage = 'strip' | 'cord' | 'coiled';

const CORD_BRIGHTEN = '#FFF3E4';

/** Single craft color derived from the UI swatch — used across all steps. */
export function getRenderedFabricColor(selectedColorHex: string): string {
  return mixRenderColor(selectedColorHex, 0.18);
}

function silkPaletteFromBase(base: string) {
  return {
    base,
    highlight: mixHexColors(base, '#FFF5E8', 0.35),
    shadow: mixHexColors(base, '#6A4A45', 0.12),
  };
}

function stageBaseColor(renderedColor: string, stage: FabricCraftStage): string {
  if (stage === 'cord' || stage === 'coiled') {
    return mixHexColors(renderedColor, CORD_BRIGHTEN, 0.08);
  }
  return renderedColor;
}

function configureCraftTexture(
  texture: THREE.CanvasTexture,
  textureType: TextureType,
  stage: FabricCraftStage,
): void {
  if (textureType === 'silkGradient') {
    if (stage === 'strip') {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(1, 1);
    } else {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(2.2, 1);
    }
  } else {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(stage === 'strip' ? 9 : 6, stage === 'strip' ? 4 : 3);
  }
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
}

/**
 * Shared craft texture + adjusted color. Input must already be getRenderedFabricColor().
 * Does not apply softenFabricColor again.
 */
export function createCraftFabricTextures(
  renderedColor: string,
  textureType: TextureType,
  style: FabricMaterialStyle,
  stage: FabricCraftStage = 'strip',
): FabricTextureSet {
  const base = stageBaseColor(renderedColor, stage);
  const adjustedColor = adjustFabricColor(base, style);
  const safeType: TextureType = textureType === 'silkGradient' ? 'silkGradient' : 'cottonNoise';

  if (safeType === 'silkGradient') {
    const palette = silkPaletteFromBase(base);
    const { map } = createSilkTexture(base, palette);
    configureCraftTexture(map, safeType, stage);
    return { map, adjustedColor };
  }

  const { map, bumpMap } = createCottonTexture(base);
  configureCraftTexture(map, safeType, stage);
  if (bumpMap) configureCraftTexture(bumpMap, safeType, stage);
  return { map, bumpMap, adjustedColor };
}

export function getCraftEnvMapIntensity(
  textureType: TextureType,
  stage: FabricCraftStage,
): number {
  const isSilk = textureType === 'silkGradient';
  if (isSilk) return stage === 'strip' ? 0.1 : 0.12;
  return 0.03;
}
