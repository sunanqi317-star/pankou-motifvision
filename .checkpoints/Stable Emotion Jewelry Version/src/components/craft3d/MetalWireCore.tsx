import { STEP1_STRIP_LENGTH, STEP1_STRIP_POSITION, STEP1_STRIP_THICKNESS } from './tableLayout';

export const WIRE_RADIUS = 0.02;
export const WIRE_LENGTH = STEP1_STRIP_LENGTH * 0.92;

interface MetalWireCoreProps {
  opacity?: number;
}

/** Thin silver core placed lengthwise on the flat fabric strip. */
export function MetalWireCore({ opacity = 1 }: MetalWireCoreProps) {
  const y = STEP1_STRIP_POSITION[1] + STEP1_STRIP_THICKNESS / 2 + 0.012;

  if (opacity <= 0.01) return null;

  return (
    <mesh
      position={[0, y, 0]}
      rotation={[0, 0, Math.PI / 2]}
      renderOrder={4}
      castShadow
    >
      <cylinderGeometry args={[WIRE_RADIUS, WIRE_RADIUS, WIRE_LENGTH, 14]} />
      <meshStandardMaterial
        color="#b8bcc4"
        metalness={0.4}
        roughness={0.35}
        transparent={opacity < 0.99}
        opacity={opacity}
        depthWrite={opacity >= 0.5}
      />
    </mesh>
  );
}
