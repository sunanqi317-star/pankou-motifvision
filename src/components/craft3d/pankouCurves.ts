import * as THREE from 'three';
import type { PankouTypeId } from '../../data/pankouTaxonomy';

export type CurveKind = 'straight' | 'floral' | 'butterfly' | 'ruyi';

export interface PathNode {
  id: string;
  position: THREE.Vector3;
  label: string;
}

export interface PankouCurveConfig {
  kind: CurveKind;
  points: THREE.Vector3[];
  nodes: PathNode[];
  softNodeIds: string[];
  hardNodeIds: string[];
  pathLabel: string;
}

const Y = 0.22;

function v(x: number, z: number, y = Y): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

const STRAIGHT_POINTS = [
  v(-2.6, 0),
  v(-1.6, 0),
  v(-0.6, 0),
  v(0.6, 0),
  v(1.6, 0),
  v(2.6, 0),
];

const BUTTERFLY_POINTS = [
  v(0, 1.1),
  v(-1.4, 0.6),
  v(-1.9, -0.1),
  v(-1.2, -0.9),
  v(0, -0.45),
  v(1.2, -0.9),
  v(1.9, -0.1),
  v(1.4, 0.6),
  v(0, 1.1),
];

const FLORAL_POINTS = [
  v(0, 1.0),
  v(0.75, 0.75),
  v(1.0, 0),
  v(0.75, -0.75),
  v(0, -1.0),
  v(-0.75, -0.75),
  v(-1.0, 0),
  v(-0.75, 0.75),
  v(0, 1.0),
];

const RUYI_POINTS = [
  v(-1.6, 0.2),
  v(-1.2, 0.9),
  v(-0.4, 1.1),
  v(0.5, 0.95),
  v(1.2, 0.55),
  v(1.5, -0.1),
  v(1.1, -0.75),
  v(0.3, -1.0),
  v(-0.6, -0.85),
  v(-1.3, -0.35),
  v(-1.6, 0.2),
];

const CURVE_CONFIGS: Record<CurveKind, PankouCurveConfig> = {
  straight: {
    kind: 'straight',
    points: STRAIGHT_POINTS,
    pathLabel: 'Straight Knot Path',
    nodes: [
      { id: 'n-center', position: v(0, 0), label: 'Center node' },
      { id: 'n-turn-a', position: v(-1.2, 0), label: 'Turning node' },
      { id: 'n-turn-b', position: v(1.2, 0), label: 'Turning node' },
      { id: 'n-end-a', position: v(-2.6, 0), label: 'End node' },
      { id: 'n-end-b', position: v(2.6, 0), label: 'End node' },
    ],
    softNodeIds: ['n-center', 'n-turn-a', 'n-turn-b'],
    hardNodeIds: ['n-center', 'n-turn-a', 'n-turn-b', 'n-end-a', 'n-end-b'],
  },
  butterfly: {
    kind: 'butterfly',
    points: BUTTERFLY_POINTS,
    pathLabel: 'Butterfly Path',
    nodes: [
      { id: 'n-center', position: v(0, -0.45), label: 'Center node' },
      { id: 'n-turn-a', position: v(-1.4, 0.6), label: 'Wing turn' },
      { id: 'n-turn-b', position: v(1.4, 0.6), label: 'Wing turn' },
      { id: 'n-wing-l', position: v(-1.2, -0.9), label: 'Body joint' },
      { id: 'n-wing-r', position: v(1.2, -0.9), label: 'Body joint' },
    ],
    softNodeIds: ['n-center', 'n-turn-a', 'n-turn-b'],
    hardNodeIds: ['n-center', 'n-turn-a', 'n-turn-b', 'n-wing-l', 'n-wing-r'],
  },
  floral: {
    kind: 'floral',
    points: FLORAL_POINTS,
    pathLabel: 'Floral Spiral Path',
    nodes: [
      { id: 'n-center', position: v(0, 0), label: 'Center node' },
      { id: 'n-turn-a', position: v(0, 1.0), label: 'Petal node' },
      { id: 'n-turn-b', position: v(1.0, 0), label: 'Petal node' },
      { id: 'n-petal-c', position: v(0, -1.0), label: 'Petal node' },
      { id: 'n-petal-d', position: v(-1.0, 0), label: 'Petal node' },
    ],
    softNodeIds: ['n-center', 'n-turn-a', 'n-turn-b'],
    hardNodeIds: ['n-center', 'n-turn-a', 'n-turn-b', 'n-petal-c', 'n-petal-d'],
  },
  ruyi: {
    kind: 'ruyi',
    points: RUYI_POINTS,
    pathLabel: 'Ruyi path',
    nodes: [
      { id: 'n-center', position: v(0.3, 0.1), label: 'Center node' },
      { id: 'n-turn-a', position: v(-0.4, 1.1), label: 'Curve node' },
      { id: 'n-turn-b', position: v(1.2, 0.55), label: 'Curve node' },
      { id: 'n-loop-a', position: v(-1.3, -0.35), label: 'Loop anchor' },
      { id: 'n-loop-b', position: v(1.1, -0.75), label: 'Loop anchor' },
    ],
    softNodeIds: ['n-center', 'n-turn-a', 'n-turn-b'],
    hardNodeIds: ['n-center', 'n-turn-a', 'n-turn-b', 'n-loop-a', 'n-loop-b'],
  },
};

export function curveKindFromPankouType(type: PankouTypeId): CurveKind {
  switch (type) {
    case 'straight':
      return 'straight';
    case 'floral-coiled':
      return 'floral';
    case 'butterfly':
      return 'butterfly';
    case 'ruyi':
      return 'ruyi';
    default:
      return 'butterfly';
  }
}

export function getCurveConfig(type: PankouTypeId): PankouCurveConfig {
  return CURVE_CONFIGS[curveKindFromPankouType(type)];
}

export function buildCurve(points: THREE.Vector3[], closed = false): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points, closed);
}

export function sampleCurvePoints(
  curve: THREE.CatmullRomCurve3,
  progress: number,
  segments = 64,
): THREE.Vector3[] {
  const clamped = Math.max(0.02, Math.min(1, progress));
  const count = Math.max(2, Math.ceil(segments * clamped));
  return curve.getPoints(count);
}

export { COILING_PATH_ID, getHardFloralCoilPath, getHardFloralPankouPaths } from './hardFloralPankou';
