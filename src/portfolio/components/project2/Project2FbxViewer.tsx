import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Component,
  Suspense,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import type { EulerRotation } from '../../data/project2ReconstructionModels';
import {
  FIT_TARGET_SIZE,
  clearModelInstanceCache,
  computeWorldBoundingBox,
  detachModel,
  hasCachedModel,
  loadModelInstance,
} from './project2ModelLoader';
import styles from './Project2FbxViewer.module.css';

// Drop stale in-memory instances from older fit/center pipelines (HMR / prior session)
clearModelInstanceCache();

const CAMERA_PADDING = 1.15;
const CLICK_DRAG_THRESHOLD_SQ = 144;
const DEFAULT_ROTATION: EulerRotation = [0, 0, 0];

function adjustCameraToModel(
  camera: THREE.PerspectiveCamera,
  maxDim: number,
  padding: number = CAMERA_PADDING,
): number {
  const safeDim = Number.isFinite(maxDim) && maxDim > 0.1 ? maxDim : FIT_TARGET_SIZE;
  const fovRadians = (camera.fov * Math.PI) / 180;
  const distance = (safeDim / 2 / Math.tan(fovRadians / 2)) * padding;
  const verticalLift = safeDim * 0.04;

  camera.position.set(0, verticalLift, Math.max(distance, 1.6));
  camera.near = Math.max(0.01, distance / 100);
  camera.far = Math.max(100, distance * 20);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  return distance;
}

type DisplayedModel = {
  url: string;
  model: THREE.Object3D;
  rotation: EulerRotation;
  scale: number;
};

/**
 * Loads only the requested URL. Cached models swap instantly.
 * Keeps the previous model visible while a new one downloads.
 */
function useModelSceneInstance(url: string, rotation: EulerRotation, scale: number) {
  const [displayed, setDisplayed] = useState<DisplayedModel | null>(null);
  const [isLoading, setIsLoading] = useState(() => !hasCachedModel(url));
  const [error, setError] = useState<Error | null>(null);
  const requestIdRef = useRef(0);
  const rotationKey = `${rotation[0]},${rotation[1]},${rotation[2]}`;

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    setError(null);

    const applyInstance = (instance: THREE.Object3D) => {
      if (cancelled || requestId !== requestIdRef.current) return;

      // Ensure the cached root is free to attach to the current R3F tree
      detachModel(instance);
      instance.visible = true;
      instance.traverse((child) => {
        child.visible = true;
      });

      setDisplayed({ url, model: instance, rotation, scale });
      setIsLoading(false);
      setError(null);
    };

    if (hasCachedModel(url)) {
      setIsLoading(false);
      void loadModelInstance(url).then(applyInstance).catch((loadError) => {
        if (cancelled || requestId !== requestIdRef.current) return;
        console.error('[Project2 3D] Cached model apply failed:', url, loadError);
        setError(loadError instanceof Error ? loadError : new Error('Failed to load 3D model'));
        setIsLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);

    loadModelInstance(url)
      .then(applyInstance)
      .catch((loadError) => {
        if (cancelled || requestId !== requestIdRef.current) return;
        console.error('[Project2 3D] Model load failed:', url, loadError);
        setError(loadError instanceof Error ? loadError : new Error('Failed to load 3D model'));
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // rotationKey captures rotation tuple changes without unstable array identity issues
  }, [url, rotationKey, rotation, scale]);

  return {
    displayed,
    isLoading,
    error,
    hasVisibleModel: displayed !== null,
  };
}

function ClickableModelPrimitive({
  model,
  onModelClick,
}: {
  model: THREE.Object3D;
  onModelClick: () => void;
}) {
  const { camera, raycaster, gl } = useThree();
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const pointerDragged = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      pointerStart.current = { x: event.clientX, y: event.clientY };
      pointerDragged.current = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      const start = pointerStart.current;
      if (!start || pointerDragged.current) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (dx * dx + dy * dy > CLICK_DRAG_THRESHOLD_SQ) {
        pointerDragged.current = true;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (!start || pointerDragged.current) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (dx * dx + dy * dy > CLICK_DRAG_THRESHOLD_SQ) return;

      const rect = canvas.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(model, true);
      if (hits.length > 0) {
        onModelClick();
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
    };
  }, [camera, gl, model, onModelClick, raycaster]);

  return <primitive object={model} />;
}

const FittedModel = memo(function FittedModel({
  model,
  rotation,
  scale,
  controlsRef,
  onModelClick,
}: {
  model: THREE.Object3D;
  rotation: EulerRotation;
  scale: number;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  onModelClick?: () => void;
}) {
  const { camera } = useThree();
  const rootRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const root = rootRef.current;
    if (!root) return;

    root.updateMatrixWorld(true);
    const fittedBox = computeWorldBoundingBox(root);
    const fittedSize = new THREE.Vector3();
    fittedBox.getSize(fittedSize);

    const maxDim = Math.max(fittedSize.x, fittedSize.y, fittedSize.z, FIT_TARGET_SIZE);
    const distance = adjustCameraToModel(camera, maxDim);
    const controls = controlsRef.current;

    if (controls) {
      controls.target.set(0, 0, 0);
      controls.minDistance = Math.max(0.6, distance * 0.45);
      controls.maxDistance = Math.max(controls.minDistance + 2, distance * 3);
      controls.update();
    }
  }, [camera, controlsRef, model, rotation, scale]);

  return (
    <group
      ref={rootRef}
      position={[0, 0, 0]}
      rotation={rotation as unknown as [number, number, number]}
      scale={scale}
    >
      {onModelClick ? (
        <ClickableModelPrimitive model={model} onModelClick={onModelClick} />
      ) : (
        <primitive object={model} />
      )}
    </group>
  );
});

type ModelErrorBoundaryProps = {
  children: ReactNode;
  error: Error | null;
  resetKey: string;
};

type ModelErrorBoundaryState = {
  caughtError: Error | null;
};

class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { caughtError: null };

  static getDerivedStateFromError(error: Error): ModelErrorBoundaryState {
    return { caughtError: error };
  }

  componentDidCatch(error: Error) {
    console.error('[Project2 3D] render error', error);
  }

  componentDidUpdate(prevProps: ModelErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.caughtError) {
      this.setState({ caughtError: null });
    }
  }

  render() {
    // Only hide on render exceptions — load failures use the overlay, not a blank scene
    if (this.state.caughtError) {
      return null;
    }

    return this.props.children;
  }
}

function RendererColorSetup() {
  const { gl } = useThree();

  useLayoutEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = 1.0;
  }, [gl]);

  return null;
}

function SceneEnvironment() {
  return <Environment preset="studio" environmentIntensity={0.22} />;
}

const ViewerScene = memo(function ViewerScene({
  sceneModel,
  rotation,
  scale,
  onModelClick,
}: {
  sceneModel: THREE.Object3D | null;
  rotation: EulerRotation;
  scale: number;
  onModelClick?: () => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <RendererColorSetup />
      <color attach="background" args={['#fbf7ef']} />

      <ambientLight intensity={0.38} color="#f6efe6" />
      <hemisphereLight args={['#fff8f0', '#d2c2b2', 0.42]} />
      <directionalLight
        position={[2.2, 3.8, 5.2]}
        intensity={1.05}
        color="#fff6ec"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3.4, 2.6, 3.8]} intensity={0.48} color="#f0e4d6" />
      <directionalLight position={[0.2, 1.4, 4.6]} intensity={0.36} color="#fffaf3" />
      <directionalLight position={[0.6, 2.8, -3.4]} intensity={0.12} color="#f5e6d6" />

      {/* Suspense so HDRI load cannot blank the whole Canvas */}
      <Suspense fallback={null}>
        <SceneEnvironment />
      </Suspense>

      {sceneModel ? (
        <FittedModel
          model={sceneModel}
          rotation={rotation}
          scale={scale}
          controlsRef={controlsRef}
          onModelClick={onModelClick}
        />
      ) : null}

      <ContactShadows position={[0, -0.42, 0]} opacity={0.24} scale={8} blur={2.6} far={4} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        target={[0, 0, 0]}
        minDistance={0.8}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
});

interface Project2FbxViewerProps {
  modelPath: string;
  rotation?: EulerRotation;
  scale?: number;
  onModelClick?: () => void;
  viewerClassName?: string;
  hint?: string;
}

function Project2FbxViewerComponent({
  modelPath,
  rotation = DEFAULT_ROTATION,
  scale = 1,
  onModelClick,
  viewerClassName,
  hint,
}: Project2FbxViewerProps) {
  const { displayed, isLoading, error, hasVisibleModel } = useModelSceneInstance(
    modelPath,
    rotation,
    scale,
  );

  const hintText = useMemo(
    () =>
      hint ??
      (onModelClick
        ? 'Drag to rotate · Scroll to zoom · Click artifact for structure'
        : 'Drag to rotate · Scroll to zoom'),
    [hint, onModelClick],
  );

  const canvasGl = useMemo(
    () => ({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
      outputColorSpace: THREE.SRGBColorSpace,
      toneMapping: THREE.NeutralToneMapping,
      toneMappingExposure: 1.0,
      powerPreference: 'high-performance' as const,
    }),
    [],
  );

  const showError = Boolean(error) && !isLoading;

  return (
    <div
      className={`${styles.viewer}${onModelClick ? ` ${styles.viewerClickable}` : ''}${
        viewerClassName ? ` ${viewerClassName}` : ''
      }`}
      aria-label="Interactive 3D Pankou model viewer"
      aria-busy={isLoading}
    >
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.35, 2.8], fov: 42 }} gl={canvasGl}>
        <ModelErrorBoundary error={error} resetKey={modelPath}>
          <ViewerScene
            sceneModel={showError ? null : displayed?.model ?? null}
            rotation={displayed?.rotation ?? rotation}
            scale={displayed?.scale ?? scale}
            onModelClick={onModelClick}
          />
        </ModelErrorBoundary>
      </Canvas>

      {isLoading ? (
        <p
          className={`${styles.viewerLoading}${hasVisibleModel ? ` ${styles.viewerLoadingSoft}` : ''}`}
        >
          Loading 3D reconstruction...
        </p>
      ) : null}

      {showError ? (
        <p className={styles.viewerError} role="alert">
          Failed to load 3D model
        </p>
      ) : null}

      <p className={styles.viewerHint}>{hintText}</p>
    </div>
  );
}

export const Project2FbxViewer = memo(Project2FbxViewerComponent);
