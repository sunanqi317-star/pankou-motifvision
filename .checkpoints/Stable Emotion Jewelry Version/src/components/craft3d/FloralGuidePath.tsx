import * as THREE from 'three';
import { GuidePath } from './GuidePath';
import { FLORAL_TABLE_Y, getHardFloralPankouPaths } from './hardFloralPankou';

const GUIDE_Y = FLORAL_TABLE_Y - 0.012;

interface FloralGuidePathProps {
  visible: boolean;
  faded?: boolean;
}

/** Per-segment dashed guides — avoids spurious lines between disconnected floral parts. */
export function FloralGuidePath({ visible, faded = false }: FloralGuidePathProps) {
  const paths = getHardFloralPankouPaths();
  const segments = [
    ...paths.segments.centerCord,
    ...paths.segments.leftSpiral,
    ...paths.segments.rightSpiral,
    ...paths.segments.leftPetals,
    ...paths.segments.rightPetals,
    ...paths.segments.centralKnot,
  ];

  if (!visible) return null;

  return (
    <group>
      {segments.map((segment) => (
        <GuidePath
          key={`guide-${segment.id}`}
          points={segment.points.map((pt) => new THREE.Vector3(pt.x, GUIDE_Y, pt.z))}
          closed={segment.closed}
          visible
          opacity={faded ? 0.08 : 0.2}
        />
      ))}
    </group>
  );
}
