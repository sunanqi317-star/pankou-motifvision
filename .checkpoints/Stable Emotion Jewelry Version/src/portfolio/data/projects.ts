export const projectsIntro =
  'My projects explore how traditional Chinese craft and museum cultural objects can be protected, interpreted, and disseminated through digital heritage methods, AIGC, and design research. By structuring craft knowledge, restoring historical visual materials, generating new design forms, and creating interactive or emotionally meaningful experiences, my work aims to support the contemporary preservation and public communication of cultural heritage.';

export interface ProjectOverview {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  summary: string;
  keywords: readonly string[];
  image: {
    src: string;
    placeholderCaption: string;
    objectFit?: 'cover' | 'contain';
    layout?: 'horizontal' | 'default';
  };
  featured?: boolean;
}

export interface VisualEvidenceItem {
  caption: string;
  slotLabel: string;
  layout?: 'default' | 'wide';
  compare?: { before: string; after: string };
}

export interface ProjectDetail {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  time: string;
  institution: string;
  keywords: readonly string[];
  cover: {
    caption: string;
    slotLabel: string;
    src?: string;
    objectFit?: 'cover' | 'contain';
    layout?: 'horizontal' | 'default';
  };
  heroSummary?: string;
  overview: string;
  processSteps: readonly string[];
  roleTags: readonly string[];
  outputs: readonly string[];
  visualEvidence: readonly VisualEvidenceItem[];
}

export const projectOverviews: ProjectOverview[] = [
  {
    id: 'pankou-gene-lora',
    number: '01',
    title: 'Pankou Cultural Gene & LoRA Training',
    subtitle: 'From traditional craft preservation to contemporary design innovation',
    summary:
      'This project structures Pankou craft knowledge through a cultural gene database and a seven-dimensional labelling system. It explores how structured craft labels can support LoRA training, generative design experiments, and evaluation of cultural recognisability, structural clarity, and craft credibility.',
    keywords: [
      'Cultural Gene Database',
      'Seven-Dimensional Labelling',
      'LoRA',
      'AIGC',
      'Pankou Design',
      'Traditional Craft',
    ],
    image: {
      src: '/images/project-pankou-lora.jpg',
      placeholderCaption: 'Cultural gene database / LoRA result comparison',
      objectFit: 'contain',
      layout: 'horizontal',
    },
    featured: true,
  },
  {
    id: 'pankou-restoration',
    number: '02',
    title: 'Pankou Restoration & Interactive Digital Display',
    summary:
      'Focuses on the preservation and public dissemination of Republican-era Haipai Pankou heritage — transforming fragmented historical materials into structured cultural knowledge and accessible heritage experiences.',
    keywords: [
      'Pankou Restoration',
      'Digital Heritage',
      'Interactive Exhibition',
      '3D Reconstruction',
      'Public Dissemination',
    ],
    image: {
      src: '/images/project-pankou-restoration.jpg',
      placeholderCaption: 'Pankou restoration · virtual museum exhibition',
      objectFit: 'contain',
    },
  },
  {
    id: 'emotion-jewelry',
    number: '03',
    title: 'Emotion-Oriented Cultural Jewelry Design Using AIGC',
    summary:
      'A museum case study translating the Eastern Han Drumming and Chanting Figurine into emotion-oriented jewelry through semiotic analysis, keyword frameworks, and AIGC-assisted design research.',
    keywords: [
      'Emotion-Oriented Design',
      'Cultural Symbol Translation',
      'Peircean Semiotics',
      'Emotional Healing',
      'Museum Artifact',
    ],
    image: {
      src: '/images/project-aigc-jewelry.png',
      placeholderCaption: 'AIGC-generated cultural jewelry design',
      objectFit: 'contain',
    },
  },
];

export const projectDetails: ProjectDetail[] = [
  {
    id: 'pankou-gene-lora',
    number: '01',
    title: 'Pankou Cultural Gene & LoRA Training',
    subtitle: 'From traditional craft preservation to contemporary design innovation',
    time: '2025 – Present',
    institution: 'China University of Geosciences, Beijing',
    keywords: [
      'Cultural Gene Database',
      'Seven-Dimensional Labelling',
      'LoRA',
      'AIGC',
      'Pankou Design',
      'Traditional Craft',
    ],
    cover: {
      caption: 'Selected Pankou Data Samples from Republican-era Haipai Pankou',
      slotLabel: 'Cover · Database & LoRA Pipeline',
      src: '/images/project-pankou-lora.jpg',
      objectFit: 'contain',
      layout: 'horizontal',
    },
    heroSummary:
      'This project explores how structured Pankou craft knowledge can support cultural gene modelling, LoRA training, and AIGC-assisted design generation.',
    overview:
      'This project investigates how Haipai Pankou craft can be protected, interpreted, and reactivated for contemporary design. By translating traditional fastening forms, materials, motifs, colours, compositions, and structural skeletons into a cultural gene framework, the project builds a structured way to document and communicate Pankou craft knowledge. LoRA training and generative design are used as experimental tools to explore how traditional handcraft can be extended into modern design applications while maintaining cultural recognisability, structural clarity, and craft credibility.',
    processSteps: [
      'Image Collection',
      '7D Labelling',
      'Skeleton Analysis',
      'LoRA Training',
      'Result Comparison',
      'Evaluation',
    ],
    roleTags: [
      'Project framing',
      'Image collection',
      'Semantic labelling',
      'LoRA experiments',
      'Prompt design',
      'Manuscript writing',
    ],
    outputs: [
      'Research manuscript',
      'Pankou cultural gene database',
      'Seven-dimensional labelling framework',
      'LoRA training experiments',
      'Evaluation analysis',
    ],
    visualEvidence: [
      {
        caption: 'Cultural gene database screenshot',
        slotLabel: 'Gene Database UI',
      },
      {
        caption: 'Seven-dimensional labelling framework',
        slotLabel: '7D Labelling Framework',
      },
      {
        caption: 'Structural skeleton classification',
        slotLabel: 'Skeleton Classification',
      },
      {
        caption: 'LoRA training label example',
        slotLabel: 'LoRA Label Example',
      },
      {
        caption: 'Generated result comparison',
        slotLabel: 'Generative Comparison',
        layout: 'wide',
      },
      {
        caption: 'Evaluation / analysis figure',
        slotLabel: 'Evaluation Figure',
      },
    ],
  },
  {
    id: 'pankou-restoration',
    number: '02',
    title: 'Pankou Restoration & Interactive Digital Display',
    time: '2025 – Present',
    institution: 'China University of Geosciences, Beijing',
    keywords: [
      'Pankou Restoration',
      'Digital Heritage',
      '3D Reconstruction',
      'Virtual Museum',
      'Craft Preservation',
    ],
    cover: {
      caption: 'Image source: Cover of Liangyou Pictorial, Issue 147, 1939.',
      slotLabel: 'Cover · Republican-Era Pictorial',
      src: '/images/project-pankou-restoration.jpg',
      objectFit: 'contain',
    },
    overview:
      'This project focuses on the preservation and public dissemination of Republican-era Haipai Pankou heritage. Through archival analysis, digital reconstruction, and interactive visualization, fragmented historical materials are transformed into structured cultural knowledge and accessible heritage experiences, supporting the documentation, understanding, and transmission of traditional craft.',
    processSteps: [
      'Archival Research',
      'Digital Restoration',
      'Form Reconstruction',
      'Heritage Exhibition',
    ],
    roleTags: [
      'Source image analysis',
      'Style extraction',
      'Visual restoration',
      'Digital asset organisation',
      'Exhibition design',
      'Cultural interpretation',
    ],
    outputs: [
      'Restored Pankou style images',
      'Digital Pankou model assets',
      'Virtual museum exhibition',
      'Interactive artifact browsing',
      'Display documentation',
    ],
    visualEvidence: [
      {
        caption: 'Original Republican-era pictorial image',
        slotLabel: 'Archival Source',
      },
      {
        caption: 'Pankou style detail crop',
        slotLabel: 'Style Detail Crop',
      },
      {
        caption: 'Restored Pankou style image',
        slotLabel: 'Restored Style',
      },
      {
        caption: 'Before / after comparison',
        slotLabel: 'Restoration Compare',
        layout: 'wide',
        compare: { before: 'Before · Archival', after: 'After · Restored' },
      },
      {
        caption: 'Virtual museum artifact browsing',
        slotLabel: 'Museum Exhibition',
      },
      {
        caption: '3D Pankou reconstruction viewer',
        slotLabel: '3D Reconstruction',
      },
    ],
  },
  {
    id: 'emotion-jewelry',
    number: '03',
    title: 'Emotion-Oriented Cultural Jewelry Design Using AIGC',
    subtitle: 'From museum cultural symbol to emotion-oriented jewelry design',
    time: '2024 – Present',
    institution: 'China University of Geosciences, Beijing',
    keywords: [
      'Emotion-Oriented Design',
      'Cultural Symbol Translation',
      'Peircean Semiotics',
      'Emotional Healing',
      'Museum Artifact',
    ],
    cover: {
      caption: 'AIGC-generated emotional jewelry concept inspired by cultural symbols.',
      slotLabel: 'Cover · AIGC Jewelry Concept',
      src: '/images/project-aigc-jewelry.png',
      objectFit: 'contain',
    },
    overview:
      'This research explores how emotional values embedded in museum artifacts can be transformed into contemporary jewelry experiences that support emotional well-being. Taking the Eastern Han Drumming and Chanting Figurine as a cultural source, the project investigates how its joyful expression, dynamic gesture, and human connection are translated into emotional design elements. Semiotic interpretation, emotion keyword mapping, and AIGC-assisted generation are used as supporting approaches to bridge cultural heritage and healing-oriented jewelry design.',
    processSteps: [
      'Cultural Symbol Interpretation',
      'Emotion Keyword Framework',
      'AIGC-assisted Generation',
      'Emotional Healing Validation',
    ],
    roleTags: [
      'Semiotic analysis',
      'Emotion keyword framework',
      'Prompt design',
      'AIGC concept research',
      'Emotional evaluation',
      'Paper writing',
    ],
    outputs: [
      'DHIDE 2025 conference paper',
      'Oral presentation',
      'Emotion keyword framework',
      'AIGC jewelry concept studies',
      'Emotional healing evaluation',
    ],
    visualEvidence: [],
  },
];

export function getProjectDetail(slug: string): ProjectDetail | undefined {
  return projectDetails.find((project) => project.id === slug);
}
