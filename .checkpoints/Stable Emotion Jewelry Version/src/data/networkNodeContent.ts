import type { NetworkNode, PankouItem } from '../types';
import { getNodeDisplayLabel } from '../utils/networkHighlight';

export interface NodeInterpretation {
  title: string;
  tooltip: string;
  whyItMatters: string[];
  designTranslation: string;
  jewelryForms: string[];
}

const JEWELRY_BY_TYPE: Record<NetworkNode['type'], string[]> = {
  motif: ['Pendant necklace', 'Brooch', 'Earrings'],
  path: ['Collar ornament', 'Brooch', 'Garment pin'],
  structure: ['Brooch', 'Modular jewelry set', 'Pendant necklace'],
  skeleton: ['Pendant necklace', 'Modular jewelry set', 'Earrings'],
  symbolic: ['Brooch', 'Garment pin', 'Pendant necklace'],
  cluster: ['Earrings', 'Brooch', 'Pendant necklace'],
  interpretation: ['Pendant necklace', 'Brooch', 'Collar ornament', 'Earrings'],
};

function onSpecimenPath(nodeId: string, pathNodeIds: string[]): boolean {
  return pathNodeIds.includes(nodeId);
}

export function getNodeInterpretation(
  node: NetworkNode,
  item: PankouItem,
  pathNodeIds: string[],
): NodeInterpretation {
  const label = getNodeDisplayLabel(node.id);
  const onPath = onSpecimenPath(node.id, pathNodeIds);
  const forms = JEWELRY_BY_TYPE[node.type];

  const base: NodeInterpretation = {
    title: label,
    tooltip: label,
    whyItMatters: [],
    designTranslation: '',
    jewelryForms: forms,
  };

  switch (node.type) {
    case 'motif':
      return {
        ...base,
        tooltip: `${label}: visual identity carried from the Pankou surface`,
        whyItMatters: onPath
          ? [
              `The ${item.motif.toLowerCase()} motif anchors how ${item.id} is read across the corpus.`,
              'Motif contour and proportion guide where jewelry ornament can remain legible at smaller scale.',
              `Symbolic tone (${item.emotionalTone.toLowerCase()}) often follows motif choice.`,
            ]
          : [
              'Motif class groups specimens that share recognizable visual identity.',
              'Selecting a motif node reveals parallel design translation strategies.',
              'Compare how different motifs scale into wearable form.',
            ],
        designTranslation: onPath
          ? `Translate the ${item.motif.toLowerCase()} silhouette into a focal jewelry field while preserving bilateral or radial rhythm from the source specimen.`
          : `Explore how the ${label.toLowerCase()} could frame a different heritage source before opening the AI Jewelry Studio.`,
      };

    case 'path':
      return {
        ...base,
        title: label.replace(' Path', ' Structure'),
        tooltip: `${label.replace(' Path', ' structure')}: how motif units are organized in space`,
        whyItMatters: onPath
          ? [
              `${item.pathOrganization} organization governs symmetry and repetition in ${item.id}.`,
              'Path logic determines whether jewelry should mirror, loop, or radiate from a center.',
              `Pairs naturally with ${item.structure.toLowerCase()} structural rhythm.`,
            ]
          : [
              'Path organization describes spatial logic, not craft technique alone.',
              'Different organizations suggest different jewelry compositions.',
              'Useful for comparing formal strategies across specimens.',
            ],
        designTranslation: onPath
          ? `Carry ${item.pathOrganization.toLowerCase()} balance into the jewelry frame so the ornament reads as an extension of the Pankou layout.`
          : 'Consider how an alternate path organization would reshape pendant symmetry or brooch orientation.',
      };

    case 'skeleton':
      return {
        ...base,
        tooltip: `${label}: underlying armature that holds the motif together`,
        whyItMatters: onPath
          ? [
              `${item.skeletonType} is the structural spine of ${item.id}.`,
              'Skeleton type informs LoRA structure strategy and junction logic in jewelry.',
              'Strong skeletons support modular or pendant reinterpretation.',
            ]
          : [
              'Skeleton types abstract the knot armature beneath surface ornament.',
              'Comparing skeletons reveals shared craft logic across motifs.',
              'Useful for structure-constrained AI generation.',
            ],
        designTranslation: onPath
          ? `Preserve ${item.skeletonType.toLowerCase()} as the jewelry armature, letting motif units attach along its primary axes.`
          : `Test how ${label.toLowerCase()} would reframe proportion if applied to ${item.motif.toLowerCase()} motifs.`,
      };

    case 'symbolic':
      return {
        ...base,
        tooltip: `${label}: cultural meaning layer linked to motif reading`,
        whyItMatters: onPath
          ? [
              `"${item.symbolicMeaning}" shapes the emotional register of ${item.id}.`,
              'Symbolism guides material strategy and color palette in the AI Jewelry Studio.',
              'Inherited tone should remain visible in generative reinterpretation.',
            ]
          : [
              'Symbolic nodes connect visual form to cultural reading.',
              'Different meanings suggest different material and wear contexts.',
              'Interpretive, not ethnographic proof.',
            ],
        designTranslation: onPath
          ? `Let ${item.symbolicMeaning.toLowerCase()} inform surface treatment, symmetry emphasis, and wearable scale in the generated concept.`
          : 'Imagine how an alternate symbolic frame would shift material choice and ornament density.',
      };

    case 'cluster':
      return {
        ...base,
        tooltip: `${label}: visual similarity grouping across corpus images`,
        whyItMatters: onPath
          ? [
              `${item.cluster} places ${item.id} among specimens with shared visual features.`,
              'Cluster membership supports similarity search and relation discovery.',
              'Helps situate a single object within a broader motif family.',
            ]
          : [
              'Clusters summarize embedding proximity and shared tags.',
              'Useful for exploring variant forms within a motif family.',
              'Not a historical lineage chart.',
            ],
        designTranslation: onPath
          ? `Draw on cluster neighbors to vary scale or modular repetition while keeping ${item.motif.toLowerCase()} identity clear.`
          : 'Browse cluster relations to find complementary forms for a jewelry set.',
      };

    case 'interpretation':
      return {
        ...base,
        title: node.id === 'i-design' ? 'Contemporary Design Output' : 'Jewelry Reinterpretation',
        tooltip: 'Design output: where cultural metadata becomes generative input',
        whyItMatters: onPath
          ? [
              'This node marks the transition from cultural reading to LoRA-ready jewelry design.',
              `Specimen ${item.id} supplies motif, skeleton, and symbolic metadata for generation.`,
              'Human-AI workflow keeps structure constraints explicit in the prompt.',
            ]
          : [
              'Interpretation nodes represent downstream design potential.',
              'Each path ends in a generative reinterpretation stage.',
              'Open the AI Jewelry Studio to materialize this step.',
            ],
        designTranslation: onPath
          ? `Send ${item.id} to the AI Jewelry Studio to produce a structure-constrained ${item.motif.toLowerCase()} jewelry concept with inherited emotional tone.`
          : 'Select a specimen-linked path, then open the studio to generate a design card.',
      };

    default:
      return {
        ...base,
        whyItMatters: ['This node participates in the visual-semantic relation map.'],
        designTranslation: 'Explore connected nodes to see how form becomes wearable design.',
      };
  }
}
