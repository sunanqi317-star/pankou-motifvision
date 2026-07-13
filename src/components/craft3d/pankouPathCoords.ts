import * as THREE from 'three';

/**
 * Coordinate bridge between src/assets/pankou_path.svg and 3D tabletop space.
 * SVG viewBox: 400 × 140, origin center at (200, 70).
 */
export const SVG_VIEW_W = 400;
export const SVG_VIEW_H = 140;
export const SVG_CENTER_X = 200;
export const SVG_CENTER_Y = 70;
export const SVG_SCALE_X = 72;
export const SVG_SCALE_Z = 70;

export function svgToWorld(svgX: number, svgY: number, tableY: number): THREE.Vector3 {
  return new THREE.Vector3(
    (svgX - SVG_CENTER_X) / SVG_SCALE_X,
    tableY,
    -(svgY - SVG_CENTER_Y) / SVG_SCALE_Z,
  );
}

export function worldFromSvgPoints(
  pairs: [number, number][],
  tableY: number,
): THREE.Vector3[] {
  return pairs.map(([sx, sy]) => svgToWorld(sx, sy, tableY));
}
