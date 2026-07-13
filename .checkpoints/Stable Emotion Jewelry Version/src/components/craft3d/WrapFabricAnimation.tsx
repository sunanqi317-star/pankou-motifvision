import { useMemo } from 'react';
import * as THREE from 'three';
import type { FabricMaterialStyle, FabricTypeId } from './fabricMaterials';
import { createCraftFabricTextures } from './fabricMaterialFactory';
import { MetalWireCore } from './MetalWireCore';
import { Step1MaterialStrip } from './Step1MaterialStrip';
import { WrappedCordSample } from './WrappedCordSample';
import { easeInOutCubic, smoothstep } from './animationEasing';
import {
  STEP1_STRIP_LENGTH,
  STEP1_STRIP_POSITION,
  STEP1_STRIP_THICKNESS,
  STEP1_STRIP_WIDTH,
} from './tableLayout';
import type { WrapStage } from './wrapStage';

interface WrapFabricAnimationProps {
  color: string;
  materialStyle: FabricMaterialStyle;
  fabricType: FabricTypeId;
  wrapStage: WrapStage;
  wrapProgress: number;
}

/**
 * Step 2 guided wrap: insert metal core, fold fabric sides inward, then form rounded cord.
 * No cloth simulation — staged crossfade with simple side-panel rotation.
 */
export function WrapFabricAnimation({
  color,
  materialStyle,
  fabricType,
  wrapStage,
  wrapProgress,
}: WrapFabricAnimationProps) {
  const foldT = useMemo(
    () => (wrapStage === 'folding' || wrapStage === 'wrapped' ? easeInOutCubic(wrapProgress) : 0),
    [wrapStage, wrapProgress],
  );

  const showStrip =
    wrapStage === 'flat' ||
    wrapStage === 'coreInserted' ||
    (wrapStage === 'folding' && foldT < 0.88);

  const showWire =
    wrapStage === 'coreInserted' || (wrapStage === 'folding' && foldT < 0.78);

  const showFoldPanels = wrapStage === 'folding' && foldT > 0.04 && foldT < 0.9;

  const stripScaleY = wrapStage === 'folding' ? THREE.MathUtils.lerp(1, 0.44, foldT) : 1;
  const stripScaleZ = wrapStage === 'folding' ? THREE.MathUtils.lerp(1, 0.1, foldT) : 1;
  const stripScaleX = wrapStage === 'folding' ? THREE.MathUtils.lerp(1, 0.97, foldT) : 1;

  const wireOpacity =
    wrapStage === 'folding' ? THREE.MathUtils.lerp(1, 0, smoothstep(0.5, 0.82, foldT)) : 1;

  const cordBlend =
    wrapStage === 'wrapped' ? 1 : wrapStage === 'folding' ? smoothstep(0.28, 0.94, foldT) : 0;

  const wrappedRadius = fabricType === 'silk' ? 0.062 : 0.058;
  const cordRadius = THREE.MathUtils.lerp(0.018, wrappedRadius, cordBlend);

  const foldAngle = foldT * Math.PI * 0.42;
  const panelDepth = STEP1_STRIP_WIDTH * 0.44;
  const panelLength = STEP1_STRIP_LENGTH * 0.96;
  const panelThickness = STEP1_STRIP_THICKNESS * 0.88;
  const panelLift = STEP1_STRIP_THICKNESS * 0.52;
  const panelOpacity = wrapStage === 'folding' ? THREE.MathUtils.lerp(1, 0, smoothstep(0.7, 0.95, foldT)) : 0;

  const foldTextures = useMemo(
    () => createCraftFabricTextures(color, materialStyle.textureType, materialStyle, 'strip'),
    [color, materialStyle],
  );

  return (
    <group renderOrder={2}>
      {showStrip && (
        <group
          position={STEP1_STRIP_POSITION}
          scale={[stripScaleX, stripScaleY, stripScaleZ]}
        >
          <Step1MaterialStrip color={color} materialStyle={materialStyle} local />
        </group>
      )}

      {showWire && <MetalWireCore opacity={wireOpacity} />}

      {showFoldPanels && panelOpacity > 0.02 && (
        <group position={STEP1_STRIP_POSITION} renderOrder={3}>
          <group position={[0, panelLift, -STEP1_STRIP_WIDTH / 2]} rotation={[foldAngle, 0, 0]}>
            <mesh position={[0, 0, panelDepth / 2]} castShadow>
              <boxGeometry args={[panelLength, panelThickness, panelDepth]} />
              <meshStandardMaterial
                color={foldTextures.adjustedColor}
                roughness={materialStyle.roughness}
                metalness={0}
                map={foldTextures.map}
                bumpMap={foldTextures.bumpMap}
                bumpScale={materialStyle.bumpScale * 0.85}
                transparent
                opacity={panelOpacity}
                side={THREE.DoubleSide}
                depthWrite={panelOpacity > 0.4}
              />
            </mesh>
          </group>
          <group position={[0, panelLift, STEP1_STRIP_WIDTH / 2]} rotation={[-foldAngle, 0, 0]}>
            <mesh position={[0, 0, -panelDepth / 2]} castShadow>
              <boxGeometry args={[panelLength, panelThickness, panelDepth]} />
              <meshStandardMaterial
                color={foldTextures.adjustedColor}
                roughness={materialStyle.roughness}
                metalness={0}
                map={foldTextures.map}
                bumpMap={foldTextures.bumpMap}
                bumpScale={materialStyle.bumpScale * 0.85}
                transparent
                opacity={panelOpacity}
                side={THREE.DoubleSide}
                depthWrite={panelOpacity > 0.4}
              />
            </mesh>
          </group>
        </group>
      )}

      {cordBlend > 0.02 && (
        <WrappedCordSample
          color={color}
          materialStyle={materialStyle}
          fabricType={fabricType}
          radius={cordRadius}
          opacity={cordBlend}
        />
      )}
    </group>
  );
}
