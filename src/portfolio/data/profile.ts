export const profile = {
  name: 'Anqi Sun',
  email: 'sunanqi317@gmail.com',
  cvPath: '/cv.pdf',
  profileImage: '/images/profile.jpg',
  academicIdentity: {
    role: 'Master of Design student',
    institution: 'China University of Geosciences, Beijing',
  },
  researchInterests: [
    'Human-Computer Interaction',
    'Digital Humanities',
    'Cultural Heritage',
    'Generative Design',
    'Creative AI',
    'Digital Cultural Experiences',
  ],
} as const;

export type AboutMeSegment = {
  text: string;
  emphasis?: boolean;
};

export const aboutMeParagraphs: AboutMeSegment[][] = [
  [
    { text: 'I am currently a ' },
    { text: 'Master of Design student', emphasis: true },
    { text: ' at ' },
    { text: 'China University of Geosciences, Beijing', emphasis: true },
    { text: ', and I am expected to graduate in ' },
    { text: 'June 2027', emphasis: true },
    {
      text: '. My research focuses on the relationship between cultural heritage, emerging technologies, and human-centered design, exploring how digital approaches and AI-assisted methods can support the interpretation, transformation, and communication of cultural knowledge.',
    },
  ],
  [
    {
      text: 'My current research investigates how traditional cultural knowledge can be documented, structured, and transformed through digital methods, computational approaches, and creative AI tools. Through projects involving cultural heritage digitization, generative design, and interactive experiences, I explore new ways of connecting historical narratives with contemporary forms of visual expression and human-centered experiences.',
    },
  ],
  [
    { text: 'I am preparing for ' },
    { text: 'PhD opportunities for 2027 entry', emphasis: true },
    {
      text: ', with the aim of further investigating how emerging technologies can contribute to cultural understanding, knowledge representation, and experiential innovation. My future research interests focus on interdisciplinary approaches combining digital humanities, artificial intelligence, interaction design, and cultural studies.',
    },
  ],
  [
    {
      text: 'Beyond academic research, I enjoy exploring food and traveling as ways of experiencing different cultures and lifestyles. These experiences continue to shape my understanding of cultural narratives, environmental contexts, and human-centered approaches to design research.',
    },
  ],
] as const;

export const education = [
  {
    degree: 'Master of Design',
    institution: 'China University of Geosciences, Beijing',
    period: 'Sep. 2024 – Jul. 2027',
    averageScore: '88.3 / 100',
    gpa: '3.48 / 4.0',
    ranking: '4 / 40',
    coursework: [
      'Chinese Traditional Material Culture',
      'Master’s Literature Review',
      'Jewelry Marketing',
    ],
  },
  {
    degree: 'Bachelor of Product Design',
    institution: 'China University of Geosciences, Beijing',
    period: 'Mar. 2022 – Jul. 2024',
    averageScore: '93 / 100',
    gpa: '3.64 / 4.0',
    coursework: [
      'Chinese and Foreign Art History',
      'Design Composition',
      'Ceramic Craftsmanship',
    ],
  },
] as const;

export interface ResearchExperienceEntry {
  id: string;
  title: string;
  time: string;
  institution: string;
  overview: string;
  role: string;
  methods: string;
  outputs: string;
  label?: string;
  cardVariant?: 'core' | 'material' | 'ethics';
  image?: string;
  imageAlt?: string;
}

export const researchExperience: ResearchExperienceEntry[] = [
  {
    id: 'pankou-computable-heritage',
    title: 'Haipai Pankou as Digital Craft Heritage: A Playable and Computable Framework',
    time: '2025 – Present',
    institution: 'China University of Geosciences, Beijing',
    label: 'Core Research Project',
    cardVariant: 'core',
    overview:
      'Transforms Haipai Pankou into a semantic, generative, and interactive digital heritage system.',
    role:
      'Project framing, visual analysis, semantic labelling, LoRA/AIGC experiments, prototype design, manuscript writing.',
    methods:
      'Cultural gene database · Seven-dimensional labelling · Structural analysis · Stable Diffusion · LoRA · Digital modeling',
    outputs:
      'Research manuscript · Pankou database · Digital models · AIGC experiments',
  },
  {
    id: 'pankou-restoration',
    title: 'Pankou Restoration and Interactive Digital Display',
    time: '2025 – Present',
    institution: 'China University of Geosciences, Beijing',
    overview:
      'Restores Republican-era Pankou styles and transforms them into a virtual museum exhibition for interactive digital heritage communication.',
    role:
      'Image analysis, style extraction, visual restoration, digital asset organisation, exhibition design, and cultural interpretation.',
    methods:
      'Archival analysis · Visual reconstruction · Digital modelling · Interactive exhibition · Cultural interpretation',
    outputs:
      'Restored Pankou images · Digital models · Virtual museum exhibition · Interactive browsing experience',
  },
  {
    id: 'emotion-jewelry',
    title: 'Emotion-Oriented Cultural Jewelry Design Using AIGC',
    time: '2024 – Present',
    institution: 'China University of Geosciences, Beijing',
    overview:
      'Translates museum cultural symbols into emotion-oriented jewelry design through AIGC-assisted methods.',
    role:
      'Symbol analysis, emotional keyword extraction, prompt design, AIGC generation, concept development, paper writing.',
    methods:
      'Emotional design · Peircean semiotics · Midjourney · Dreamina · Design evaluation',
    outputs:
      'Conference paper · Oral presentation · Jewelry proposals · Emotional keyword system · AIGC design images',
  },
  {
    id: 'design-ethics-jewelry',
    title: 'Human-Centered Wearable Design and Emotional Interaction',
    time: '2025',
    institution: 'China University of Geosciences, Beijing',
    label: 'Human-Centered Wearables',
    cardVariant: 'ethics',
    image: '/images/design-ethics-jewelry.png',
    imageAlt: 'Human-centered wearable design exploring emotional interaction',
    overview:
      'Explores human-centered wearable design through emotional interaction and intelligent accessories, investigating how interactive jewelry can respond to user needs and support meaningful experiences.',
    role:
      'Wearable concept development, emotional interaction research, user needs analysis, and user-centered design exploration.',
    methods:
      'Wearable design · Emotional interaction · Interactive jewelry · User needs · User-centered design',
    outputs:
      'Wearable design concepts · Interactive jewelry proposals · Emotional interaction framework · User experience documentation',
  },
  {
    id: 'padparadscha-sapphire',
    title:
      'Value Factors, Appraisal Methods, and Design Potential of Padparadscha Sapphire',
    time: '2025',
    institution: 'China University of Geosciences, Beijing',
    label: 'Material, Market & Design Research',
    cardVariant: 'material',
    overview:
      'Examined how colour, clarity, carat weight, cut, origin, and treatment conditions shape the value of Padparadscha sapphire in jewelry appraisal.',
    role:
      'Compared market prices, collected visual references, analysed value factors, and connected gemstone appraisal with jewelry design opportunities.',
    methods:
      'Value-factor analysis · Market price comparison · Market approach · Cost approach · Appraisal workflow · Design research',
    outputs:
      'Research report · Appraisal workflow · Market price summary · Value-factor analysis · Related jewelry design concepts',
  },
];

export const outputs = [
  {
    id: 'pankou-paper',
    title:
      'Modelling Haipai Pankou as Computable Heritage: A Semantic–Structural Framework for Digital Interpretation, Generation, and Fabrication',
    role: 'First Author',
    venue: 'Manuscript submitted to Digital Scholarship in the Humanities',
    status: 'Under Review',
  },
  {
    id: 'emotion-paper',
    title:
      'Emotion-Oriented Cultural Jewelry Design Using AIGC: A Case Study of the Eastern Han Drumming and Chanting Figurine',
    role: 'First Author',
    venue: 'Accepted Conference Paper and Oral Presentation, DHIDE 2025',
    status: 'Accepted for publication, expected Oct. 2026',
  },
] as const;

export const publicationsAndPresentations = [
  {
    id: 'pankou-journal',
    type: 'Journal Manuscript',
    statusBadge: 'Under Review',
    title:
      'Modelling Haipai Pankou as Computable Heritage: A Semantic–Structural Framework for Digital Interpretation, Generation, and Fabrication',
    roleLine: {
      before: 'First Author · Manuscript submitted to ',
      emphasis: 'Digital Scholarship in the Humanities',
    },
  },
  {
    id: 'emotion-conference',
    type: 'Conference Paper & Oral Presentation',
    statusBadge: 'Accepted',
    title:
      'Emotion-Oriented Cultural Jewelry Design Using AIGC: A Case Study of the Eastern Han Drumming and Chanting Figurine',
    roleLine: {
      before:
        'First Author · Accepted Conference Paper and Oral Presentation · DHIDE 2025 · Jul. 2025',
    },
    note: 'Accepted for publication · Expected Oct. 2026',
  },
] as const;

export const skills = [
  {
    category: 'Generative AI Tools',
    items: 'Stable Diffusion · Midjourney · Dreamina',
  },
  {
    category: 'Design and Prototyping Tools',
    items: 'KeyShot · Adobe Illustrator · Nomad Sculpt · Unity',
  },
  {
    category: 'Documentation and Programming',
    items: 'LaTeX · C++',
  },
] as const;

export const navLinks = [
  { id: 'about-me', label: 'About', path: '/' as const },
  { id: 'projects', label: 'Projects', path: '/projects' as const },
  { id: 'cv', label: 'Download CV', href: profile.cvPath, external: true },
] as const;
