import type { PankouItem } from '../types';

/**
 * CLIP-ready embedding interface.
 * Replace mockEncode* implementations with real ViT/CLIP model calls.
 */
export interface EmbeddingProvider {
  encodeText(text: string): Promise<number[]>;
  encodeImage(itemId: string): Promise<number[]>;
}

/** Deterministic pseudo-embedding from text for reproducible mock scores */
function mockHashEmbed(text: string, dims = 64): number[] {
  const vec = new Array(dims).fill(0);
  const normalized = text.toLowerCase().trim();
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    vec[i % dims] += code / 255;
    vec[(i * 7 + 3) % dims] += ((code * 13) % 97) / 97;
  }
  const magnitude = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / magnitude);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

export async function encodeText(query: string): Promise<number[]> {
  // TODO: swap for CLIP text encoder
  return mockHashEmbed(query);
}

export async function encodeImageItem(item: PankouItem): Promise<number[]> {
  // TODO: swap for CLIP image encoder using item image tensor
  return mockHashEmbed(
    [
      item.searchText,
      item.features.join(' '),
      item.visualFeatures.join(' '),
      item.generationPromptKeywords.join(' '),
      item.culturalKeywords.join(' '),
    ].join(' '),
  );
}

export const mockEmbeddingProvider: EmbeddingProvider = {
  encodeText,
  encodeImage: (itemId: string) => Promise.resolve(mockHashEmbed(itemId)),
};
