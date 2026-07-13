import * as THREE from 'three';
import type { FabricMaterialStyle, TextureType } from './fabricMaterials';
import { hexToRgb, rgbToHex, silkStripColors, softenFabricColor } from './fabricColorUtils';

export { softenFabricColor, softenPreviewColor } from './fabricColorUtils';

export function adjustFabricColor(hex: string, style: FabricMaterialStyle): string {
  const { r, g, b } = hexToRgb(hex);
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  const sat = style.saturation;
  const nr = gray + (r - gray) * sat;
  const ng = gray + (g - gray) * sat;
  const nb = gray + (b - gray) * sat;
  const br = style.brightness * 255;
  return rgbToHex(nr + br, ng + br, nb + br);
}

function configureRepeat(texture: THREE.CanvasTexture, repeatU = 6, repeatV = 2): THREE.CanvasTexture {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatU, repeatV);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function tintRgba(hex: string, alpha: number, lighten = 0): string {
  const { r, g, b } = hexToRgb(hex);
  const lr = Math.min(255, r + lighten);
  const lg = Math.min(255, g + lighten);
  const lb = Math.min(255, b + lighten);
  return `rgba(${lr}, ${lg}, ${lb}, ${alpha})`;
}

/**
 * Continuous satin silk texture — length runs along canvas width for strip mapping.
 * No tiling blocks; soft diagonal sheen and gentle fiber streaks.
 */
export function createSilkTexture(
  baseColor: string,
  palette?: { base: string; highlight: string; shadow: string },
): { map: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const { base, highlight, shadow } = palette ?? silkStripColors(baseColor);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const satin = ctx.createLinearGradient(0, 0, canvas.width, canvas.height * 0.55);
  satin.addColorStop(0, tintRgba(shadow, 0.22));
  satin.addColorStop(0.35, base);
  satin.addColorStop(0.52, highlight);
  satin.addColorStop(0.68, base);
  satin.addColorStop(1, tintRgba(shadow, 0.2));
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = satin;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = tintRgba(highlight, 0.55);
  ctx.lineWidth = 22;
  ctx.lineCap = 'round';
  for (let band = 0; band < 3; band++) {
    const centerY = canvas.height * (0.32 + band * 0.18);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    for (let x = 0; x <= canvas.width; x += 24) {
      const waveY = centerY + Math.sin(x * 0.006 + band * 1.4) * 14;
      ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 0.05;
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = tintRgba(highlight, 0.4);
  for (let n = 0; n < 48; n++) {
    const startX = (n / 48) * canvas.width;
    const startY = canvas.height * 0.2 + (n % 7) * (canvas.height / 9);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + canvas.width * 0.12, startY + Math.sin(n) * 3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.ClampToEdgeWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.repeat.set(1, 1);
  map.colorSpace = THREE.SRGBColorSpace;
  map.needsUpdate = true;
  return { map };
}

/** Matte woven grain — visible thread lines and fine fiber noise. */
export function createCottonTexture(
  baseColor: string,
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = size;
  mapCanvas.height = size;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;

  const ctx = mapCanvas.getContext('2d')!;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  ctx.strokeStyle = tintRgba(baseColor, 0.09, -12);
  ctx.lineWidth = 0.55;
  bumpCtx.strokeStyle = '#787878';
  bumpCtx.lineWidth = 0.5;
  for (let y = 0; y < size; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
    bumpCtx.beginPath();
    bumpCtx.moveTo(0, y);
    bumpCtx.lineTo(size, y);
    bumpCtx.stroke();
  }

  ctx.strokeStyle = tintRgba(baseColor, 0.08, 10);
  for (let x = 0; x < size; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
    bumpCtx.beginPath();
    bumpCtx.moveTo(x, 0);
    bumpCtx.lineTo(x, size);
    bumpCtx.stroke();
  }

  const imageData = ctx.getImageData(0, 0, size, size);
  const bumpData = bumpCtx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const noise = (Math.random() - 0.5) * 7;
      const fiber = Math.random() > 0.992 ? 5 : 0;
      imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise + fiber));
      imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise + fiber));
      imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise + fiber));

      const bumpVal = 116 + Math.floor(Math.random() * 24);
      bumpData.data[i] = bumpVal;
      bumpData.data[i + 1] = bumpVal;
      bumpData.data[i + 2] = bumpVal;
      bumpData.data[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  bumpCtx.putImageData(bumpData, 0, 0);

  const map = configureRepeat(new THREE.CanvasTexture(mapCanvas), 10, 4);
  const bumpMap = configureRepeat(new THREE.CanvasTexture(bumpCanvas), 10, 4);
  return { map, bumpMap };
}

export interface FabricTextureSet {
  map: THREE.CanvasTexture;
  bumpMap?: THREE.CanvasTexture;
  adjustedColor: string;
}

export function createFabricTextures(
  hex: string,
  textureType: TextureType,
  style: FabricMaterialStyle,
): FabricTextureSet {
  const softened = softenFabricColor(hex);
  const adjustedColor = adjustFabricColor(softened, style);
  const safeType: TextureType = textureType === 'silkGradient' ? 'silkGradient' : 'cottonNoise';

  if (safeType === 'silkGradient') {
    const { map } = createSilkTexture(adjustedColor);
    return { map, adjustedColor };
  }

  const { map, bumpMap } = createCottonTexture(adjustedColor);
  return { map, bumpMap, adjustedColor };
}
