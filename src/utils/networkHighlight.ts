import { motifAffinityPaths, networkEdges, networkNodes } from '../data/pankouData';
import type { PathOrganization } from '../data/skeletonTaxonomy';
import type { PankouItem } from '../types';

const MOTIF_NODE_IDS: Record<string, string> = {
  Butterfly: 'm-butterfly',
  Floral: 'm-floral',
  Dragon: 'm-dragon',
  Cloud: 'm-cloud',
  Bat: 'm-butterfly',
  Lotus: 'm-floral',
  Phoenix: 'm-dragon',
  Geometric: 'm-floral',
};

const PATH_NODE_IDS: Record<PathOrganization, string> = {
  Linear: 'p-linear',
  Mirrored: 'p-mirrored',
  Radial: 'p-radial',
  Continuous: 'p-continuous',
  'Multi-path': 'p-multipath',
};

const SKELETON_NODE_IDS: Record<string, string> = {
  'Axis skeleton': 'sk-axis',
  'Bilateral skeleton': 'sk-bilateral',
  'Radial skeleton': 'sk-radial',
  'Loop skeleton': 'sk-loop',
  'Modular skeleton': 'sk-modular',
};

const SYMBOLIC_NODE_IDS: Record<string, string> = {
  'Auspicious Blessing': 'sym-bless',
  Longevity: 'sym-long',
  Prosperity: 'sym-long',
  Harmony: 'sym-bless',
  Protection: 'sym-long',
  Elegance: 'sym-bless',
};

const nodeLabelById = Object.fromEntries(
  networkNodes.map((n) => [n.id, n.label.replace(/\n/g, ' ')]),
);

function clusterToNodeId(cluster: string): string | undefined {
  if (cluster.startsWith('Cluster A')) return 'c-a';
  if (cluster.startsWith('Cluster B')) return 'c-b';
  if (cluster.startsWith('Cluster C')) return 'c-c';
  if (cluster.startsWith('Cluster D')) return 'c-a';
  if (cluster.startsWith('Cluster E')) return 'c-b';
  return undefined;
}

function interpretationNodeId(item: PankouItem): string {
  if (['Floral', 'Lotus', 'Phoenix'].includes(item.motif)) return 'i-design';
  return 'i-digital';
}

function symbolicChipLabel(meaning: string): string {
  if (meaning.includes('Blessing') || meaning.includes('Harmony') || meaning.includes('Elegance')) {
    return 'Auspicious Symbolism';
  }
  if (meaning.includes('Longevity') || meaning.includes('Prosperity') || meaning.includes('Protection')) {
    return 'Longevity Symbolism';
  }
  return `${meaning} Symbolism`;
}

export function getNodeDisplayLabel(nodeId: string): string {
  return nodeLabelById[nodeId] ?? nodeId;
}

export function getSpecimenMotifNodeId(item: PankouItem): string {
  return MOTIF_NODE_IDS[item.motif] ?? 'm-butterfly';
}

export function getSpecimenAffinityPathLabels(item: PankouItem): string[] {
  return [
    `${item.motif} Motif`,
    `${item.pathOrganization} Path`,
    item.skeletonType,
    item.symbolicMeaning,
    item.cluster,
    interpretationNodeId(item) === 'i-design'
      ? 'Contemporary Design Interpretation'
      : 'Digital Heritage Interpretation',
  ];
}

export function getHighlightedPathChips(item: PankouItem): string[] {
  return [
    `${item.motif} Motif`,
    `${item.pathOrganization} Structure`,
    item.skeletonType,
    symbolicChipLabel(item.symbolicMeaning),
    'Jewelry Reinterpretation',
  ];
}

/** @deprecated Prefer getSpecimenAffinityPathLabels with a full specimen record. */
export function getAffinityPathLabels(motif: string): string[] {
  const path = motifAffinityPaths[motif] ?? [];
  return path.map(getNodeDisplayLabel);
}

function getSpecimenPathNodeIds(item: PankouItem): string[] {
  return [
    MOTIF_NODE_IDS[item.motif],
    PATH_NODE_IDS[item.pathOrganization as PathOrganization],
    SKELETON_NODE_IDS[item.skeletonType],
    SYMBOLIC_NODE_IDS[item.symbolicMeaning],
    clusterToNodeId(item.cluster),
    interpretationNodeId(item),
  ].filter((id): id is string => Boolean(id));
}

export function getSpecimenNetworkHighlight(item: PankouItem): {
  activeNodes: Set<string>;
  activeEdges: Set<string>;
  pathLabels: string[];
  pathNodeIds: string[];
  motifNodeId: string;
} {
  const pathNodeIds = getSpecimenPathNodeIds(item);
  const activeNodes = new Set(pathNodeIds);

  const activeEdges = new Set<string>();
  for (let i = 0; i < pathNodeIds.length - 1; i++) {
    const source = pathNodeIds[i];
    const target = pathNodeIds[i + 1];
    networkEdges.forEach((edge) => {
      if (
        (edge.source === source && edge.target === target) ||
        (edge.source === target && edge.target === source)
      ) {
        activeEdges.add(edge.id);
      }
    });
  }

  return {
    activeNodes,
    activeEdges,
    pathLabels: getSpecimenAffinityPathLabels(item),
    pathNodeIds,
    motifNodeId: getSpecimenMotifNodeId(item),
  };
}

export function getEdgesForNode(nodeId: string): Set<string> {
  const ids = new Set<string>();
  networkEdges.forEach((edge) => {
    if (edge.source === nodeId || edge.target === nodeId) {
      ids.add(edge.id);
    }
  });
  return ids;
}
