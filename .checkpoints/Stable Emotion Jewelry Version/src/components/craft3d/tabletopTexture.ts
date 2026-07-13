import * as THREE from 'three';

const TABLETOP_BASE = '#e8dfd2';
const FABRIC_TINT = '#d8cdbc';

export function createTabletopTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = TABLETOP_BASE;
  ctx.fillRect(0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const { r: fr, g: fg, b: fb } = hexToRgb(FABRIC_TINT);
  const { r: br, g: bg, b: bb } = hexToRgb(TABLETOP_BASE);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    const blend = 0.18 + Math.random() * 0.08;
    imageData.data[i] = clamp(br + (fr - br) * blend + noise);
    imageData.data[i + 1] = clamp(bg + (fg - bg) * blend + noise);
    imageData.data[i + 2] = clamp(bb + (fb - bb) * blend + noise);
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = FABRIC_TINT;
  ctx.lineWidth = 0.6;
  for (let y = 0; y < size; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.random() - 0.5) * 0.5);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 0.5);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.16;
  for (let x = 0; x < size; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x + (Math.random() - 0.5) * 0.5, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 0.5, size);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}
