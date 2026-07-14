import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export const FIT_TARGET_SIZE = 1.48;
const DRACO_DECODER_PATH = '/draco/';

THREE.Cache.enabled = true;

/** Prepared scene roots — reused across tab switches (no network reload). */
const modelInstanceCache = new Map<string, THREE.Object3D>();
const modelLoadPromises = new Map<string, Promise<THREE.Object3D>>();

/** Clear in-memory instances (used after fit/center pipeline changes). */
export function clearModelInstanceCache() {
  modelInstanceCache.clear();
  modelLoadPromises.clear();
}

let sharedDracoLoader: DRACOLoader | null = null;
let sharedGltfLoader: GLTFLoader | null = null;

export function isGlbPath(url: string): boolean {
  return /\.glb(?:$|\?)/i.test(url) || /\.gltf(?:$|\?)/i.test(url);
}

export function hasCachedModel(url: string): boolean {
  return modelInstanceCache.has(url);
}

function getGltfLoader(): GLTFLoader {
  if (sharedGltfLoader) {
    return sharedGltfLoader;
  }

  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader();
    sharedDracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    sharedDracoLoader.setDecoderConfig({ type: 'wasm' });
  }

  const loader = new GLTFLoader();
  loader.setDRACOLoader(sharedDracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  sharedGltfLoader = loader;
  return loader;
}

export function computeWorldBoundingBox(model: THREE.Object3D): THREE.Box3 {
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  return box;
}

/** Uniform-scale to FIT_TARGET_SIZE, then center at origin (scale before center). */
export function centerAndFitModel(model: THREE.Object3D, targetSize: number = FIT_TARGET_SIZE): {
  size: THREE.Vector3;
  scale: number;
} {
  model.position.set(0, 0, 0);
  model.rotation.set(0, 0, 0);
  model.scale.set(1, 1, 1);
  model.updateMatrixWorld(true);

  const initialBox = computeWorldBoundingBox(model);
  if (initialBox.isEmpty()) {
    return { size: new THREE.Vector3(1, 1, 1), scale: 1 };
  }

  const initialSize = new THREE.Vector3();
  initialBox.getSize(initialSize);
  const maxDim = Math.max(initialSize.x, initialSize.y, initialSize.z);
  const scale =
    Number.isFinite(maxDim) && maxDim > 1e-6 ? targetSize / maxDim : 1;

  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);

  const fittedBox = computeWorldBoundingBox(model);
  const center = new THREE.Vector3();
  const fittedSize = new THREE.Vector3();
  fittedBox.getCenter(center);
  fittedBox.getSize(fittedSize);

  model.position.x -= center.x;
  model.position.y -= center.y;
  model.position.z -= center.z;
  model.updateMatrixWorld(true);

  return { size: fittedSize, scale };
}

function configureColorTextures(material: THREE.Material) {
  const textured = material as THREE.MeshStandardMaterial & {
    sheenColorMap?: THREE.Texture | null;
    specularColorMap?: THREE.Texture | null;
  };

  const colorMaps = [
    textured.map,
    textured.emissiveMap,
    textured.sheenColorMap,
    textured.specularColorMap,
  ];

  colorMaps.forEach((map) => {
    if (!map) return;
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
  });
}

function prepareFittedModel(source: THREE.Object3D, preserveMaterials: boolean): THREE.Object3D {
  const model = source.clone(true);

  model.visible = true;
  model.traverse((child) => {
    child.visible = true;

    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    // Avoid accidental frustum culling when bounds are recalculated after fit
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      if (!material) return;
      material.visible = true;

      if (preserveMaterials) {
        configureColorTextures(material);
        material.needsUpdate = true;
        return;
      }

      material.side = THREE.DoubleSide;
      material.needsUpdate = true;
    });
  });

  centerAndFitModel(model, FIT_TARGET_SIZE);
  return model;
}

/**
 * Load a model once and cache the prepared scene root.
 * Subsequent calls for the same URL resolve instantly from memory.
 */
export function loadModelInstance(url: string): Promise<THREE.Object3D> {
  const cached = modelInstanceCache.get(url);
  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = modelLoadPromises.get(url);
  if (pending) {
    return pending;
  }

  const preserveMaterials = isGlbPath(url);

  const promise = new Promise<THREE.Object3D>((resolve, reject) => {
    const onLoaded = (root: THREE.Object3D) => {
      try {
        const prepared = prepareFittedModel(root, preserveMaterials);
        const box = computeWorldBoundingBox(prepared);
        const size = new THREE.Vector3();
        box.getSize(size);

        if (box.isEmpty() || !Number.isFinite(size.x)) {
          throw new Error('Model bounding box is empty after load');
        }

        modelInstanceCache.set(url, prepared);
        modelLoadPromises.delete(url);
        resolve(prepared);
      } catch (error) {
        modelLoadPromises.delete(url);
        reject(error instanceof Error ? error : new Error('Failed to load 3D model'));
      }
    };

    const onError = (error: unknown) => {
      modelLoadPromises.delete(url);
      console.error('[Project2 3D] Failed to load model:', url, error);
      reject(error instanceof Error ? error : new Error('Failed to load 3D model'));
    };

    if (preserveMaterials) {
      getGltfLoader().load(url, (gltf) => onLoaded(gltf.scene), undefined, onError);
      return;
    }

    const loader = new FBXLoader();
    loader.load(url, onLoaded, undefined, onError);
  });

  modelLoadPromises.set(url, promise);
  return promise;
}

/** Detach a cached root from any previous scene graph before re-attaching. */
export function detachModel(model: THREE.Object3D) {
  if (model.parent) {
    model.parent.remove(model);
  }
}
