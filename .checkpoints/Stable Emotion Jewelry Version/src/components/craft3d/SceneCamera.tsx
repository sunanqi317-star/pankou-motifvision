import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Craft3DStep } from './PankouScene';

interface CameraPreset {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  minDistance: number;
  maxDistance: number;
}

const PRESETS: Record<Craft3DStep, CameraPreset> = {
  material: {
    position: new THREE.Vector3(0, 2.0, 3.2),
    target: new THREE.Vector3(0, 0.05, 0),
    fov: 36,
    minDistance: 2.3,
    maxDistance: 4.6,
  },
  wrap: {
    position: new THREE.Vector3(0, 2.7, 4.2),
    target: new THREE.Vector3(0, 0, 0),
    fov: 35,
    minDistance: 3.0,
    maxDistance: 6.8,
  },
  coil: {
    position: new THREE.Vector3(0, 3.2, 4.8),
    target: new THREE.Vector3(0, 0.1, 0),
    fov: 40,
    minDistance: 3.2,
    maxDistance: 9,
  },
  fix: {
    position: new THREE.Vector3(0.4, 2.8, 4.6),
    target: new THREE.Vector3(0, 0.2, 0),
    fov: 42,
    minDistance: 2.8,
    maxDistance: 8,
  },
  shape: {
    position: new THREE.Vector3(-0.3, 2.6, 4.8),
    target: new THREE.Vector3(0, 0.2, 0),
    fov: 40,
    minDistance: 2.8,
    maxDistance: 8,
  },
  assemble: {
    position: new THREE.Vector3(0.2, 2.5, 4.4),
    target: new THREE.Vector3(0, 0.2, 0),
    fov: 40,
    minDistance: 2.8,
    maxDistance: 8,
  },
  complete: {
    position: new THREE.Vector3(0, 2.8, 5.2),
    target: new THREE.Vector3(0, 0.2, 0),
    fov: 42,
    minDistance: 2.8,
    maxDistance: 8,
  },
};

export function useSceneCameraPreset(step: Craft3DStep): CameraPreset {
  return useMemo(() => PRESETS[step], [step]);
}

export function SceneCamera({ step }: { step: Craft3DStep }) {
  const { camera } = useThree();
  const preset = useSceneCameraPreset(step);
  const targetRef = useRef(preset.target.clone());
  const desiredPos = useRef(preset.position.clone());
  const desiredFov = useRef(preset.fov);

  if (
    desiredPos.current.distanceTo(preset.position) > 0.01 ||
    targetRef.current.distanceTo(preset.target) > 0.01 ||
    desiredFov.current !== preset.fov
  ) {
    desiredPos.current.copy(preset.position);
    targetRef.current.copy(preset.target);
    desiredFov.current = preset.fov;
  }

  useFrame((_, delta) => {
    const persp = camera as THREE.PerspectiveCamera;
    const lerp = 1 - Math.exp(-5 * delta);
    persp.position.lerp(desiredPos.current, lerp);
    persp.fov = THREE.MathUtils.lerp(persp.fov, desiredFov.current, lerp);
    persp.updateProjectionMatrix();
    persp.lookAt(targetRef.current);
  });

  return null;
}
