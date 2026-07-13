export type PlayStep =
  | 'start'
  | 'choose'
  | 'deconstruct'
  | 'build'
  | 'match'
  | 'reinterpret'
  | 'reflection';

export type DeconstructPart =
  | 'motif'
  | 'path'
  | 'skeleton'
  | 'node'
  | 'closure'
  | 'symmetry'
  | 'meaning';

export interface DeconstructRegion {
  id: DeconstructPart;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  explanation: string;
}

export interface PlaySpecimen {
  id: string;
  chineseName: string;
  englishName: string;
  motif: string;
  skeletonType: string;
  pathOrganization: string;
  symbolicMeaning: string;
  culturalMeaning: string;
  emotionalTone: string;
  hue: number;
  deconstructRegions: DeconstructRegion[];
  assemblySlots: AssemblySlot[];
  assemblyComponents: AssemblyComponent[];
  correctMeaningId: string;
}

export interface AssemblySlot {
  id: string;
  label: string;
  x: number;
  y: number;
  accepts: string[];
}

export interface AssemblyComponent {
  id: string;
  label: string;
  type: string;
}

export interface AssemblyScores {
  symmetry: number;
  pathContinuity: number;
  closureLogic: number;
  culturalMatch: number;
}

export interface MeaningPair {
  id: string;
  pankouType: string;
  meaning: string;
}

export interface ReflectionAnswers {
  structureLearning: string;
  easiestHardest: string;
  generativeHelp: string;
}
