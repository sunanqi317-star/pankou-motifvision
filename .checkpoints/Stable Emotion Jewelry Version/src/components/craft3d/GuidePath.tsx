import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { buildCurve } from './pankouCurves';

const GUIDE_COLOR = new THREE.Color(142 / 255, 91 / 255, 56 / 255);

interface GuidePathProps {
  points: THREE.Vector3[];
  closed: boolean;
  visible: boolean;
  opacity?: number;
}

export function GuidePath({ points, closed, visible, opacity = 0.22 }: GuidePathProps) {
  const line = useMemo(() => {
    const sampled = closed
      ? buildCurve(points, true).getPoints(64)
      : points.length > 1
        ? buildCurve(points, false).getPoints(Math.min(64, points.length * 4))
        : points;
    const geometry = new THREE.BufferGeometry().setFromPoints(sampled);
    const material = new THREE.LineDashedMaterial({
      color: GUIDE_COLOR,
      transparent: true,
      opacity,
      dashSize: 0.08,
      gapSize: 0.06,
      depthWrite: false,
    });
    const lineObj = new THREE.Line(geometry, material);
    lineObj.computeLineDistances();
    lineObj.renderOrder = 1;
    return lineObj;
  }, [points, closed, opacity]);

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    };
  }, [line]);

  if (!visible) return null;

  return <primitive object={line} />;
}
