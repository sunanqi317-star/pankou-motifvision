import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { TABLE_TOP_Y } from './tableLayout';
import { createTabletopTexture } from './tabletopTexture';

const TABLETOP_COLOR = '#ede6da';
const TABLE_EDGE = '#d8cdbc';
const TABLE_LEG = '#cfc3b4';
const TABLE_SHADOW = '#cfc3b4';

const TABLE_THICKNESS = 0.1;
const TABLE_CENTER_Y = TABLE_TOP_Y - TABLE_THICKNESS / 2;

export function CraftTable() {
  const fabricMap = useMemo(() => createTabletopTexture(), []);

  useEffect(() => {
    return () => fabricMap.dispose();
  }, [fabricMap]);

  return (
    <group>
      <mesh position={[0, TABLE_TOP_Y - 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 3.8]} />
        <meshStandardMaterial
          color={TABLE_SHADOW}
          roughness={1}
          metalness={0}
          transparent
          opacity={0.35}
        />
      </mesh>

      <RoundedBox
        args={[4.8, TABLE_THICKNESS, 3.4]}
        radius={0.12}
        smoothness={6}
        position={[0, TABLE_CENTER_Y, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={TABLETOP_COLOR}
          map={fabricMap}
          roughness={0.85}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </RoundedBox>

      <mesh position={[0, TABLE_TOP_Y - 0.012, 0]} receiveShadow>
        <boxGeometry args={[4.65, 0.02, 3.25]} />
        <meshStandardMaterial color={TABLE_EDGE} roughness={0.9} metalness={0} />
      </mesh>

      {[
        [-2.0, TABLE_CENTER_Y - 0.34, 1.35],
        [2.0, TABLE_CENTER_Y - 0.34, 1.35],
        [-2.0, TABLE_CENTER_Y - 0.34, -1.35],
        [2.0, TABLE_CENTER_Y - 0.34, -1.35],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 0.56, 0.14]} />
          <meshStandardMaterial color={TABLE_LEG} roughness={0.88} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}
