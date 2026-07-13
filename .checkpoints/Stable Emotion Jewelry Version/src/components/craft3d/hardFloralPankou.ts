import * as THREE from 'three';
import type { PathNode } from './pankouCurves';
import { buildCurve } from './pankouCurves';
import type { CoilingStage } from './coilingStage';
import { worldFromSvgPoints } from './pankouPathCoords';

export const COILING_PATH_ID = 'hardFloralPankou' as const;

/** Geometry derived from src/assets/pankou_path.svg */
export const FLORAL_TABLE_Y = 0.12;
export const FLORAL_CORD_RADIUS = 0.03;
export const FLORAL_KNOT_RADIUS = 0.016;

const LEFT_UNIT_X = -1.25;
const RIGHT_UNIT_X = 1.25;
const CONNECT_INNER = 0.14;
const CORD_GAP = 0.035;

function p(x: number, z: number, y = FLORAL_TABLE_Y): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

function mirrorX(points: THREE.Vector3[]): THREE.Vector3[] {
  return points.map((pt) => p(-pt.x, pt.z, pt.y));
}

export interface FloralCoilSegment {
  id: string;
  points: THREE.Vector3[];
  closed: boolean;
  tubularSegments?: number;
  radius?: number;
}

export interface HardFloralPankouPaths {
  coilingPathId: typeof COILING_PATH_ID;
  segments: Record<
    'centerCord' | 'leftSpiral' | 'rightSpiral' | 'leftPetals' | 'rightPetals' | 'centralKnot',
    FloralCoilSegment[]
  >;
  guidePoints: THREE.Vector3[];
  nodes: PathNode[];
  hardNodeIds: string[];
  pathLabel: string;
}

/** Teardrop petal loop radiating from a floral hub. */
function teardropPetal(
  hubX: number,
  hubZ: number,
  tipX: number,
  tipZ: number,
  bulge = 0.11,
): THREE.Vector3[] {
  const dx = tipX - hubX;
  const dz = tipZ - hubZ;
  const len = Math.hypot(dx, dz) || 1;
  const nx = (-dz / len) * bulge;
  const nz = (dx / len) * bulge;
  const midX = hubX + dx * 0.52 + nx;
  const midZ = hubZ + dz * 0.52 + nz;
  return [
    p(hubX, hubZ),
    p(midX, midZ),
    p(tipX, tipZ),
    p(hubX + dx * 0.28 - nx * 0.45, hubZ + dz * 0.28 - nz * 0.45),
    p(hubX, hubZ),
  ];
}

export function createCenterCordCurves(): FloralCoilSegment[] {
  const z = CORD_GAP;
  return [
    {
      id: 'center-cord-left-a',
      points: [p(LEFT_UNIT_X, z), p(-0.7, z), p(-CONNECT_INNER, z)],
      closed: false,
      tubularSegments: 64,
    },
    {
      id: 'center-cord-left-b',
      points: [p(LEFT_UNIT_X, -z), p(-0.7, -z), p(-CONNECT_INNER, -z)],
      closed: false,
      tubularSegments: 64,
    },
    {
      id: 'center-cord-right-a',
      points: [p(CONNECT_INNER, z), p(0.7, z), p(RIGHT_UNIT_X, z)],
      closed: false,
      tubularSegments: 64,
    },
    {
      id: 'center-cord-right-b',
      points: [p(CONNECT_INNER, -z), p(0.7, -z), p(RIGHT_UNIT_X, -z)],
      closed: false,
      tubularSegments: 64,
    },
  ];
}

/** Tight hub coil where petals meet — matches SVG leftSpiral group. */
export function createLeftSpiralCurve(): FloralCoilSegment[] {
  return [
    {
      id: 'left-spiral',
      points: worldFromSvgPoints(
        [
          [110, 70],
          [104, 58],
          [96, 64],
          [98, 70],
          [100, 76],
          [108, 74],
          [110, 70],
        ],
        FLORAL_TABLE_Y,
      ),
      closed: true,
      tubularSegments: 72,
    },
  ];
}

export function createRightSpiralCurve(): FloralCoilSegment[] {
  return createLeftSpiralCurve().map((seg) => ({
    ...seg,
    id: 'right-spiral',
    points: mirrorX(seg.points),
  }));
}

/** Five teardrop petals per side — matches SVG leftPetals / rightPetals groups. */
export function createLeftPetalCurves(): FloralCoilSegment[] {
  const cx = LEFT_UNIT_X;
  const petals: [string, number, number][] = [
    ['left-petal-upper-left', -1.72, 0.36],
    ['left-petal-upper-inner', -1.06, 0.44],
    ['left-petal-lower-inner', -1.06, -0.44],
    ['left-petal-lower-left', -1.72, -0.36],
    ['left-petal-outer', -1.86, 0],
  ];

  return petals.map(([id, tipX, tipZ]) => ({
    id,
    points: teardropPetal(cx, 0, tipX, tipZ, 0.1),
    closed: true,
    tubularSegments: 56,
  }));
}

export function createRightPetalCurves(): FloralCoilSegment[] {
  return createLeftPetalCurves().map((seg) => ({
    ...seg,
    id: seg.id.replace('left', 'right'),
    points: mirrorX(seg.points),
  }));
}

/** Small woven central knot — matches SVG centralKnot group. */
export function createCentralKnotCurve(): FloralCoilSegment[] {
  return [
    {
      id: 'knot-ring',
      points: worldFromSvgPoints(
        [
          [191, 66],
          [200, 58],
          [209, 66],
          [200, 74],
          [191, 66],
        ],
        FLORAL_TABLE_Y,
      ),
      closed: true,
      tubularSegments: 40,
      radius: FLORAL_KNOT_RADIUS,
    },
    {
      id: 'knot-cross',
      points: worldFromSvgPoints(
        [
          [194, 74],
          [200, 64],
          [206, 74],
          [200, 80],
          [194, 74],
        ],
        FLORAL_TABLE_Y,
      ),
      closed: true,
      tubularSegments: 36,
      radius: FLORAL_KNOT_RADIUS * 0.9,
    },
  ];
}

function sampleSegments(segments: FloralCoilSegment[], target: THREE.Vector3[], guideY = FLORAL_TABLE_Y - 0.012) {
  segments.forEach((segment) => {
    const curve = buildCurve(segment.points, segment.closed);
    curve.getPoints(16).forEach((pt) => {
      target.push(new THREE.Vector3(pt.x, guideY, pt.z));
    });
  });
}

function buildGuidePoints(
  centerCord: FloralCoilSegment[],
  leftSpiral: FloralCoilSegment[],
  rightSpiral: FloralCoilSegment[],
  leftPetals: FloralCoilSegment[],
  rightPetals: FloralCoilSegment[],
  centralKnot: FloralCoilSegment[],
): THREE.Vector3[] {
  const samples: THREE.Vector3[] = [];
  sampleSegments(centerCord, samples);
  sampleSegments(leftSpiral, samples);
  sampleSegments(rightSpiral, samples);
  sampleSegments(leftPetals, samples);
  sampleSegments(rightPetals, samples);
  sampleSegments(centralKnot, samples);
  return samples;
}

let cachedPaths: HardFloralPankouPaths | null = null;

export function getHardFloralPankouPaths(): HardFloralPankouPaths {
  if (cachedPaths) return cachedPaths;

  const centerCord = createCenterCordCurves();
  const leftSpiral = createLeftSpiralCurve();
  const rightSpiral = createRightSpiralCurve();
  const leftPetals = createLeftPetalCurves();
  const rightPetals = createRightPetalCurves();
  const centralKnot = createCentralKnotCurve();

  cachedPaths = {
    coilingPathId: COILING_PATH_ID,
    segments: {
      centerCord,
      leftSpiral,
      rightSpiral,
      leftPetals,
      rightPetals,
      centralKnot,
    },
    guidePoints: buildGuidePoints(centerCord, leftSpiral, rightSpiral, leftPetals, rightPetals, centralKnot),
    pathLabel: 'Hard Floral Pankou path',
    nodes: [
      { id: 'n-left-spiral', position: p(LEFT_UNIT_X, 0), label: 'Left spiral center' },
      { id: 'n-right-spiral', position: p(RIGHT_UNIT_X, 0), label: 'Right spiral center' },
      { id: 'n-left-petal-top', position: p(LEFT_UNIT_X, 0.44), label: 'Upper left petal junction' },
      { id: 'n-left-petal-lower', position: p(LEFT_UNIT_X, -0.44), label: 'Lower left petal junction' },
      { id: 'n-right-petal-top', position: p(RIGHT_UNIT_X, 0.44), label: 'Upper right petal junction' },
      { id: 'n-right-petal-lower', position: p(RIGHT_UNIT_X, -0.44), label: 'Lower right petal junction' },
      { id: 'n-central-knot', position: p(0, 0), label: 'Central knot' },
    ],
    hardNodeIds: [
      'n-left-spiral',
      'n-right-spiral',
      'n-left-petal-top',
      'n-left-petal-lower',
      'n-right-petal-top',
      'n-right-petal-lower',
      'n-central-knot',
    ],
  };

  return cachedPaths;
}

type PanelStage = 'centerCord' | 'leftSpiral' | 'rightSpiral' | 'outerPetals' | 'centralKnot';

const PANEL_STAGE_ORDER: PanelStage[] = [
  'centerCord',
  'leftSpiral',
  'rightSpiral',
  'outerPetals',
  'centralKnot',
];

function segmentsForPanelStage(
  paths: HardFloralPankouPaths,
  panelStage: PanelStage,
): FloralCoilSegment[] {
  if (panelStage === 'outerPetals') {
    return [...paths.segments.leftPetals, ...paths.segments.rightPetals];
  }
  return paths.segments[panelStage];
}

export function getSegmentsForStage(
  stage: CoilingStage,
  stageProgress: number,
): { segment: FloralCoilSegment; progress: number; opacity: number }[] {
  const paths = getHardFloralPankouPaths();
  const result: { segment: FloralCoilSegment; progress: number; opacity: number }[] = [];

  if (stage === 'idle') return result;

  const pushStage = (panelStage: PanelStage, progress: number, opacity: number) => {
    segmentsForPanelStage(paths, panelStage).forEach((segment) => {
      result.push({ segment, progress, opacity });
    });
  };

  if (stage === 'complete') {
    PANEL_STAGE_ORDER.forEach((panelStage) => pushStage(panelStage, 1, 1));
    return result;
  }

  const activeIndex = PANEL_STAGE_ORDER.indexOf(stage as PanelStage);
  if (activeIndex < 0) return result;

  PANEL_STAGE_ORDER.forEach((panelStage, index) => {
    if (index > activeIndex) return;
    const progress = index < activeIndex ? 1 : Math.max(0.02, stageProgress);
    const opacity = index < activeIndex ? 1 : easeSegmentReveal(stageProgress);
    pushStage(panelStage, progress, opacity);
  });

  return result;
}

function easeSegmentReveal(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

export function getHardFloralCoilPath() {
  const paths = getHardFloralPankouPaths();
  return {
    kind: 'floral' as const,
    points: paths.guidePoints,
    nodes: paths.nodes,
    softNodeIds: paths.hardNodeIds.slice(0, 3),
    hardNodeIds: paths.hardNodeIds,
    pathLabel: paths.pathLabel,
  };
}

export function resetHardFloralPankouCache(): void {
  cachedPaths = null;
}
