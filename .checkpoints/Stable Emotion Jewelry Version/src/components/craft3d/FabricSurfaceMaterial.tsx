import { useEffect, useMemo } from 'react';
import type { FabricMaterialStyle } from './fabricMaterials';
import { createFabricTextures } from './fabricTextures';

interface FabricSurfaceMaterialProps {
  color: string;
  materialStyle: FabricMaterialStyle;
}

export function useFabricSurfaceMaps(color: string, materialStyle: FabricMaterialStyle) {
  const textures = useMemo(
    () => createFabricTextures(color, materialStyle.textureType, materialStyle),
    [color, materialStyle],
  );

  useEffect(() => {
    return () => {
      textures.map.dispose();
      textures.bumpMap?.dispose();
    };
  }, [textures]);

  return textures;
}

export function FabricSurfaceMaterial({ color, materialStyle }: FabricSurfaceMaterialProps) {
  const textures = useFabricSurfaceMaps(color, materialStyle);

  return (
    <meshPhysicalMaterial
      color={textures.adjustedColor}
      roughness={materialStyle.roughness}
      metalness={materialStyle.metalness}
      sheen={materialStyle.sheen}
      sheenRoughness={materialStyle.textureType === 'silkGradient' ? 0.28 : 0.42}
      sheenColor={textures.adjustedColor}
      clearcoat={materialStyle.clearcoat}
      clearcoatRoughness={materialStyle.clearcoatRoughness}
      map={textures.map}
      bumpMap={textures.bumpMap}
      bumpScale={materialStyle.bumpScale}
      envMapIntensity={materialStyle.textureType === 'silkGradient' ? 0.4 : 0.2}
    />
  );
}
