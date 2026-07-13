export const PROJECT3_NARRATIVE = [
  'Research Motivation',
  'Application of Peircean Semiotics',
  'Artifact Symbol Extraction',
  'Emotional Keyword Mapping',
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
    { term: 'Application', label: 'Healing-oriented Design' },
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
      title: 'Smiling Expression',
      sign: 'Smiling facial expression',
      object: 'Folk performance\nJoyful interaction',
      interpretant: 'Delight · Warmth\nEmotional connection',
      designTranslation: 'Warmth · Companionship\nApproachable form',
    },
    {
      id: 'gesture',
      number: '02',
      title: 'Drumming Posture',
      sign: 'Dynamic drumming gesture',
      object: 'Musical performance\nRitual expression',
      interpretant: 'Vitality · Openness\nJoyful interaction',
      designTranslation: 'Dynamic form\nRhythmic expression',
    },
    {
      id: 'performance',
      number: '03',
      title: 'Performance Rhythm',
      sign: 'Drumming movement\nBody rhythm',
      object: 'Festive performance\nShared celebration',
      interpretant: 'Joy · Emotional presence',
      designTranslation: 'Rhythmic elements\nExpressive form',
    },
  ],
} as const;

export const SYMBOL_EMOTION_MAPPINGS = [
  {
    id: 'expression',
    visual: 'Smiling face',
    cultural: 'Joyful performance',
    emotional: 'Warmth · Delight',
  },
  {
    id: 'drumming',
    visual: 'Drumming gesture',
    cultural: 'Rhythmic performance',
    emotional: 'Vitality · Cheerfulness',
  },
  {
    id: 'crossed-leg',
    visual: 'Raised-leg gesture',
    cultural: 'Playful dynamic posture',
    emotional: 'Playfulness · Vitality',
  },
  {
    id: 'posture',
    visual: 'Stable seated posture',
    cultural: 'Composed presence',
    emotional: 'Composure · Affability',
  },
] as const;

export const KEYWORD_DIMENSIONS = [
  {
    number: '01',
    title: 'Emotional Guidance',
    keywords: ['Warmth', 'Comfort', 'Companionship', 'Ease'],
  },
  {
    number: '02',
    title: 'Cultural Symbols',
    keywords: ['Joy', 'Celebration', 'Cultural Memory'],
  },
  {
    number: '03',
    title: 'Aesthetic Style',
    keywords: ['Dynamism', 'Liveliness', 'Sense of Rhythm'],
  },
  {
    number: '04',
    title: 'Wearing Function',
    keywords: ['Everyday Wear', 'Intimate Experience'],
  },
] as const;

export const EMOTION_KEYWORD_MAPPING = {
  intro:
    'Cultural features are extracted through symbolic analysis and translated into emotional keywords that guide jewelry design.',
} as const;

export const AIGC_SECTION = {
  intro:
    'AIGC is used as a visual exploration tool to translate emotional keywords into jewelry concepts, helping test how cultural symbols can be reinterpreted as healing-oriented wearable forms.',
  panelHeading: 'Prompt Console',
  previewHeading: 'Generated Concept Preview',
  aiModelLabel: 'AI Model',
  aiModel: '即梦 AI / Dreamina AI',
  generationProcessHeading: 'Role of AIGC Translation',
  generationProcess:
    'AIGC serves as a visual exploration bridge, transforming emotional values and cultural symbols into wearable jewelry design concepts.',
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
  evaluationHeading: 'Design Response Evaluation',
} as const;

export const VALIDATION_CONCEPTS = [
  {
    id: 'concept-01',
    label: 'Concept 01',
    name: 'Warmth & Rhythm',
    image: '/images/v1.jpg',
    frameBackground: '#f2eae1',
    blendFrame: true,
    emotionalTheme: 'Warmth · Rhythm',
    culturalTranslation: 'Festive drumming · Joyful gathering',
    designStrategy: 'Circular drum form · Soft contours',
    emotionalResponse: 'Sense of closeness · Warm companionship',
  },
  {
    id: 'concept-02',
    label: 'Concept 02',
    name: 'Cheerfulness & Gesture',
    image: '/images/v2.jpg',
    frameBackground: '#f7f1e8',
    blendFrame: false,
    emotionalTheme: 'Cheerfulness · Gesture',
    culturalTranslation: 'Smiling expression · Drumming gesture',
    designStrategy: 'Body gesture · Flowing lines and rhythmic variation',
    emotionalResponse: 'Joyful experience · Positive connection',
  },
  {
    id: 'concept-03',
    label: 'Concept 03',
    name: 'Comfort & Stability',
    image: '/images/v3.jpg',
    frameBackground: '#f7f1e8',
    blendFrame: false,
    emotionalTheme: 'Comfort · Stability',
    culturalTranslation: 'Seated posture · Calm presence',
    designStrategy: 'Stable composition · Balanced structure and comfortable wearing',
    emotionalResponse: 'Sense of reassurance · Emotional comfort',
  },
  {
    id: 'concept-04',
    label: 'Concept 04',
    name: 'Companionship & Celebration',
    image: '/images/v4.jpg',
    frameBackground: '#f7f1e8',
    blendFrame: false,
    emotionalTheme: 'Companionship · Celebration',
    culturalTranslation: 'Performance ritual · Shared celebration',
    designStrategy: 'Symbolic elements · Cultural memory and emotional expression',
    emotionalResponse: 'Social warmth · Celebratory atmosphere',
  },
] as const;

export const EMOTIONAL_RESPONSE_EVALUATION = [
  {
    id: 'alignment',
    label: 'Emotional Alignment',
    value: 'Consistency between extracted emotional keywords and jewelry concepts',
  },
  {
    id: 'cultural',
    label: 'Cultural Translation',
    value: 'Transformation of cultural symbols into recognizable jewelry elements',
  },
  {
    id: 'coherence',
    label: 'Design Coherence',
    value: 'Relationship between symbolic features and design strategies',
  },
  {
    id: 'experience',
    label: 'Wearable Experience',
    value: 'Consideration of wearable form, scale, and daily applicability',
  },
] as const;
