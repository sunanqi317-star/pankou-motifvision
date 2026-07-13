import { RoundedBox } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { FabricMaterialStyle } from './fabricMaterials';
import { darkenColor } from './fabricColorUtils';
import {
  createCraftFabricTextures,
  getCraftEnvMapIntensity,
} from './fabricMaterialFactory';
import { applyStripFaceShading, applySubtleStripBow } from './stripGeometryUtils';
import {
  STEP1_STRIP_EDGE_RADIUS,
  STEP1_STRIP_EDGE_SMOOTHNESS,
  STEP1_STRIP_LENGTH,
  STEP1_STRIP_POSITION,
  STEP1_STRIP_THICKNESS,
  STEP1_STRIP_WIDTH,
} from './tableLayout';

interface Step1MaterialStripProps {
  /** Pre-rendered craft color from getRenderedFabricColor(). */
  color: string;
  materialStyle: FabricMaterialStyle;
  local?: boolean;
}

export function Step1MaterialStrip({
  color,
  materialStyle,
  local = false,
}: Step1MaterialStripProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isSilk = materialStyle.textureType === 'silkGradient';

  const textures = useMemo(
    () => createCraftFabricTextures(color, materialStyle.textureType, materialStyle, 'strip'),
    [color, materialStyle],
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const bent = mesh.geometry.clone();
    applySubtleStripBow(bent, STEP1_STRIP_LENGTH / 2);
    mesh.geometry.dispose();
    mesh.geometry = bent;

    return () => {
      bent.dispose();
    };
  }, []);

  useEffect(() => {
    return () => {
      textures.map.dispose();
      textures.bumpMap?.dispose();
    };
  }, [textures]);

  const seamColor = useMemo(() => darkenColor(textures.adjustedColor, 0.2), [textures.adjustedColor]);
  const rootPosition = local ? ([0, 0, 0] as const) : STEP1_STRIP_POSITION;
  const halfT = STEP1_STRIP_THICKNESS / 2;
  const seamZ = STEP1_STRIP_WIDTH / 2 - 0.018;
  const envIntensity = getCraftEnvMapIntensity(materialStyle.textureType, 'strip');

  const bodyMaterial = isSilk ? (
    <meshPhysicalMaterial
      color={textures.adjustedColor}
      roughness={materialStyle.roughness}
      metalness={0}
      sheen={materialStyle.sheen}
      sheenRoughness={0.42}
      sheenColor={textures.adjustedColor}
      clearcoat={materialStyle.clearcoat}
      clearcoatRoughness={materialStyle.clearcoatRoughness}
      bumpScale={0}
      envMapIntensity={envIntensity}
      anisotropy={0.55}
      anisotropyRotation={Math.PI / 2}
      onBeforeCompile={applyStripFaceShading}
      customProgramCacheKey={() => 'step1-strip-silk-body-v3'}
    />
  ) : (
    <meshPhysicalMaterial
      color={textures.adjustedColor}
      roughness={materialStyle.roughness}
      metalness={0}
      sheen={materialStyle.sheen}
      sheenRoughness={0.55}
      sheenColor={textures.adjustedColor}
      clearcoat={0}
      clearcoatRoughness={1}
      map={textures.map}
      bumpMap={textures.bumpMap}
      bumpScale={materialStyle.bumpScale}
      envMapIntensity={envIntensity}
      onBeforeCompile={applyStripFaceShading}
      customProgramCacheKey={() => 'step1-strip-cotton-v3'}
    />
  );

  return (
    <group position={rootPosition} rotation={[0, 0, 0]} renderOrder={10}>
      <RoundedBox
        ref={meshRef}
        args={[STEP1_STRIP_LENGTH, STEP1_STRIP_THICKNESS, STEP1_STRIP_WIDTH]}
        radius={STEP1_STRIP_EDGE_RADIUS}
        smoothness={STEP1_STRIP_EDGE_SMOOTHNESS}
        castShadow
        receiveShadow={false}
        renderOrder={10}
      >
        {bodyMaterial}
      </RoundedBox>

      {isSilk && (
        <mesh
          position={[0, halfT + 0.0004, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={12}
        >
          <planeGeometry args={[STEP1_STRIP_LENGTH * 0.96, STEP1_STRIP_WIDTH * 0.92]} />
          <meshPhysicalMaterial
            color={textures.adjustedColor}
            map={textures.map}
            roughness={materialStyle.roughness}
            metalness={0}
            sheen={materialStyle.sheen}
            sheenRoughness={0.45}
            sheenColor={textures.adjustedColor}
            clearcoat={materialStyle.clearcoat}
            clearcoatRoughness={materialStyle.clearcoatRoughness}
            envMapIntensity={envIntensity}
            transparent
            opacity={0.96}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            anisotropy={0.6}
            anisotropyRotation={Math.PI / 2}
            onBeforeCompile={applyStripFaceShading}
            customProgramCacheKey={() => 'step1-strip-silk-top-v3'}
          />
        </mesh>
      )}

      <mesh position={[0, halfT * 0.15, seamZ]} renderOrder={11} castShadow={false}>
        <boxGeometry args={[STEP1_STRIP_LENGTH * 0.92, 0.003, 0.005]} />
        <meshStandardMaterial
          color={seamColor}
          transparent
          opacity={0.32}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
