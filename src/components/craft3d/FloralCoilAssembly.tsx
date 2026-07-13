import { useMemo } from 'react';
import * as THREE from 'three';
import type { FabricMaterialStyle } from './fabricMaterials';
import { CordMesh } from './CordMesh';
import type { CoilingStage } from './coilingStage';
import { FLORAL_CORD_RADIUS, getSegmentsForStage } from './hardFloralPankou';

interface FloralCoilAssemblyProps {
  coilingStage: CoilingStage;
  stageProgress: number;
  radius?: number;
  color: string;
  materialStyle: FabricMaterialStyle;
  shapingOffset?: { roughness: number; sheen: number };
}

export function FloralCoilAssembly({
  coilingStage,
  stageProgress,
  radius = FLORAL_CORD_RADIUS,
  color,
  materialStyle,
  shapingOffset,
}: FloralCoilAssemblyProps) {
  const visibleSegments = useMemo(
    () => getSegmentsForStage(coilingStage, stageProgress),
    [coilingStage, stageProgress],
  );

  if (visibleSegments.length === 0) return null;

  return (
    <group position={[0, 0, 0]}>
      {visibleSegments.map(({ segment, progress, opacity }) => {
        if (opacity <= 0.01) return null;
        const scale = THREE.MathUtils.lerp(0.96, 1, opacity);
        const tubeRadius = segment.radius ?? radius;
        return (
          <group key={segment.id} scale={scale}>
            <CordMesh
              points={segment.points}
              closed={segment.closed}
              progress={Math.max(0.02, progress)}
              radius={tubeRadius}
              color={color}
              materialStyle={materialStyle}
              stage="coiled"
              curveSegments={segment.tubularSegments ?? 96}
              shapingOffset={shapingOffset}
              opacity={opacity}
              castShadow
              receiveShadow={false}
              renderOrder={2}
            />
          </group>
        );
      })}
    </group>
  );
}
