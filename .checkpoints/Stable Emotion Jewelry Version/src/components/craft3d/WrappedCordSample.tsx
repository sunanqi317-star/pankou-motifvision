import { useMemo } from 'react';
import type { FabricMaterialStyle, FabricTypeId } from './fabricMaterials';
import { darkenColor } from './fabricColorUtils';
import { CordMesh } from './CordMesh';
import { CORD_SAMPLE_Y, WRAP_CORD_POINTS } from './tableLayout';

function wrappedRadiusForFabric(fabricType: FabricTypeId): number {
  return fabricType === 'silk' ? 0.062 : 0.058;
}

interface WrappedCordSampleProps {
  color: string;
  materialStyle: FabricMaterialStyle;
  fabricType: FabricTypeId;
  radius?: number;
  opacity?: number;
}

/** Rounded Pankou cord after wrapping — cylindrical with a subtle seam line. */
export function WrappedCordSample({
  color,
  materialStyle,
  fabricType,
  radius,
  opacity = 1,
}: WrappedCordSampleProps) {
  const cordRadius = radius ?? wrappedRadiusForFabric(fabricType);
  const seamColor = useMemo(() => darkenColor(color, 0.18), [color]);

  if (opacity <= 0.01) return null;

  const seamY = CORD_SAMPLE_Y + cordRadius * 0.78;
  const seamZ = cordRadius * 0.22;
  const seamLength = WRAP_CORD_POINTS[1].x - WRAP_CORD_POINTS[0].x;

  return (
    <group renderOrder={3}>
      <CordMesh
        points={WRAP_CORD_POINTS}
        closed={false}
        progress={1}
        radius={cordRadius}
        color={color}
        materialStyle={materialStyle}
        stage="cord"
        castShadow
        receiveShadow={false}
        renderOrder={3}
        opacity={opacity}
      />

      <mesh position={[0, seamY, seamZ]} renderOrder={4}>
        <boxGeometry args={[seamLength * 0.96, 0.004, 0.006]} />
        <meshStandardMaterial
          color={seamColor}
          transparent
          opacity={0.42 * opacity}
          roughness={0.94}
          metalness={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
