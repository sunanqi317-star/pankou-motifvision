import type { PankouTypeId } from '../data/pankouTaxonomy';

export interface PankouClassification {
  form: string;
  craft: string;
  material: string;
  color: string;
  composition: string;
  motifSemantics: string;
  structuralSkeleton: string;
}

export interface PankouItem {
  id: string;
  chineseName: string;
  englishName: string;
  pankouType: PankouTypeId;
  pankouTypeLabel: string;
  classification: PankouClassification;
  visualFeatures: string[];
  culturalKeywords: string[];
  recommendedJewelryForms: string[];
  generationPromptKeywords: string[];
  negativePromptHints: string[];
  relatedSpecimenIds: string[];
  emotionalTone: string;
  pathOrganization: string;
  nodeDensity: string;
  constraintPattern: string;
  skeletonType: string;
  representativeType: string;
  hue: number;
  searchText: string;
  /** Legacy feature tags used by embedding similarity */
  features: string[];
  cluster: string;
  /** Legacy motif class for affinity network and reports */
  motif: string;
  /** Legacy structure label */
  structure: string;
  /** Alias of classification.craft */
  craft: string;
  /** Alias of classification.motifSemantics */
  symbolicMeaning: string;
}

export interface SearchResult {
  item: PankouItem;
  score: number;
  matchedTerms?: string[];
}

export interface SimilarityResult {
  item: PankouItem;
  score: number;
  sharedFeatures: string[];
}

export type NetworkNodeType =
  | 'motif'
  | 'path'
  | 'skeleton'
  | 'structure'
  | 'symbolic'
  | 'cluster'
  | 'interpretation';

export interface NetworkNode {
  id: string;
  label: string;
  type: NetworkNodeType;
  x: number;
  y: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

export interface MotifReport {
  motif: string;
  visualPatternSummary: string;
  similarMotifGroups: string[];
  structuralCharacteristics: string[];
  culturalInterpretation: string;
  propagationPath: string[];
  researchNote: string;
}

export interface JewelryConceptOptions {
  jewelryType: string;
  material: string;
  style: string;
  emotion: string;
  structureStrategy: string;
  colorPalette?: string;
  culturalEmphasis?: string;
  structurePreservationLevel?: number;
  generationDirection?: string;
}

export interface LoRAJewelrySettings {
  triggerWords: string;
  loraWeight: number;
  imageSize: string;
  cfgScale: number;
  steps: number;
  negativePrompt: string;
}

export interface JewelryConcept {
  designTitle: string;
  culturalInterpretation: string;
  skeletonBasedTransformation: string;
  materialStrategy: string;
  positivePrompt: string;
  negativePrompt: string;
  suggestedSdSettings: string;
  portfolioDescription: string;
  designStatement: string;
}
