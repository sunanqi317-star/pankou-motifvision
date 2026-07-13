import { Html } from '@react-three/drei';
import { useState } from 'react';
import type { PathNode } from './pankouCurves';

const IVORY = '#f5f0e8';
const BROWN_OUTLINE = '#8e5b38';
const WARM_GOLD = '#c9962e';
const STITCH = '#7a4f28';

interface FixNodesProps {
  nodes: PathNode[];
  requiredIds: string[];
  fixedIds: Set<string>;
  onNodeClick: (id: string) => void;
  emphasize: boolean;
}

function NodeMarker({
  node,
  fixed,
  emphasize,
  onNodeClick,
}: {
  node: PathNode;
  fixed: boolean;
  emphasize: boolean;
  onNodeClick: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const baseSize = emphasize ? 0.1 : 0.085;
  const scale = hovered && !fixed ? 1.18 : 1;

  return (
    <group
      key={node.id}
      position={node.position}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!fixed) setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (!fixed) onNodeClick(node.id);
        }}
      >
        <sphereGeometry args={[baseSize, 20, 20]} />
        <meshStandardMaterial
          color={fixed ? WARM_GOLD : IVORY}
          emissive={fixed ? '#8b6914' : '#000000'}
          emissiveIntensity={fixed ? 0.25 : 0}
          roughness={fixed ? 0.35 : 0.65}
          metalness={fixed ? 0.15 : 0}
        />
      </mesh>

      {!fixed && (
        <mesh scale={1.12}>
          <sphereGeometry args={[baseSize, 20, 20]} />
          <meshBasicMaterial color={BROWN_OUTLINE} wireframe transparent opacity={0.55} />
        </mesh>
      )}

      {fixed && (
        <>
          <mesh rotation={[0, 0, Math.PI / 4]} position={[0, baseSize + 0.04, 0]}>
            <boxGeometry args={[0.16, 0.018, 0.018]} />
            <meshStandardMaterial color={STITCH} roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, baseSize + 0.04, 0]}>
            <boxGeometry args={[0.16, 0.018, 0.018]} />
            <meshStandardMaterial color={STITCH} roughness={0.8} />
          </mesh>
          <Html
            position={[0, baseSize + 0.22, 0]}
            center
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#7a4f28',
              background: 'rgba(255,250,240,0.92)',
              padding: '2px 7px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: '0 1px 4px rgba(80,60,40,0.12)',
            }}
          >
            ✓ Fixed
          </Html>
        </>
      )}
    </group>
  );
}

export function FixNodes({ nodes, requiredIds, fixedIds, onNodeClick, emphasize }: FixNodesProps) {
  const required = new Set(requiredIds);

  return (
    <group>
      {nodes
        .filter((node) => required.has(node.id))
        .map((node) => (
          <NodeMarker
            key={node.id}
            node={node}
            fixed={fixedIds.has(node.id)}
            emphasize={emphasize}
            onNodeClick={onNodeClick}
          />
        ))}
    </group>
  );
}
