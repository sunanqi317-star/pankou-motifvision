import type { Craft3DStep } from './PankouScene';

const WOOD = '#a89278';
const METAL = '#8a8078';
const THREAD = '#c98282';
const GLASS = '#d4cbb8';
const LABEL = '#b85a63';

type PropKey = 'scissors' | 'tweezers' | 'glue' | 'needle' | 'threadSpool';

function propOpacity(step: Craft3DStep, key: PropKey): number {
  const visible: Record<PropKey, Craft3DStep[]> = {
    scissors: ['material', 'wrap', 'coil', 'fix', 'shape', 'assemble', 'complete'],
    threadSpool: ['material', 'wrap', 'coil', 'fix', 'shape', 'assemble', 'complete'],
    needle: ['fix', 'shape', 'assemble', 'complete'],
    tweezers: ['fix', 'shape', 'assemble', 'complete'],
    glue: ['assemble', 'complete'],
  };

  if (!visible[key].includes(step)) return 0;

  const highlight =
    (step === 'fix' && (key === 'needle' || key === 'tweezers')) ||
    (step === 'assemble' && (key === 'needle' || key === 'tweezers' || key === 'glue'));

  return highlight ? 1 : 0.72;
}

function Scissors({ opacity }: { opacity: number }) {
  if (opacity <= 0) return null;
  return (
    <group position={[-1.75, 0.08, 0.55]} rotation={[0, 0.2, -0.35]} scale={0.38}>
      <mesh position={[-0.05, 0, 0]} rotation={[0, 0, 0.28]} castShadow>
        <boxGeometry args={[0.16, 0.012, 0.03]} />
        <meshStandardMaterial color={METAL} roughness={0.42} metalness={0.45} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.05, 0, 0]} rotation={[0, 0, -0.28]} castShadow>
        <boxGeometry args={[0.16, 0.012, 0.03]} />
        <meshStandardMaterial color={METAL} roughness={0.42} metalness={0.45} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.08, 0, 0.02]} castShadow>
        <torusGeometry args={[0.035, 0.008, 8, 16, Math.PI]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.35} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.08, 0, 0.02]} castShadow>
        <torusGeometry args={[0.035, 0.008, 8, 16, Math.PI]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.35} transparent opacity={opacity} />
      </mesh>
      <mesh castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.02, 10]} />
        <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.4} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function Tweezers({ opacity }: { opacity: number }) {
  if (opacity <= 0) return null;
  return (
    <group position={[1.7, 0.08, 0.65]} rotation={[0, 0, 0.35]} scale={0.4}>
      <mesh position={[-0.012, 0, 0]} rotation={[0, 0, 0.06]} castShadow>
        <boxGeometry args={[0.03, 0.008, 0.22]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.012, 0, 0]} rotation={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[0.03, 0.008, 0.22]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.5} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function GlueBottle({ opacity }: { opacity: number }) {
  if (opacity <= 0) return null;
  return (
    <group position={[1.9, 0.12, -0.55]} scale={0.25}>
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.32, 14]} />
        <meshStandardMaterial color={GLASS} roughness={0.55} metalness={0} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 10]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} metalness={0} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.02, 0.145]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[0.12, 0.08]} />
        <meshStandardMaterial color={LABEL} roughness={0.9} metalness={0} transparent opacity={opacity * 0.65} />
      </mesh>
    </group>
  );
}

function NeedleProp({ opacity }: { opacity: number }) {
  if (opacity <= 0) return null;
  return (
    <group position={[-1.5, 0.09, -0.55]} rotation={[0, 0, -0.45]} scale={0.35}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.004, 0.004, 0.28, 6]} />
        <meshStandardMaterial color={METAL} roughness={0.35} metalness={0.55} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.14, 0, 0]} castShadow>
        <torusGeometry args={[0.012, 0.003, 6, 12]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.5} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function ThreadSpoolProp({ opacity }: { opacity: number }) {
  if (opacity <= 0) return null;
  return (
    <group position={[-1.85, 0.12, -0.35]} rotation={[0, 0.5, 0]} scale={0.24}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 12]} />
        <meshStandardMaterial color={WOOD} roughness={0.82} metalness={0} transparent opacity={opacity} />
      </mesh>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 12]} />
        <meshStandardMaterial color={THREAD} roughness={0.78} metalness={0} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

interface CraftTablePropsProps {
  step: Craft3DStep;
  visible?: boolean;
}

export function CraftTableProps({ step, visible = true }: CraftTablePropsProps) {
  if (!visible) return null;

  return (
    <group renderOrder={1}>
      <Scissors opacity={propOpacity(step, 'scissors')} />
      <Tweezers opacity={propOpacity(step, 'tweezers')} />
      <GlueBottle opacity={propOpacity(step, 'glue')} />
      <NeedleProp opacity={propOpacity(step, 'needle')} />
      <ThreadSpoolProp opacity={propOpacity(step, 'threadSpool')} />
    </group>
  );
}
