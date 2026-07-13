import { useMemo } from 'react';
import { networkEdges, networkNodes } from '../data/pankouData';
import type { NetworkNode, NetworkNodeType } from '../types';

const NODE_STYLES: Record<
  NetworkNodeType,
  { fill: string; stroke: string; text: string; glow: string }
> = {
  motif: { fill: '#1e3a5f', stroke: '#152a45', text: '#f7f4ef', glow: '#1e3a5f33' },
  path: { fill: '#8fa3b8', stroke: '#6b849c', text: '#1f2937', glow: '#8fa3b833' },
  structure: { fill: '#8fa3b8', stroke: '#6b849c', text: '#1f2937', glow: '#8fa3b833' },
  skeleton: { fill: '#b8a898', stroke: '#9a8778', text: '#2c2825', glow: '#b8a89833' },
  symbolic: { fill: '#9aab7a', stroke: '#7d8f62', text: '#1f2937', glow: '#9aab7a33' },
  cluster: { fill: '#c4a574', stroke: '#a68b5c', text: '#2c2825', glow: '#c4a57433' },
  interpretation: { fill: '#6b5b7a', stroke: '#524660', text: '#faf8f4', glow: '#6b5b7a33' },
};

const NODE_WIDTH = 100;
const NODE_HEIGHT = 36;

interface CulturalRelationMapProps {
  activeNodes: Set<string>;
  activeEdges: Set<string>;
  motifNodeId: string;
  hoveredNodeId: string | null;
  selectedNodeId: string;
  focusEdgeIds: Set<string>;
  onHoverNode: (nodeId: string | null) => void;
  onSelectNode: (nodeId: string) => void;
}

export function CulturalRelationMap({
  activeNodes,
  activeEdges,
  motifNodeId,
  hoveredNodeId,
  selectedNodeId,
  focusEdgeIds,
  onHoverNode,
  onSelectNode,
}: CulturalRelationMapProps) {
  const nodeMap = useMemo(
    () => Object.fromEntries(networkNodes.map((n) => [n.id, n])),
    [],
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200/70 bg-gradient-to-br from-[#faf8f4] to-white">
      <svg
        viewBox="0 0 720 460"
        className="w-full min-h-[360px]"
        role="img"
        aria-label="Motif relation map"
      >
        <defs>
          <filter id="node-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>

        {networkEdges.map((edge) => {
          const src = nodeMap[edge.source];
          const tgt = nodeMap[edge.target];
          if (!src || !tgt) return null;

          const onPath = activeEdges.has(edge.id);
          const onFocus = focusEdgeIds.has(edge.id);
          const stroke = onPath ? '#2c2825' : onFocus ? '#6b5b4f' : '#d6d3d1';
          const strokeWidth = onPath ? 3 : onFocus ? 2 : 1;
          const opacity = onPath ? 0.95 : onFocus ? 0.55 : 0.18;

          return (
            <line
              key={edge.id}
              x1={src.x}
              y1={src.y}
              x2={tgt.x}
              y2={tgt.y}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={opacity}
              strokeLinecap="round"
            />
          );
        })}

        {networkNodes.map((node) => (
          <RelationNode
            key={node.id}
            node={node}
            isOnPath={activeNodes.has(node.id)}
            isMotifFocus={node.id === motifNodeId}
            isHovered={hoveredNodeId === node.id}
            isSelected={selectedNodeId === node.id}
            onHover={onHoverNode}
            onSelect={onSelectNode}
          />
        ))}
      </svg>
    </div>
  );
}

function RelationNode({
  node,
  isOnPath,
  isMotifFocus,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}: {
  node: NetworkNode;
  isOnPath: boolean;
  isMotifFocus: boolean;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const colors = NODE_STYLES[node.type];
  const lines = node.label.split('\n');
  const emphasis = isMotifFocus || isSelected;
  const scale = isMotifFocus ? 1.18 : isSelected ? 1.08 : isHovered ? 1.04 : 1;
  const width = NODE_WIDTH * scale;
  const height = (lines.length > 1 ? NODE_HEIGHT + 8 : NODE_HEIGHT) * scale;
  const x = node.x - width / 2;
  const y = node.y - height / 2;

  const fill = emphasis || isOnPath ? colors.fill : '#ffffff';
  const textFill = emphasis || isOnPath ? colors.text : colors.stroke;
  const stroke = colors.stroke;
  const strokeWidth = isSelected ? 2.5 : isOnPath ? 2 : 1.2;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      filter={emphasis ? 'url(#node-glow)' : undefined}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(node.id)}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={node.label.replace('\n', ' ')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(node.id);
        }
      }}
    >
      <rect
        width={width}
        height={height}
        rx={height / 2}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={isOnPath || emphasis ? 1 : 0.92}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={width / 2}
          y={height / 2 - (lines.length - 1) * 5 + i * 11}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={emphasis ? 10.5 : 9.5}
          fontFamily="system-ui, sans-serif"
          fill={textFill}
          fontWeight={emphasis ? 600 : 500}
          style={{ pointerEvents: 'none' }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export { NODE_STYLES };
