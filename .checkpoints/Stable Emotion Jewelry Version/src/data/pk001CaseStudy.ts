import { generateInterpretationReport } from '../utils/interpretationReport';
import { generateJewelryConcept } from '../utils/loraJewelry';
import { getSpecimenAffinityPathLabels } from '../utils/networkHighlight';
import { findSimilarImages, searchByText } from '../utils/search';
import { DEFAULT_SELECTED_ITEM, pankouItems } from './pankouData';

export const PK001_SPECIMEN = DEFAULT_SELECTED_ITEM;

export const PK001_TEXT_QUERIES = [
  'butterfly motif',
  'curved spiral structure',
  'auspicious symbol',
] as const;

const DEFAULT_LORA_OPTIONS = {
  jewelryType: 'Brooch',
  material: 'Pearl + Silver',
  style: 'Contemporary Oriental',
  emotion: 'Gentle',
  structureStrategy: 'Preserve Original Skeleton',
} as const;

const DEFAULT_LORA_SETTINGS = {
  triggerWords: 'pankou_jewelry_lora, haipai_pankou_style',
  loraWeight: 0.7,
  imageSize: '1024x1024',
  cfgScale: 7,
  steps: 28,
  negativePrompt:
    'low quality, blurry, distorted jewelry, messy structure, broken symmetry, unclear motif, overcomplicated details, poor craftsmanship, text, watermark, logo, extra limbs, human body, face, hands, product mockup, e-commerce background',
};

export interface Pk001CaseStudyData {
  textRetrieval: Array<{
    query: string;
    topHits: Array<{ id: string; name: string; score: number }>;
  }>;
  similarSpecimens: Array<{
    id: string;
    name: string;
    motif: string;
    score: number;
    sharedFeatures: string[];
  }>;
  sharedFeatures: string[];
  affinityPath: string[];
  culturalInterpretation: string;
  reinterpretation: {
    designTitle: string;
    positivePrompt: string;
    culturalExcerpt: string;
  };
}

export async function loadPk001CaseStudy(): Promise<Pk001CaseStudyData> {
  const specimen = PK001_SPECIMEN;

  const [queryResults, similar] = await Promise.all([
    Promise.all(PK001_TEXT_QUERIES.map((query) => searchByText(query, pankouItems, 3))),
    findSimilarImages(specimen, pankouItems, 5),
  ]);

  const report = generateInterpretationReport(specimen);
  const lora = generateJewelryConcept(specimen, DEFAULT_LORA_OPTIONS, DEFAULT_LORA_SETTINGS);

  const sharedFeatures = [
    ...new Set(similar.flatMap((result) => result.sharedFeatures)),
  ];

  return {
    textRetrieval: PK001_TEXT_QUERIES.map((query, index) => ({
      query,
      topHits: queryResults[index].map((result) => ({
        id: result.item.id,
        name: result.item.englishName,
        score: result.score,
      })),
    })),
    similarSpecimens: similar.map((result) => ({
      id: result.item.id,
      name: result.item.englishName,
      motif: result.item.motif,
      score: result.score,
      sharedFeatures: result.sharedFeatures,
    })),
    sharedFeatures,
    affinityPath: getSpecimenAffinityPathLabels(specimen),
    culturalInterpretation: report.culturalInterpretation,
    reinterpretation: {
      designTitle: lora.designTitle,
      positivePrompt: lora.positivePrompt,
      culturalExcerpt: lora.culturalInterpretation,
    },
  };
}
