import { motifReports, pankouItems } from '../data/pankouData';
import type { PankouItem } from '../types';
import { formatStructuralClassification } from '../data/skeletonTaxonomy';
import { getSpecimenAffinityPathLabels } from './networkHighlight';
import { getSkeletonLabel } from './specimen';

export interface InterpretationReport {
  specimenId: string;
  chineseName: string;
  englishName: string;
  motif: string;
  visualPatternSummary: string;
  similarityCluster: string;
  structuralClassification: string;
  structuralFeatures: string[];
  culturalInterpretation: string;
  motifAffinityHypothesis: string;
  methodologicalLimitation: string;
  reinterpretationPotential: string;
}

export function generateInterpretationReport(specimen: PankouItem): InterpretationReport {
  const motifBase = motifReports[specimen.motif];
  const affinityPath = getSpecimenAffinityPathLabels(specimen);
  const skeleton = getSkeletonLabel(specimen);

  const clusterPeers = pankouItems
    .filter((item) => item.cluster === specimen.cluster && item.id !== specimen.id)
    .map((item) => item.id);

  const visualPatternSummary = motifBase
    ? `${motifBase.visualPatternSummary} For specimen ${specimen.id} (${specimen.englishName}), the ${specimen.motif.toLowerCase()} motif is realized through ${specimen.structure.toLowerCase()} structure and ${specimen.craft.toLowerCase()} craft, with a ${skeleton.toLowerCase()} governing contour logic.`
    : `Specimen ${specimen.id} presents a ${specimen.motif.toLowerCase()} motif with ${specimen.structure.toLowerCase()} structure and ${specimen.craft.toLowerCase()} execution.`;

  const similarityCluster = [
    `Corpus cluster: ${specimen.cluster}.`,
    clusterPeers.length > 0
      ? `Co-clustered specimens (mock similarity grouping): ${clusterPeers.slice(0, 5).join(', ')}.`
      : 'No additional specimens share this exact cluster label in the current corpus slice.',
    motifBase
      ? `Related motif groups from retrieval analysis: ${motifBase.similarMotifGroups.join('; ')}.`
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const structuralClassification = formatStructuralClassification(specimen);

  const structuralFeatures = [
    `Structure class: ${specimen.structure}`,
    `Structural skeleton: ${skeleton}`,
    `Craft technique: ${specimen.craft}`,
    ...(motifBase?.structuralCharacteristics ?? []),
  ];

  const culturalInterpretation = [
    `Symbolic meaning (${specimen.symbolicMeaning}) and emotional tone (${specimen.emotionalTone.toLowerCase()}) frame the cultural reading of ${specimen.id}.`,
    motifBase?.culturalInterpretation ??
      `The ${specimen.motif.toLowerCase()} motif carries heritage semantics within the Haipai Pankou corpus.`,
    `This interpretation synthesizes annotated metadata. It is not ethnographic field verification.`,
  ].join(' ');

  const motifAffinityHypothesis = [
    `Propagation hypothesis path (computational motif affinity, not historical diffusion):`,
    affinityPath.join(' → '),
    motifBase
      ? `Motif-level relation notes: ${motifBase.propagationPath.join(' ')}`
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const methodologicalLimitation =
    'This report is generated from annotated corpus metadata, mock ViT/CLIP-style similarity, and predefined affinity network topology. ' +
    'It does not establish provenance, transmission history, or field-validated cultural claims. ' +
    (motifBase?.researchNote ?? 'Embedding and clustering outputs are demonstrator placeholders.');

  const reinterpretationPotential =
    `Specimen ${specimen.id} is suitable for generative reinterpretation: the ${specimen.motif.toLowerCase()} motif, ` +
    `${specimen.symbolicMeaning.toLowerCase()} symbolism, and ${specimen.emotionalTone.toLowerCase()} tone ` +
    `can inform LoRA-ready jewelry prompts emphasizing ${specimen.structure.toLowerCase()} structure and ${skeleton.toLowerCase()}. ` +
    `Downstream design parameters may foreground motif legibility, cultural citation, or material abstraction.`;

  return {
    specimenId: specimen.id,
    chineseName: specimen.chineseName,
    englishName: specimen.englishName,
    motif: specimen.motif,
    visualPatternSummary,
    similarityCluster,
    structuralClassification,
    structuralFeatures,
    culturalInterpretation,
    motifAffinityHypothesis,
    methodologicalLimitation,
    reinterpretationPotential,
  };
}
