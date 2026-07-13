import { Center, ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Component,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import styles from './Project2FbxViewer.module.css';

const FIT_TARGET_SIZE = 1.48;
const CAMERA_PADDING = 1.06;
const CLICK_DRAG_THRESHOLD_SQ = 144;

const modelTemplateCache = new Map<string, THREE.Object3D>();
const modelLoadPromises = new Map<string, Promise<THREE.Object3D>>();

function computeWorldBoundingBox(model: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  let hasGeometry = false;

  model.updateMatrixWorld(true);
  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;

    mesh.geometry.computeBoundingBox();
    if (!mesh.geometry.boundingBox) return;

    const geometryBox = mesh.geometry.boundingBox.clone();
    geometryBox.applyMatrix4(mesh.matrixWorld);
    box.union(geometryBox);
    hasGeometry = true;
  });

  if (!hasGeometry) {
    box.setFromObject(model);
  }

  return box;
}

function autoFitModel(model: THREE.Object3D, targetSize: number = FIT_TARGET_SIZE): number {
  const box = computeWorldBoundingBox(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);

  if (!Number.isFinite(maxDim) || maxDim <= 0) {
    return 1;
  }

  const scale = targetSize / maxDim;
  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);
  return scale;
}

function adjustCameraToModel(
  camera: THREE.PerspectiveCamera,
  maxDim: number,
  padding: number = CAMERA_PADDING,
): number {
  const fovRadians = (camera.fov * Math.PI) / 180;
  const distance = (maxDim / 2 / Math.tan(fovRadians / 2)) * padding;
  const verticalLift = maxDim * 0.02;

  camera.position.set(0, verticalLift, distance);
  camera.near = Math.max(0.01, distance / 100);
  camera.far = Math.max(100, distance * 20);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  return distance;
}

function prepareFittedModel(source: THREE.Object3D): THREE.Object3D {
  const model = source.clone(true);

  model.visible = true;
  model.traverse((child) => {
    child.visible = true;

    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.frustumCulled = false;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      if (!material) return;
      material.visible = true;
      material.side = THREE.DoubleSide;
      material.needsUpdate = true;

      if ('color' in material && material.color instanceof THREE.Color && !('map' in material && material.map)) {
        const hsl = { h: 0, s: 0, l: 0 };
        material.color.getHSL(hsl);
        if (hsl.l > 0.82) {
          material.color.set('#9a6a58');
        }
      }
    });
  });

  model.updateMatrixWorld(true);
  autoFitModel(model, FIT_TARGET_SIZE);

  return model;
}

function loadFbxTemplate(url: string): Promise<THREE.Object3D> {
  const cached = modelTemplateCache.get(url);
  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = modelLoadPromises.get(url);
  if (pending) {
    return pending;
  }

  const promise = new Promise<THREE.Object3D>((resolve, reject) => {
    const loader = new FBXLoader();
    loader.load(
      url,
      (fbx) => {
        const prepared = prepareFittedModel(fbx);
        modelTemplateCache.set(url, prepared);
        modelLoadPromises.delete(url);
        resolve(prepared);
      },
      undefined,
      (error) => {
        modelLoadPromises.delete(url);
        reject(error instanceof Error ? error : new Error('Failed to load FBX model'));
      },
    );
  });

  modelLoadPromises.set(url, promise);
  return promise;
}

function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.geometry.dispose();

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      material.dispose();
    });
  });
}

function useFbxSceneInstance(url: string) {
  const [sceneModel, setSceneModel] = useState<THREE.Object3D | null>(null);
  const [isLoading, setIsLoading] = useState(() => !modelTemplateCache.has(url));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const applyTemplate = (template: THREE.Object3D) => {
      if (cancelled) return;

      setSceneModel((previous) => {
        if (previous) {
          disposeObject3D(previous);
        }
        return template.clone(true);
      });
      setIsLoading(false);
      setError(null);
    };

    setError(null);

    if (modelTemplateCache.has(url)) {
      applyTemplate(modelTemplateCache.get(url)!);
    } else {
      setIsLoading(true);
      loadFbxTemplate(url)
        .then(applyTemplate)
        .catch((loadError) => {
          if (cancelled) return;
          setError(loadError instanceof Error ? loadError : new Error('Failed to load FBX model'));
          setIsLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    return () => {
      setSceneModel((previous) => {
        if (previous) {
          disposeObject3D(previous);
        }
        return null;
      });
    };
  }, []);

  return { sceneModel, isLoading, error };
}

function ClickableFbxPrimitive({
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

function FbxModel({
  model,
  controlsRef,
  onModelClick,
  cameraFittedRef,
}: {
  model: THREE.Object3D;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  onModelClick?: () => void;
  cameraFittedRef: RefObject<boolean>;
}) {
  const { camera } = useThree();

  useLayoutEffect(() => {
    if (cameraFittedRef.current) return;
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const fittedBox = computeWorldBoundingBox(model);
    const fittedSize = new THREE.Vector3();
    fittedBox.getSize(fittedSize);
    const maxDim = Math.max(
      fittedSize.x,
      fittedSize.y,
      fittedSize.z,
      FIT_TARGET_SIZE,
    );

    const distance = adjustCameraToModel(camera, maxDim);
    const controls = controlsRef.current;

    if (controls) {
      controls.target.set(0, 0, 0);
      controls.minDistance = Math.max(0.8, distance * 0.55);
      controls.maxDistance = Math.max(controls.minDistance + 1.5, distance * 2.6);
      controls.update();
    }

    cameraFittedRef.current = true;
  }, [camera, cameraFittedRef, controlsRef, model]);

  return (
    <Center>
      {onModelClick ? (
        <ClickableFbxPrimitive model={model} onModelClick={onModelClick} />
      ) : (
        <primitive object={model} />
      )}
    </Center>
  );
}

type FbxErrorBoundaryProps = {
  children: ReactNode;
  error: Error | null;
};

type FbxErrorBoundaryState = {
  caughtError: Error | null;
};

class FbxErrorBoundary extends Component<FbxErrorBoundaryProps, FbxErrorBoundaryState> {
  state: FbxErrorBoundaryState = { caughtError: null };

  static getDerivedStateFromError(error: Error): FbxErrorBoundaryState {
    return { caughtError: error };
  }

  componentDidCatch(error: Error) {
    console.error('[FBX] render error', error);
  }

  render() {
    if (this.state.caughtError || this.props.error) {
      return null;
    }

    return this.props.children;
  }
}

function ViewerScene({
  sceneModel,
  onModelClick,
}: {
  sceneModel: THREE.Object3D | null;
  onModelClick?: () => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraFittedRef = useRef(false);

  return (
    <>
      <color attach="background" args={['#fbf7ef']} />
      <ambientLight intensity={0.75} color="#fff7ec" />
      <hemisphereLight args={['#fff7ec', '#d8c8b8', 0.55]} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.05}
        color="#fff5e8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2, 3, -2]} intensity={0.28} color="#f5ebe0" />
      {sceneModel ? (
        <FbxModel
          model={sceneModel}
          controlsRef={controlsRef}
          onModelClick={onModelClick}
          cameraFittedRef={cameraFittedRef}
        />
      ) : null}
      <ContactShadows
        position={[0, -0.35, 0]}
        opacity={0.35}
        scale={8}
        blur={2.5}
        far={4}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={1.2}
        maxDistance={4.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

interface Project2FbxViewerProps {
  modelPath: string;
  onModelClick?: () => void;
  viewerClassName?: string;
  hint?: string;
}

export function Project2FbxViewer({
  modelPath,
  onModelClick,
  viewerClassName,
  hint,
}: Project2FbxViewerProps) {
  const { sceneModel, isLoading, error } = useFbxSceneInstance(modelPath);
  const hintText =
    hint ??
    (onModelClick
      ? 'Drag to rotate · Scroll to zoom · Click artifact for structure'
      : 'Drag to rotate · Scroll to zoom');

  return (
    <div
      className={`${styles.viewer}${onModelClick ? ` ${styles.viewerClickable}` : ''}${
        viewerClassName ? ` ${viewerClassName}` : ''
      }`}
      aria-label="Interactive 3D Pankou model viewer"
      aria-busy={isLoading}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.35, 2.4], fov: 42 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      >
        <FbxErrorBoundary error={error}>
          <ViewerScene sceneModel={sceneModel} onModelClick={onModelClick} />
        </FbxErrorBoundary>
      </Canvas>
      {isLoading ? <p className={styles.viewerLoading}>Loading 3D Model...</p> : null}
      <p className={styles.viewerHint}>{hintText}</p>
    </div>
  );
}
