import { Line, RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  STEP1_STRIP_EDGE_RADIUS,
  STEP1_STRIP_EDGE_SMOOTHNESS,
  STEP1_STRIP_LENGTH,
  STEP1_STRIP_POSITION,
  STEP1_STRIP_THICKNESS,
  STEP1_STRIP_WIDTH,
} from './tableLayout';

const GHOST = '#e8ddc5';
const GUIDE = '#8e5b38';

export function Step1Placeholder() {
  const halfL = STEP1_STRIP_LENGTH / 2 + 0.1;
  const halfW = STEP1_STRIP_WIDTH / 2 + 0.08;
  const y = STEP1_STRIP_POSITION[1];

  const dashPoints = useMemo(() => {
    const corners = [
      new THREE.Vector3(-halfL, y, -halfW),
      new THREE.Vector3(halfL, y, -halfW),
      new THREE.Vector3(halfL, y, halfW),
      new THREE.Vector3(-halfL, y, halfW),
      new THREE.Vector3(-halfL, y, -halfW),
    ];
    return corners;
  }, [halfL, halfW, y]);

  return (
    <group renderOrder={1}>
      <group position={STEP1_STRIP_POSITION}>
        <RoundedBox
          args={[STEP1_STRIP_LENGTH, STEP1_STRIP_THICKNESS, STEP1_STRIP_WIDTH]}
          radius={STEP1_STRIP_EDGE_RADIUS}
          smoothness={STEP1_STRIP_EDGE_SMOOTHNESS}
          castShadow
          renderOrder={1}
        >
          <meshStandardMaterial
            color={GHOST}
            transparent
            opacity={0.26}
            roughness={0.92}
            metalness={0}
            depthWrite={false}
          />
        </RoundedBox>
      </group>

      <Line
        points={dashPoints}
        color={GUIDE}
        transparent
        opacity={0.2}
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.08}
      />
    </group>
  );
}
