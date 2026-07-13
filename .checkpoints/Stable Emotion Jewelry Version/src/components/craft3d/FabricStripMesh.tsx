import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import type { FabricMaterialStyle } from './fabricMaterials';
import { createFabricTextures } from './fabricTextures';
import {
  STEP1_STRIP_EDGE_RADIUS,
  STEP1_STRIP_EDGE_SMOOTHNESS,
  STEP1_STRIP_LENGTH,
  STEP1_STRIP_THICKNESS,
  STEP1_STRIP_WIDTH,
} from './tableLayout';

interface FabricStripMeshProps {
  color: string;
  materialStyle: FabricMaterialStyle;
  opacity?: number;
  ghost?: boolean;
}

export function FabricStripMesh({
  color,
  materialStyle,
  opacity = 1,
  ghost = false,
}: FabricStripMeshProps) {
  const textures = useMemo(
    () => createFabricTextures(color, materialStyle.textureType, materialStyle),
    [color, materialStyle],
  );

  const isSilk = materialStyle.textureType === 'silkGradient';
  const isGhost = ghost || opacity < 1;

  return (
    <RoundedBox
      args={[STEP1_STRIP_LENGTH, STEP1_STRIP_THICKNESS, STEP1_STRIP_WIDTH]}
      radius={STEP1_STRIP_EDGE_RADIUS * 0.75}
      smoothness={STEP1_STRIP_EDGE_SMOOTHNESS}
      castShadow={!isGhost}
      receiveShadow={false}
      renderOrder={2}
    >
      {isGhost ? (
        <meshStandardMaterial
          color="#d8cdbc"
          transparent
          opacity={opacity}
          roughness={0.92}
          metalness={0}
          depthWrite={false}
        />
      ) : (
        <meshPhysicalMaterial
          color={textures.adjustedColor}
          roughness={materialStyle.roughness}
          metalness={0}
          sheen={materialStyle.sheen}
          sheenRoughness={isSilk ? 0.32 : 0.48}
          sheenColor={textures.adjustedColor}
          clearcoat={materialStyle.clearcoat}
          clearcoatRoughness={materialStyle.clearcoatRoughness}
          map={textures.map}
          bumpMap={textures.bumpMap}
          bumpScale={materialStyle.bumpScale}
          envMapIntensity={isSilk ? 0.35 : 0.15}
          transparent={opacity < 1}
          opacity={opacity}
        />
      )}
    </RoundedBox>
  );
}
