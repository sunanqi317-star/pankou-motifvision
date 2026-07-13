import type { PankouItem, SearchResult, SimilarityResult } from '../types';
import { cosineSimilarity, encodeImageItem, encodeText } from './embeddings';

const FEATURE_LABELS: Record<string, string> = {
  'motif:butterfly': 'Butterfly motif',
  'motif:floral': 'Floral motif',
  'motif:dragon': 'Dragon motif',
  'motif:cloud': 'Cloud motif',
  'motif:bat': 'Bat motif',
  'motif:lotus': 'Lotus motif',
  'motif:phoenix': 'Phoenix motif',
  'motif:geometric': 'Geometric motif',
  'structure:curved-spiral': 'Curved spiral structure',
  'structure:radial': 'Radial symmetry',
  'structure:linear': 'Linear band structure',
  'structure:concentric': 'Concentric ring structure',
  'structure:asymmetric': 'Asymmetric fold structure',
  'symmetry:bilateral': 'Bilateral symmetry',
  'symmetry:radial': 'Radial symmetry pattern',
  'symmetry:translational': 'Translational repetition',
  'skeleton:curved': 'Curved skeleton',
  'skeleton:serpentine': 'Serpentine skeleton',
  'skeleton:petal-ring': 'Petal-ring skeleton',
  'skeleton:angular': 'Angular skeleton',
  'skeleton:looping': 'Looping cloud skeleton',
  'skeleton:plume': 'Plume-like extension',
  'skeleton:vine': 'Vine interlace',
  'skeleton:wing-fold': 'Wing-fold structure',
};

function keywordBoost(query: string, item: PankouItem): { boost: number; terms: string[] } {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const corpus = [
    item.searchText,
    item.motif,
    item.structure,
    item.symbolicMeaning,
    item.culturalKeywords.join(' '),
    item.visualFeatures.join(' '),
    item.pankouTypeLabel,
    Object.values(item.classification).join(' '),
  ]
    .join(' ')
    .toLowerCase();
  const matched = tokens.filter((t) => corpus.includes(t));
  return { boost: matched.length * 0.04, terms: matched };
}

export async function searchByText(
  query: string,
  items: PankouItem[],
  limit = 10,
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const queryVec = await encodeText(query);
  const results: SearchResult[] = [];

  for (const item of items) {
    const imageVec = await encodeImageItem(item);
    let score = cosineSimilarity(queryVec, imageVec);
    const { boost, terms } = keywordBoost(query, item);
    score = Math.min(0.99, score + boost);

    results.push({ item, score, matchedTerms: terms });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

function sharedFeatures(a: PankouItem, b: PankouItem): string[] {
  const visual = a.visualFeatures.filter((f) => b.visualFeatures.includes(f));
  const legacy = a.features
    .filter((f) => b.features.includes(f))
    .map((f) => FEATURE_LABELS[f] ?? f);
  const keywords = a.culturalKeywords.filter((k) =>
    b.culturalKeywords.some((bk) => bk.toLowerCase() === k.toLowerCase()),
  );
  return [...new Set([...visual, ...legacy, ...keywords.map((k) => `keyword:${k}`)])];
}

function structuralAffinity(a: PankouItem, b: PankouItem): number {
  let score = 0;
  if (a.motif === b.motif) score += 0.25;
  if (a.structure === b.structure) score += 0.2;
  if (a.symbolicMeaning === b.symbolicMeaning) score += 0.1;
  if (a.cluster === b.cluster) score += 0.15;
  if (a.pankouType === b.pankouType) score += 0.1;
  if (a.classification.structuralSkeleton === b.classification.structuralSkeleton) score += 0.15;
  return score;
}

export async function findSimilarImages(
  source: PankouItem,
  items: PankouItem[],
  limit = 5,
): Promise<SimilarityResult[]> {
  const sourceVec = await encodeImageItem(source);
  const results: SimilarityResult[] = [];

  for (const item of items) {
    if (item.id === source.id) continue;
    const itemVec = await encodeImageItem(item);
    let score = cosineSimilarity(sourceVec, itemVec) + structuralAffinity(source, item);
    score = Math.min(0.99, score);
    const shared = sharedFeatures(source, item);

    results.push({ item, score, sharedFeatures: shared });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function explainSimilarity(shared: string[]): string {
  if (shared.length === 0) {
    return 'Visual embedding proximity suggests latent structural resemblance not captured by discrete metadata tags.';
  }
  const visual = shared.filter((s) => !s.startsWith('keyword:') && !s.includes('motif'));
  const motifs = shared.filter((s) => s.includes('motif'));
  const keywords = shared.filter((s) => s.startsWith('keyword:'));

  const parts: string[] = [];
  if (motifs.length) parts.push(`shared ${motifs.join(', ')}`);
  if (visual.length) parts.push(`matching ${visual.join(', ')}`);
  if (keywords.length) parts.push(`overlapping ${keywords.map((k) => k.replace('keyword:', '')).join(', ')}`);

  return `Likely similarity drivers: ${parts.join('; ')}.`;
}

export function getSimilarityInterpretation(
  source: PankouItem,
  candidate: PankouItem,
  sharedFeatures: string[],
  score: number,
): string {
  const pct = (score * 100).toFixed(1);
  if (source.motif === candidate.motif && sharedFeatures.length >= 2) {
    return `Ranked at ${pct}%. Shares motif class and multiple annotated visual features with query ${source.id}, indicating strong corpus-level affinity.`;
  }
  if (sharedFeatures.length > 0) {
    return `Ranked at ${pct}%. Partial feature overlap with ${source.id}. Embedding proximity suggests related structural vocabulary within the Haipai Pankou corpus.`;
  }
  return `Ranked at ${pct}%. Retrieved primarily by mock embedding distance. Discrete metadata tags show limited overlap with query ${source.id}.`;
}
