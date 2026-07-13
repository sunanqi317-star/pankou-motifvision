import * as THREE from 'three';

/** World-space Y of the craft tabletop surface. */
export const TABLE_TOP_Y = 0;

/** Step 1 volumetric fabric strip — lies horizontal along X. */
export const STEP1_STRIP_LENGTH = 2.3;
export const STEP1_STRIP_WIDTH = 0.3;
export const STEP1_STRIP_THICKNESS = 0.1;
export const STEP1_STRIP_EDGE_RADIUS = 0.036;
export const STEP1_STRIP_EDGE_SMOOTHNESS = 10;
/** Lift above tabletop so bottom clears y = 0. */
export const STEP1_STRIP_LIFT = 0.06;
export const STEP1_STRIP_POSITION: [number, number, number] = [
  0,
  TABLE_TOP_Y + STEP1_STRIP_THICKNESS / 2 + STEP1_STRIP_LIFT,
  0,
];

/** Wrapped cord sample — Step 2+. */
export const CORD_HALF_LENGTH = STEP1_STRIP_LENGTH / 2;
export const CORD_SAMPLE_Y = STEP1_STRIP_POSITION[1] - 0.01;
export const CORD_SAMPLE_RADIUS = 0.055;

export const WRAP_CORD_POINTS = [
  new THREE.Vector3(-CORD_HALF_LENGTH, CORD_SAMPLE_Y, 0),
  new THREE.Vector3(CORD_HALF_LENGTH, CORD_SAMPLE_Y, 0),
];
