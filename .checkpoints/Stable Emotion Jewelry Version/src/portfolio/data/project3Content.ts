export const PROJECT3_NARRATIVE = [
  'Cultural Symbol Interpretation',
  'Emotion Keyword Framework',
  'AIGC-assisted Generation',
  'Emotional Healing Validation',
] as const;

export const PEIRCE_TRIAD = [
  {
    term: 'Sign',
    label: 'Visual form',
    detail: 'Drumming pose, raised arms, and animated facial expression on the figurine surface.',
  },
  {
    term: 'Object',
    label: 'Cultural referent',
    detail: 'Eastern Han entertainment figure associated with festive ceremony and musical performance.',
  },
  {
    term: 'Interpretant',
    label: 'Emotional meaning',
    detail: 'Joy, rhythmic vitality, and the comfort of shared cultural celebration.',
  },
] as const;

export const EXTRACTED_SYMBOLS = [
  {
    id: 'drumming',
    symbol: 'Drumming gesture',
    cultural: 'Ritual performance · musical festivity',
    emotional: 'Rhythm · vitality · expressive energy',
  },
  {
    id: 'sleeves',
    symbol: 'Raised sleeves',
    cultural: 'Han costume movement · performative gesture',
    emotional: 'Liveliness · openness · dynamic presence',
  },
  {
    id: 'expression',
    symbol: 'Smiling face',
    cultural: 'Entertainment figure · auspicious mood',
    emotional: 'Cheerfulness · warmth · approachable joy',
  },
  {
    id: 'posture',
    symbol: 'Seated posture',
    cultural: 'Domestic ritual · communal gathering',
    emotional: 'Comfort · belonging · emotional steadiness',
  },
] as const;

export type KeywordDimensionId =
  | 'emotional-guidance'
  | 'cultural-symbols'
  | 'aesthetic-style'
  | 'wearing-functionality';

export const KEYWORD_DIMENSIONS = [
  {
    id: 'emotional-guidance' as const,
    title: 'Emotional Guidance',
    keywords: ['Warmth', 'Comfort', 'Encouragement', 'Emotional steadiness'],
    influence:
      'Guides how jewelry should carry supportive feeling rather than ornamental display alone.',
  },
  {
    id: 'cultural-symbols' as const,
    title: 'Cultural Symbols',
    keywords: ['Drumming', 'Chanting', 'Han figurine', 'Festive ritual'],
    influence:
      'Anchors design in museum-readable symbols that remain culturally identifiable.',
  },
  {
    id: 'aesthetic-style' as const,
    title: 'Aesthetic Style',
    keywords: ['Soft curves', 'Rounded volume', 'Human scale', 'Gentle contrast'],
    influence:
      'Translates figurine form language into wearable proportions and tactile softness.',
  },
  {
    id: 'wearing-functionality' as const,
    title: 'Wearing Functionality',
    keywords: ['Daily reminder', 'Tactile comfort', 'Personal talisman', 'Close-to-body wear'],
    influence:
      'Defines how emotional meaning persists through use, touch, and everyday presence.',
  },
] as const;

export const AIGC_WORKFLOW = [
  { step: 'Keywords', detail: 'Structured emotional and cultural terms from the framework.' },
  { step: 'Prompt Construction', detail: 'Semiotic terms translated into generative design language.' },
  { step: 'AIGC Generation', detail: 'Visual concepts produced as research probes, not final products.' },
  { step: 'Jewelry Concepts', detail: 'Outputs evaluated for emotional meaning and cultural translation.' },
] as const;

export const JEWELRY_CONCEPTS = [
  {
    id: 'concept-01',
    label: 'Concept 01',
    image: '/images/d1.png',
    emotional: 'Warmth through soft rounded silhouette and approachable scale.',
    cultural: 'Drumming rhythm abstracted into a pendant focal form.',
    visual: 'Low-contrast enamel-like surface with gentle highlight.',
  },
  {
    id: 'concept-02',
    label: 'Concept 02',
    image: '/images/d2.png',
    emotional: 'Cheerfulness via upward motion and open contour.',
    cultural: 'Raised-sleeve gesture translated into asymmetrical brooch structure.',
    visual: 'Layered petals suggesting movement without literal figuration.',
  },
  {
    id: 'concept-03',
    label: 'Concept 03',
    image: '/images/d3.png',
    emotional: 'Comfort through compact, body-adjacent wearable volume.',
    cultural: 'Seated figurine stability reinterpreted as ring or cuff geometry.',
    visual: 'Matte metal with pearl accent for tactile calm.',
  },
] as const;

export const HEALING_DIMENSIONS = [
  {
    id: 'warmth',
    title: 'Warmth',
    summary: 'Jewelry carries proximity and care — a wearable reminder of emotional support.',
    detail: 'Soft material cues and human-scale forms reduce distance between object and wearer.',
  },
  {
    id: 'cheerfulness',
    title: 'Cheerfulness',
    summary: 'Symbolic uplift drawn from the figurine’s performative joy.',
    detail: 'Rhythmic motifs and open gestures translate festive mood into daily encouragement.',
  },
  {
    id: 'comfort',
    title: 'Comfort',
    summary: 'Design prioritizes emotional steadiness over decorative spectacle.',
    detail: 'Jewelry functions as an emotional carrier — grounding, familiar, and quietly reassuring.',
  },
] as const;
