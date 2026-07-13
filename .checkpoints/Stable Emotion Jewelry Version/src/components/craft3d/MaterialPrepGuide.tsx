import { Line, Text } from '@react-three/drei';
import { STEP1_STRIP_LENGTH, STEP1_STRIP_WIDTH, STEP1_STRIP_POSITION } from './tableLayout';

const GUIDE_COLOR = '#8e5b38';

export function MaterialPrepGuide({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const y = STEP1_STRIP_POSITION[1] - 0.025;
  const halfL = STEP1_STRIP_LENGTH / 2 + 0.22;
  const halfW = STEP1_STRIP_WIDTH / 2 + 0.18;

  const borderPoints = [
    [-halfL, y, -halfW],
    [halfL, y, -halfW],
    [halfL, y, halfW],
    [-halfL, y, halfW],
    [-halfL, y, -halfW],
  ] as [number, number, number][];

  return (
    <group renderOrder={0}>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[STEP1_STRIP_LENGTH + 0.45, STEP1_STRIP_WIDTH + 0.42]} />
        <meshBasicMaterial color={GUIDE_COLOR} transparent opacity={0.14} />
      </mesh>

      <Line
        points={borderPoints}
        color={GUIDE_COLOR}
        transparent
        opacity={0.16}
        lineWidth={1}
        dashed
        dashSize={0.09}
        gapSize={0.07}
      />

      <Text
        position={[0, 0.035, halfW + 0.14]}
        fontSize={0.068}
        color={GUIDE_COLOR}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.34}
        outlineWidth={0}
      >
        Material preparation area
      </Text>
    </group>
  );
}
