import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import type { CraftType } from '../../utils/craftGame';
import type { FabricMaterialStyle, FabricTypeId } from './fabricMaterials';
import { CraftTableProps } from './CraftTableProps';
import { CraftTable } from './CraftTable';
import { FixNodes } from './FixNodes';
import { MaterialPrepGuide } from './MaterialPrepGuide';
import { WrapFabricAnimation } from './WrapFabricAnimation';
import type { WrapStage } from './wrapStage';
import { WrappedCordSample } from './WrappedCordSample';
import { Step1MaterialStrip } from './Step1MaterialStrip';
import { Step1Placeholder } from './Step1Placeholder';
import { resolveStep1StripView } from './step1StripResolve';
import { SceneCamera, useSceneCameraPreset } from './SceneCamera';
import type { PankouCurveConfig } from './pankouCurves';

export type Craft3DStep = 'material' | 'wrap' | 'coil' | 'fix' | 'shape' | 'assemble' | 'complete';

export const PANKOU_SCALE = 2.1;

const SCENE_BACKGROUND = '#f7f2ea';

interface PankouSceneProps {
  curveConfig: PankouCurveConfig;
  craftType: CraftType | null;
  step: Craft3DStep;
  wrapProgress: number;
  wrapStage: WrapStage;
  coilAnimating: boolean;
  svgCoilActive: boolean;
  guidePoints: THREE.Vector3[];
  coiled: boolean;
  fixedNodeIds: Set<string>;
  onNodeClick: (id: string) => void;
  shaping: 'soft' | 'strong' | null;
  showClasp: boolean;
  showLoop: boolean;
  fabricColor: string;
  fabricStyle: FabricMaterialStyle;
  fabricType: FabricTypeId;
  hasFabricSelected: boolean;
  hasColorSelected: boolean;
}

function SceneLighting({ step }: { step: Craft3DStep }) {
  const closeWork = step === 'material' || step === 'wrap' || step === 'coil';
  const isMaterial = step === 'material';
  const isWrap = step === 'wrap';
  const closeAmbient = isMaterial ? 0.65 : isWrap ? 0.8 : 0.9;
  const closeHemi = isMaterial ? 0.55 : isWrap ? 0.58 : 0.6;

  return (
    <>
      <ambientLight intensity={closeAmbient} color="#fff7ec" />
      <hemisphereLight args={['#fff7ec', '#d8c8b8', closeHemi]} />
      <directionalLight
        position={isMaterial || isWrap ? [3, 4, 3] : [3, 5, 4]}
        intensity={isMaterial ? 1.1 : isWrap ? 1.05 : 1.0}
        color="#fff5e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={18}
        shadow-camera-left={closeWork ? -2.5 : -5}
        shadow-camera-right={closeWork ? 2.5 : 5}
        shadow-camera-top={closeWork ? 2.5 : 5}
        shadow-camera-bottom={closeWork ? -2.5 : -5}
        shadow-bias={-0.00012}
        shadow-radius={4}
      />
      <directionalLight
        position={[-2, 4, -2]}
        intensity={isMaterial ? 0.22 : isWrap ? 0.25 : 0.28}
        color="#f5ebe0"
      />
    </>
  );
}

function SceneContent({
  curveConfig,
  craftType,
  step,
  wrapProgress,
  wrapStage,
  coilAnimating,
  svgCoilActive,
  coiled,
  guidePoints,
  fixedNodeIds,
  onNodeClick,
  shaping,
  showClasp,
  showLoop,
  fabricColor,
  fabricStyle,
  fabricType,
  hasFabricSelected,
  hasColorSelected,
}: {
  curveConfig: PankouCurveConfig;
  craftType: CraftType | null;
  step: Craft3DStep;
  wrapProgress: number;
  wrapStage: WrapStage;
  coilAnimating: boolean;
  svgCoilActive: boolean;
  guidePoints: THREE.Vector3[];
  coiled: boolean;
  fixedNodeIds: Set<string>;
  onNodeClick: (id: string) => void;
  shaping: 'soft' | 'strong' | null;
  showClasp: boolean;
  showLoop: boolean;
  fabricColor: string;
  fabricStyle: FabricMaterialStyle;
  fabricType: FabricTypeId;
  hasFabricSelected: boolean;
  hasColorSelected: boolean;
}) {
  const cameraPreset = useSceneCameraPreset(step);
  const isSampleStep = step === 'material' || step === 'wrap';
  const closeWork = isSampleStep || step === 'coil';
  const isMaterialStep = step === 'material';
  const step1Strip = resolveStep1StripView(
    fabricType,
    fabricColor,
    fabricStyle,
    hasFabricSelected,
    hasColorSelected,
  );
  const endPoints = useMemo(() => {
    const start = guidePoints[0] ?? new THREE.Vector3(-1.25, 0.12, 0);
    const end = guidePoints[guidePoints.length - 1] ?? new THREE.Vector3(1.25, 0.12, 0);
    return { start, end };
  }, [guidePoints]);

  const requiredNodeIds =
    craftType === 'Hard Pankou' ? curveConfig.hardNodeIds : curveConfig.softNodeIds;

  const isCoilStep = step === 'coil';
  const showStraightCord =
    isCoilStep &&
    hasFabricSelected &&
    hasColorSelected &&
    !svgCoilActive &&
    !coiled &&
    !coilAnimating;
  const showFixNodes =
    (step === 'fix' || step === 'shape' || step === 'assemble' || step === 'complete') && coiled;

  return (
    <>
      <SceneCamera step={step} />
      <SceneLighting step={step} />

      <CraftTable />
      <CraftTableProps step={step} />

      {closeWork && (
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={step === 'coil' ? 0.24 : step === 'material' ? 0.28 : 0.2}
          scale={step === 'coil' ? 6.5 : 5}
          blur={2.5}
          far={step === 'coil' ? 1.4 : 1}
          resolution={512}
          color="#2a2018"
        />
      )}

      {isMaterialStep && <MaterialPrepGuide visible />}

      {isMaterialStep &&
        (step1Strip.selectionComplete ? (
          <Step1MaterialStrip
            key={`${step1Strip.fabricType}-${step1Strip.colorHex}`}
            color={step1Strip.colorHex}
            materialStyle={step1Strip.materialStyle}
          />
        ) : (
          <Step1Placeholder />
        ))}

      {step === 'wrap' && hasFabricSelected && hasColorSelected && (
        <WrapFabricAnimation
          color={fabricColor}
          materialStyle={fabricStyle}
          fabricType={fabricType}
          wrapStage={wrapStage}
          wrapProgress={wrapProgress}
        />
      )}

      {showStraightCord && (
        <WrappedCordSample
          color={fabricColor}
          materialStyle={fabricStyle}
          fabricType={fabricType}
        />
      )}

      {!isSampleStep && (
        <group position={[0, 0, 0]}>
          {showFixNodes && (
            <FixNodes
              nodes={curveConfig.nodes}
              requiredIds={requiredNodeIds}
              fixedIds={fixedNodeIds}
              onNodeClick={onNodeClick}
              emphasize={shaping === 'strong'}
            />
          )}

          {showClasp && (
            <mesh position={endPoints.start.clone().add(new THREE.Vector3(0, 0.06, 0))} castShadow>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#5c4a32" metalness={0.35} roughness={0.4} />
            </mesh>
          )}

          {showLoop && (
            <mesh
              position={endPoints.end.clone().add(new THREE.Vector3(0, 0.06, 0))}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <torusGeometry args={[0.1, 0.025, 12, 24]} />
              <meshStandardMaterial color="#6b5a42" metalness={0.3} roughness={0.45} />
            </mesh>
          )}
        </group>
      )}

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={cameraPreset.minDistance}
        maxDistance={cameraPreset.maxDistance}
        minPolarAngle={isSampleStep ? Math.PI / 4.5 : Math.PI / 5}
        maxPolarAngle={isSampleStep ? Math.PI / 2.15 : Math.PI / 2.2}
        target={isSampleStep && step === 'material' ? [0, 0.05, 0] : isSampleStep ? [0, 0.08, 0] : cameraPreset.target}
      />
    </>
  );
}

export function PankouScene({
  curveConfig,
  craftType,
  step,
  wrapProgress,
  wrapStage,
  coilAnimating,
  svgCoilActive,
  coiled,
  guidePoints,
  fixedNodeIds,
  onNodeClick,
  shaping,
  showClasp,
  showLoop,
  fabricColor,
  fabricStyle,
  fabricType,
  hasFabricSelected,
  hasColorSelected,
}: PankouSceneProps) {
  const initialCamera = useSceneCameraPreset(step);

  return (
    <Canvas
      shadows
      camera={{
        position: initialCamera.position.toArray(),
        fov: initialCamera.fov,
        near: 0.1,
        far: 50,
      }}
      gl={{ antialias: true }}
      style={{ background: SCENE_BACKGROUND, width: '100%', height: '100%' }}
    >
      <color attach="background" args={[SCENE_BACKGROUND]} />
      <Suspense fallback={null}>
        <SceneContent
          curveConfig={curveConfig}
          craftType={craftType}
          step={step}
          wrapProgress={wrapProgress}
          wrapStage={wrapStage}
          coilAnimating={coilAnimating}
          svgCoilActive={svgCoilActive}
          coiled={coiled}
          guidePoints={guidePoints}
          fixedNodeIds={fixedNodeIds}
          onNodeClick={onNodeClick}
          shaping={shaping}
          showClasp={showClasp}
          showLoop={showLoop}
          fabricColor={fabricColor}
          fabricStyle={fabricStyle}
          fabricType={fabricType}
          hasFabricSelected={hasFabricSelected}
          hasColorSelected={hasColorSelected}
        />
      </Suspense>
    </Canvas>
  );
}
