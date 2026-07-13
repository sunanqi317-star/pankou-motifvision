export const PROJECT3_NARRATIVE = [
  'Research Motivation',
  'Application of Peircean Semiotics',
  'Artifact Symbol Extraction',
  'Emotion Keyword Framework',
  'AIGC-driven Jewelry Generation',
  'Emotional Healing Validation',
] as const;

export const PROJECT3_NAV = [
  { id: 'research-motivation', label: 'Motivation' },
  { id: 'peircean-semiotics', label: 'Semiotics' },
  { id: 'artifact-selection', label: 'Artifact' },
  { id: 'emotion-keyword-framework', label: 'Emotion Keywords' },
  { id: 'aigc-jewelry-generation', label: 'AIGC Design' },
  { id: 'emotional-healing-validation', label: 'Validation' },
] as const;

export const RESEARCH_MOTIVATION = [
  {
    stage: '01',
    label: 'Cultural Value',
    text: 'Traditional cultural artifacts contain embodied emotions and cultural memories expressed through visual forms, gestures, and symbolic meanings.',
  },
  {
    stage: '02',
    label: 'Translation Challenge',
    text: 'However, these implicit emotional meanings are difficult to communicate through contemporary design, limiting deeper emotional connections between artifacts and users.',
  },
  {
    stage: '03',
    label: 'Research Response',
    text: 'This research explores a symbolic translation approach that transforms cultural artifacts into emotion-oriented jewelry, connecting cultural heritage with contemporary emotional experiences.',
  },
] as const;

export const PEIRCE_SEMIOTICS = {
  intro:
    'Peircean semiotics provides the theoretical bridge between cultural artifacts and emotional healing — transforming artifact meaning into emotional value and healing-oriented jewelry design.',
  flow: [
    { term: 'Cultural Artifact', label: 'Historical Object' },
    { term: 'Sign', label: 'Visible Features' },
    { term: 'Object', label: 'Cultural Meaning' },
    { term: 'Interpretant', label: 'Emotional Response' },
    { term: 'Jewelry Application', label: 'Healing-oriented Design' },
  ],
} as const;

export const ARTIFACT_SELECTION = {
  intro:
    'Visual symbols of the artifact are extracted and interpreted through Peircean semiotics, transforming cultural meanings into emotional values that guide jewelry design translation.',
  name: 'Eastern Han Drumming and Chanting Figurine',
  period: 'Eastern Han dynasty (25–220 CE)',
  material: 'Collection of the National Museum of China',
  image: '/images/project-aigc-jewelry.png',
  imageAlt: 'Eastern Han Drumming and Chanting Figurine — museum artifact',
  flowStages: [
    { term: 'Sign', label: 'Visible Feature' },
    { term: 'Object', label: 'Cultural Meaning' },
    { term: 'Interpretant', label: 'Emotional Response' },
    { term: 'Jewelry Translation', label: 'Design Emotion Keywords' },
  ],
  analysisCards: [
    {
      id: 'expression',
      number: '01',
      title: 'Expressive Face',
      sign: 'Smiling facial expression',
      object: 'Entertainment performance and joyful social atmosphere',
      interpretant: 'Joy · Comfort · Positive emotional connection',
      designTranslation: 'Warmth · Emotional companionship',
    },
    {
      id: 'gesture',
      number: '02',
      title: 'Dynamic Gesture',
      sign: 'Raised arms and performing posture',
      object: 'Musical performance and ritual expression',
      interpretant: 'Vitality · Openness · Human connection',
      designTranslation: 'Dynamic wearable expression',
    },
    {
      id: 'performance',
      number: '03',
      title: 'Rhythmic Performance',
      sign: 'Drumming movement and dynamic posture',
      object: 'Festive celebration and communal interaction',
      interpretant: 'Warmth · Celebration · Emotional engagement',
      designTranslation: 'Interactive emotional jewelry',
    },
  ],
} as const;

export const SYMBOL_EMOTION_MAPPINGS = [
  {
    id: 'expression',
    visual: 'Smiling face',
    cultural: 'Festive entertainment',
    emotional: 'Joy · warmth',
  },
  {
    id: 'drumming',
    visual: 'Drumming gesture',
    cultural: 'Ritual performance',
    emotional: 'Vitality · rhythm',
  },
  {
    id: 'sleeves',
    visual: 'Raised sleeves',
    cultural: 'Performative movement',
    emotional: 'Human connection',
  },
  {
    id: 'posture',
    visual: 'Seated posture',
    cultural: 'Communal gathering',
    emotional: 'Emotional comfort',
  },
] as const;

export const KEYWORD_DIMENSIONS = [
  {
    number: '01',
    title: 'Emotional Guidance',
    keywords: ['Warmth', 'Comfort', 'Encouragement', 'Emotional Stability'],
  },
  {
    number: '02',
    title: 'Cultural Symbols',
    keywords: ['Joy', 'Celebration', 'Cultural Memory'],
  },
  {
    number: '03',
    title: 'Aesthetic Style',
    keywords: ['Playfulness', 'Vitality', 'Expressiveness'],
  },
  {
    number: '04',
    title: 'Wearing Functionality',
    keywords: ['Companionship', 'Personal Connection', 'Everyday Comfort'],
  },
] as const;

export const AIGC_SECTION = {
  intro:
    'AIGC is used as a visual exploration tool to translate emotional keywords into jewelry concepts, helping test how cultural symbols can be reinterpreted as healing-oriented wearable forms.',
  panelHeading: 'Prompt Console',
  previewHeading: 'Generated Concept Preview',
  aiModelLabel: 'AI Model',
  aiModel: '即梦 AI / Dreamina AI',
  structuredPromptHeading: 'Structured Generation Prompt',
  structuredPrompt:
    'Emotion-oriented cultural jewelry, inspired by the Eastern Han Drumming and Chanting Figurine, warmth, comfort, cheerfulness, vitality, smiling face symbol, drumming gesture, rounded wearable form, soft contours, delicate metal craftsmanship, symbolic cultural abstraction, healing-oriented jewelry design, gentle contemporary aesthetic.',
  promptSections: [
    {
      label: 'Cultural Source',
      value: 'Eastern Han Drumming and Chanting Figurine',
    },
    {
      label: 'Emotion Keywords',
      value: 'Warmth · Comfort · Cheerfulness · Vitality',
    },
    {
      label: 'Symbol Cues',
      value: 'Smiling face · Drumming gesture · Raised sleeves · Seated posture',
    },
    {
      label: 'Design Translation',
      value: 'Rounded contours · Soft structure · Wearable scale',
    },
  ],
} as const;

export const JEWELRY_CONCEPTS = [
  {
    id: 'concept-01',
    label: 'Concept 01',
    name: 'Warmth & Rhythm',
    image: '/images/a1.jpg',
    // a1 embeds a warm beige backdrop (#f2eae1); frameBackground matches it until a transparent PNG is available.
    frameBackground: '#f2eae1',
    emotionKeyword: 'Warmth · Rhythm',
    designTranslation: 'Rounded contours · Emotional wearable form',
    caption: 'Drumming rhythm translated into a rounded wearable emotional form.',
  },
  {
    id: 'concept-02',
    label: 'Concept 02',
    name: 'Cheerfulness & Gesture',
    image: '/images/a2.png',
    frameBackground: '#f7f1e8',
    emotionKeyword: 'Cheerfulness · Gesture',
    designTranslation: 'Expressive contours · Upward gesture form',
    caption: 'Dynamic gestures transformed into expressive jewelry contours.',
  },
  {
    id: 'concept-03',
    label: 'Concept 03',
    name: 'Comfort & Stability',
    image: '/images/a3.png',
    frameBackground: '#f7f1e8',
    emotionKeyword: 'Comfort · Stability',
    designTranslation: 'Balanced structure · Body-adjacent form',
    caption: 'Emotional comfort translated into balanced wearable structures.',
  },
  {
    id: 'concept-04',
    label: 'Concept 04',
    name: 'Companionship & Celebration',
    image: '/images/a4.jpg',
    frameBackground: '#f7f1e8',
    emotionKeyword: 'Companionship · Celebration',
    designTranslation: 'Interactive detail · Healing-oriented jewelry',
    caption: 'Cultural symbols transformed into interactive emotional jewelry.',
  },
] as const;

export const HEALING_VALIDATION = {
  intro:
    'Generated concepts are assessed as research evidence — tracing how emotional intention, cultural translation, and design strategy converge in wearable outcomes that support healing-oriented experience.',
  evaluationHeading: 'Emotional Response Evaluation',
} as const;

export const VALIDATION_CONCEPTS = [
  {
    id: 'concept-01',
    label: 'Concept 01',
    name: 'Warmth & Rhythm',
    image: '/images/a1.jpg',
    frameBackground: '#f2eae1',
    blendFrame: true,
    emotionalTheme: 'Warmth · Rhythm',
    culturalTranslation: 'Festive drumming · Communal gathering',
    designStrategy: 'Rounded contours · Soft wearable form',
    emotionalResponse: 'Proximate care · Gentle encouragement',
  },
  {
    id: 'concept-02',
    label: 'Concept 02',
    name: 'Cheerfulness & Gesture',
    image: '/images/a2.png',
    frameBackground: '#f7f1e8',
    blendFrame: false,
    emotionalTheme: 'Cheerfulness · Gesture',
    culturalTranslation: 'Smiling expression · Performative movement',
    designStrategy: 'Expressive contours · Upward gesture form',
    emotionalResponse: 'Joyful uplift · Positive connection',
  },
  {
    id: 'concept-03',
    label: 'Concept 03',
    name: 'Comfort & Stability',
    image: '/images/a3.png',
    frameBackground: '#f7f1e8',
    blendFrame: false,
    emotionalTheme: 'Comfort · Stability',
    culturalTranslation: 'Seated posture · Emotional grounding',
    designStrategy: 'Balanced structure · Body-adjacent form',
    emotionalResponse: 'Reassurance · Emotional stability',
  },
  {
    id: 'concept-04',
    label: 'Concept 04',
    name: 'Companionship & Celebration',
    image: '/images/a4.jpg',
    frameBackground: '#f7f1e8',
    blendFrame: false,
    emotionalTheme: 'Companionship · Celebration',
    culturalTranslation: 'Ritual performance · Shared festivity',
    designStrategy: 'Interactive detail · Symbolic abstraction',
    emotionalResponse: 'Social warmth · Celebratory presence',
  },
] as const;

export const EMOTIONAL_RESPONSE_EVALUATION = [
  {
    id: 'dimensions',
    label: 'Evaluation Dimensions',
    value: 'Warmth · Cheerfulness · Comfort · Vitality',
  },
  {
    id: 'resonance',
    label: 'Emotional Resonance',
    value: 'Keyword alignment between artifact emotion and wearable expression',
  },
  {
    id: 'cultural',
    label: 'Cultural Expression',
    value: 'Symbolic readability through semiotic translation to form',
  },
  {
    id: 'experience',
    label: 'User Experience',
    value: 'Wearability, scale, and everyday emotional companionship',
  },
] as const;
