import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { FabricMaterialStyle } from './fabricMaterials';
import {
  createCraftFabricTextures,
  getCraftEnvMapIntensity,
  type FabricCraftStage,
} from './fabricMaterialFactory';
import { buildCurve, sampleCurvePoints } from './pankouCurves';

interface CordMeshProps {
  points: THREE.Vector3[];
  closed?: boolean;
  progress: number;
  radius: number;
  /** Pre-rendered craft color from getRenderedFabricColor(). */
  color: string;
  materialStyle: FabricMaterialStyle;
  stage?: FabricCraftStage;
  shapingOffset?: { roughness: number; sheen: number };
  /** Higher sampling for coiled reveal along long paths. */
  curveSegments?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  renderOrder?: number;
  opacity?: number;
}

export function CordMesh({
  points,
  closed = false,
  progress,
  radius,
  color,
  materialStyle,
  stage = 'cord',
  shapingOffset,
  curveSegments,
  castShadow = true,
  receiveShadow = true,
  renderOrder,
  opacity = 1,
}: CordMeshProps) {
  const geometry = useMemo(() => {
    const fullCurve = buildCurve(points, closed);
    const segments = curveSegments ?? (stage === 'coiled' ? 160 : 80);
    const sampled = sampleCurvePoints(fullCurve, progress, segments);
    if (sampled.length < 2) return null;

    const partialCurve = buildCurve(sampled, false);
    const tubularSegments =
      stage === 'coiled' ? Math.max(48, Math.min(120, sampled.length * 2)) : Math.max(8, sampled.length * 2);
    return new THREE.TubeGeometry(partialCurve, tubularSegments, radius, 16, false);
  }, [points, closed, progress, radius, curveSegments, stage]);

  const textures = useMemo(
    () => createCraftFabricTextures(color, materialStyle.textureType, materialStyle, stage),
    [color, materialStyle, stage],
  );

  const roughness = Math.max(
    0.05,
    Math.min(1, materialStyle.roughness + (shapingOffset?.roughness ?? 0)),
  );
  const sheen = Math.max(0, Math.min(1, materialStyle.sheen + (shapingOffset?.sheen ?? 0)));

  useEffect(() => {
    return () => {
      geometry?.dispose();
      textures.map.dispose();
      textures.bumpMap?.dispose();
    };
  }, [geometry, textures]);

  if (!geometry) return null;

  const isSilk = materialStyle.textureType === 'silkGradient';

  return (
    <mesh
      geometry={geometry}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      renderOrder={renderOrder}
    >
      <meshPhysicalMaterial
        color={textures.adjustedColor}
        roughness={roughness}
        metalness={0}
        sheen={sheen}
        sheenRoughness={isSilk ? 0.42 : 0.55}
        sheenColor={textures.adjustedColor}
        clearcoat={materialStyle.clearcoat}
        clearcoatRoughness={materialStyle.clearcoatRoughness}
        map={textures.map}
        bumpMap={textures.bumpMap}
        bumpScale={materialStyle.bumpScale}
        envMapIntensity={getCraftEnvMapIntensity(materialStyle.textureType, stage)}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity >= 0.98}
        anisotropy={isSilk ? 0.5 : 0}
        anisotropyRotation={Math.PI / 2}
      />
    </mesh>
  );
}
