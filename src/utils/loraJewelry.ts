import type {
  JewelryConcept,
  JewelryConceptOptions,
  LoRAJewelrySettings,
  PankouItem,
} from '../types';

export const JEWELRY_FORMS = [
  'Pendant Necklace',
  'Brooch',
  'Earrings',
  'Garment Pin',
  'Modular Jewelry Set',
] as const;

export const MATERIAL_STRATEGIES = [
  'Pearl + Silver',
  'Enamel + Gold-plated Metal',
  'Silk Cord + Metal Frame',
  'Transparent Resin + Pearl',
  'Micro-mosaic + Metal',
] as const;

export const STRUCTURE_STRATEGIES = [
  'Preserve Original Skeleton',
  'Abstract Motif into Frame',
  'Transform Closure into Pendant',
  'Modularize Repeated Units',
  'Emphasize Symmetry',
] as const;

export const DESIGN_DIRECTIONS = [
  'Modern Minimal',
  'Contemporary Oriental',
  'Vintage Revival',
  'Elegant Classical',
  'Daily Wearable',
] as const;

export const COLOR_PALETTES = [
  'Ivory + Ink',
  'Pearl White + Silver',
  'Cinnabar + Gold',
  'Jade Green + Bronze',
  'Midnight Blue + Pearl',
] as const;

export const DEFAULT_NEGATIVE_PROMPT =
  'low quality, blurry, distorted jewelry, messy structure, broken symmetry, unclear motif, overcomplicated details, poor craftsmanship, text, watermark, logo, extra limbs, human body, face, hands, product mockup, e-commerce background';

export type JewelryForm = (typeof JEWELRY_FORMS)[number];
export type MaterialStrategy = (typeof MATERIAL_STRATEGIES)[number];
export type StructureStrategy = (typeof STRUCTURE_STRATEGIES)[number];
export type DesignDirection = (typeof DESIGN_DIRECTIONS)[number];

export type VariationPreset = 'heritage-inspired' | 'contemporary-jewelry' | 'experimental-ai-form';

export const VARIATION_PRESETS: Record<
  VariationPreset,
  { label: string; style: DesignDirection; structureStrategy: StructureStrategy }
> = {
  'heritage-inspired': {
    label: 'Heritage-Inspired',
    style: 'Vintage Revival',
    structureStrategy: 'Preserve Original Skeleton',
  },
  'contemporary-jewelry': {
    label: 'Contemporary Jewelry',
    style: 'Contemporary Oriental',
    structureStrategy: 'Emphasize Symmetry',
  },
  'experimental-ai-form': {
    label: 'Experimental AI Form',
    style: 'Modern Minimal',
    structureStrategy: 'Abstract Motif into Frame',
  },
};

const DESIGN_DIRECTION_NOTES: Record<DesignDirection, string> = {
  'Modern Minimal':
    'restrained geometry, reduced ornament, and legible structural lines',
  'Contemporary Oriental':
    'contemporary framing of Chinese cultural motifs with balanced composition',
  'Vintage Revival':
    'historical Shanghai and qipao-era visual memory translated into present form',
  'Elegant Classical':
    'measured symmetry, formal proportion, and disciplined surface articulation',
  'Daily Wearable':
    'modest scale, stable structure, and practical wear logic for repeated use',
};

const MATERIAL_STRATEGY_NOTES: Record<MaterialStrategy, string> = {
  'Pearl + Silver':
    'soft luster and refined metal structure suited to subtle symbolic reading',
  'Enamel + Gold-plated Metal':
    'color fields and ornamental surface detail that amplify motif legibility',
  'Silk Cord + Metal Frame':
    'textile memory and craft continuity between pankou fastening and jewelry armature',
  'Transparent Resin + Pearl':
    'layered depth and translucency that support motif abstraction',
  'Micro-mosaic + Metal':
    'fine modular surfaces that echo repeated knot or motif units',
};

const STRUCTURE_STRATEGY_NOTES: Record<
  StructureStrategy,
  (item: PankouItem, skeleton: string) => string
> = {
  'Preserve Original Skeleton': (_item, skeleton) =>
    `The ${skeleton} remains the primary armature governing proportion and junction logic.`,
  'Abstract Motif into Frame': (item) =>
    `The ${item.motif.toLowerCase()} outline becomes a contour frame that bounds the jewelry field.`,
  'Transform Closure into Pendant': (item) =>
    `Fastening logic from specimen ${item.id} is reinterpreted as a central pendant or connector.`,
  'Modularize Repeated Units': (item) =>
    `Repeated ${item.motif.toLowerCase()} units are distributed as interchangeable jewelry modules.`,
  'Emphasize Symmetry': (item) =>
    `Axial or bilateral balance is strengthened in relation to ${item.pathOrganization.toLowerCase()} path organization.`,
};

function asJewelryForm(value: string): JewelryForm {
  return JEWELRY_FORMS.includes(value as JewelryForm) ? (value as JewelryForm) : 'Pendant Necklace';
}

function asMaterialStrategy(value: string): MaterialStrategy {
  return MATERIAL_STRATEGIES.includes(value as MaterialStrategy)
    ? (value as MaterialStrategy)
    : 'Pearl + Silver';
}

function asStructureStrategy(value: string): StructureStrategy {
  return STRUCTURE_STRATEGIES.includes(value as StructureStrategy)
    ? (value as StructureStrategy)
    : 'Preserve Original Skeleton';
}

function asDesignDirection(value: string): DesignDirection {
  return DESIGN_DIRECTIONS.includes(value as DesignDirection)
    ? (value as DesignDirection)
    : 'Contemporary Oriental';
}

export function buildPositivePrompt(
  item: PankouItem,
  options: JewelryConceptOptions,
  settings: LoRAJewelrySettings,
): string {
  const form = asJewelryForm(options.jewelryType);
  const materialKey = asMaterialStrategy(options.material);
  const structureKey = asStructureStrategy(options.structureStrategy);
  const direction = asDesignDirection(options.style);
  const palette = options.colorPalette?.trim();
  const emphasis = options.culturalEmphasis?.trim();

  const triggers = settings.triggerWords
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .join(', ');

  const loraTag = `<lora:pankou02:${settings.loraWeight}>`;

  return [
    loraTag,
    triggers,
    'structure-constrained contemporary jewelry design',
    `inspired by ${item.englishName}`,
    `${item.motif} motif`,
    item.skeletonType,
    `${item.pathOrganization} path organization`,
    item.constraintPattern,
    `symbolic meaning of ${item.symbolicMeaning}`,
    `emotional tone of ${item.emotionalTone}`,
    form,
    materialKey,
    palette ? `${palette} color palette` : null,
    direction,
    structureKey,
    emphasis ? `cultural emphasis of ${emphasis.toLowerCase()}` : null,
    'refined craftsmanship, balanced composition, high detail, studio lighting',
  ]
    .filter(Boolean)
    .join(', ');
}

export function generateJewelryConcept(
  item: PankouItem,
  options: JewelryConceptOptions,
  settings: LoRAJewelrySettings,
): JewelryConcept {
  const { jewelryType, material, style, structureStrategy } = options;
  const form = asJewelryForm(jewelryType);
  const materialKey = asMaterialStrategy(material);
  const structureKey = asStructureStrategy(structureStrategy);
  const direction = asDesignDirection(style);
  const skeleton = item.skeletonType;

  const designTitle = `${item.motif} ${form}: ${direction}`;

  const culturalInterpretation =
    `Specimen ${item.id} (${item.englishName}) supplies the cultural metadata for this reinterpretation. ` +
    `The ${item.motif.toLowerCase()} motif is read against symbolic meaning "${item.symbolicMeaning}", ` +
    `which informs how the motif is emphasized, bounded, or distributed in the ${form.toLowerCase()} form. ` +
    `This step translates corpus annotations from Steps 1 to 5 into a structure-constrained generative design brief.`;

  const skeletonBasedTransformation =
    `${STRUCTURE_STRATEGY_NOTES[structureKey](item, skeleton)} ` +
    `The jewelry form (${form.toLowerCase()}) is derived from skeleton type ${skeleton} and ${item.structure.toLowerCase()} structural rhythm. ` +
    `Path organization (${item.pathOrganization.toLowerCase()}) and constraint pattern (${item.constraintPattern.toLowerCase()}) ` +
    `guide how motif units are aligned, repeated, or centered within the composition.`;

  const paletteNote = options.colorPalette
    ? ` Color palette (${options.colorPalette.toLowerCase()}) extends the emotional register of the specimen.`
    : '';

  const materialStrategyText =
    `Material strategy "${materialKey}" is selected to support symbolic meaning "${item.symbolicMeaning.toLowerCase()}" ` +
    `and inherited emotional tone (${item.emotionalTone.toLowerCase()}). ` +
    `${MATERIAL_STRATEGY_NOTES[materialKey]} ` +
    `Within the ${direction.toLowerCase()} design direction, surface treatment follows ${DESIGN_DIRECTION_NOTES[direction]}.${paletteNote}`;

  const positivePrompt = buildPositivePrompt(item, options, settings);

  const negativePrompt = settings.negativePrompt.trim() || DEFAULT_NEGATIVE_PROMPT;

  const suggestedSdSettings =
    `LoRA weight: ${settings.loraWeight} | CFG scale: ${settings.cfgScale} | Steps: ${settings.steps} | Image size: ${settings.imageSize}`;

  const emphasis = options.culturalEmphasis ?? item.symbolicMeaning;
  const portfolioDescription =
    `Structure-constrained reinterpretation of specimen ${item.id} as a ${direction.toLowerCase()} ${form.toLowerCase()}, ` +
    `with cultural emphasis on ${emphasis.toLowerCase()} and structure strategy "${structureKey.toLowerCase()}".`;

  const designStatement =
    `A ${form.toLowerCase()} concept from ${item.englishName}, translating ${item.motif.toLowerCase()} motif and ` +
    `${skeleton.toLowerCase()} through ${emphasis.toLowerCase()} emphasis.`;

  return {
    designTitle,
    culturalInterpretation,
    skeletonBasedTransformation,
    materialStrategy: materialStrategyText,
    positivePrompt,
    negativePrompt,
    suggestedSdSettings,
    portfolioDescription,
    designStatement,
  };
}

export function formatPromptForClipboard(
  concept: JewelryConcept,
  settings: LoRAJewelrySettings,
): string {
  return [
    '=== DESIGN TITLE ===',
    concept.designTitle,
    '',
    '=== CULTURAL INTERPRETATION ===',
    concept.culturalInterpretation,
    '',
    '=== SKELETON-BASED TRANSFORMATION ===',
    concept.skeletonBasedTransformation,
    '',
    '=== MATERIAL STRATEGY ===',
    concept.materialStrategy,
    '',
    '=== POSITIVE PROMPT ===',
    concept.positivePrompt,
    '',
    '=== NEGATIVE PROMPT ===',
    concept.negativePrompt,
    '',
    '=== SUGGESTED SETTINGS ===',
    concept.suggestedSdSettings,
    `LoRA triggers: ${settings.triggerWords}`,
    '',
    '=== PORTFOLIO DESCRIPTION ===',
    concept.portfolioDescription,
  ].join('\n');
}
