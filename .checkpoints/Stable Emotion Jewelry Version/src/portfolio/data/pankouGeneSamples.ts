export type GeneId =
  | 'form'
  | 'craft'
  | 'material'
  | 'colour'
  | 'composition'
  | 'motif'
  | 'skeleton';

export type SampleId = 'yizi' | 'panhua' | 'butterfly' | 'ruyi';

export interface GeneEntry {
  value: string;
  explanation: string;
}

export interface PankouSample {
  id: SampleId;
  code: string;
  title: string;
  titleZh: string;
  imageSrc: string;
  imagePlaceholder?: string;
  genes: Record<GeneId, GeneEntry>;
}

export interface GeneDimensionMeta {
  id: GeneId;
  title: string;
  panelLabel: string;
  geneTitle: string;
}

export const pankouGeneDimensions: readonly GeneDimensionMeta[] = [
  { id: 'form', title: 'Form', panelLabel: 'GENE DIMENSION 01', geneTitle: 'Form Gene' },
  { id: 'craft', title: 'Craft', panelLabel: 'GENE DIMENSION 02', geneTitle: 'Craft Gene' },
  { id: 'material', title: 'Material', panelLabel: 'GENE DIMENSION 03', geneTitle: 'Material Gene' },
  { id: 'colour', title: 'Colour', panelLabel: 'GENE DIMENSION 04', geneTitle: 'Colour Gene' },
  { id: 'composition', title: 'Composition', panelLabel: 'GENE DIMENSION 05', geneTitle: 'Composition Gene' },
  { id: 'motif', title: 'Motif Semantics', panelLabel: 'GENE DIMENSION 06', geneTitle: 'Motif Semantics Gene' },
  { id: 'skeleton', title: 'Structural Skeleton', panelLabel: 'GENE DIMENSION 07', geneTitle: 'Structural Skeleton Gene' },
];

export const sharedCompositionGene: GeneEntry = {
  value: 'Axial symmetry and balanced decorative arrangement',
  explanation:
    'Composition Gene describes the shared visual organization of Republican-era Haipai Pankou, including axial symmetry, central fastening, bilateral balance, and the arrangement of decorative units.',
};

export const geneDimensionIntros: Record<
  Exclude<GeneId, 'composition'>,
  string
> = {
  form:
    'The Form Gene records silhouette structure, shape characteristics, and symmetry in visual organization. It classifies representative Pankou morphology into two primary formal categories: Yizi Knot and Panhua Knot.',
  craft:
    'The Craft Gene documents knotting techniques, handcraft process, and construction method. Pankou making is classified into Soft Flower Knot and Hard Flower Knot according to how the textile cord is shaped and fixed.',
  material:
    'The Material Gene describes silk cord, textile material characteristics, and tactile and visual qualities. Representative material categories include silk, brocade, and cotton-linen.',
  colour:
    'The Colour Gene records dominant colours, colour relationships, and cultural meaning. Colour is organized into soft tone, neutral tone, and cool tone groups.',
  motif:
    'The Motif Semantics Gene interprets decorative motifs, symbolic meanings, and cultural interpretation through four meaning categories: aesthetic orientation, emotional projection, ritual order, and gender identity.',
  skeleton:
    'The Structural Skeleton Gene classifies axial structure, symmetry, internal framework, and construction logic according to path type, node density, and constraint mode.',
};

export const placketStructureReference = {
  src: '/images/Figure8.png',
  alt: 'Qipao placket structure reference',
  label: 'Qipao Placket Structure Reference',
  caption:
    'Qipao placket structures provide a reference for understanding how Pankou closures relate to garment opening lines, body axis, and visual balance.',
} as const;

export const sampleSpecificGeneDimensions = pankouGeneDimensions.filter(
  (dimension) => dimension.id !== 'composition',
);

export const pankouGeneSamples: readonly PankouSample[] = [
  {
    id: 'ruyi',
    code: 'S01',
    title: 'Ruyi Knot',
    titleZh: '如意扣',
    imageSrc: '/images/ruyi.png',
    genes: {
      form: {
        value: 'Curved ruyi silhouette with symbolic contour',
        explanation:
          'Silhouette structure follows a ruyi-shaped curve with rounded terminals. Shape characteristics emphasize cloud-like turns and ornamental contour rather than strict symmetry. Visual organization remains readable through a continuous curvilinear outline.',
      },
      craft: {
        value: 'Curved cord shaping and ornamental fixing',
        explanation:
          'Knotting techniques focus on controlled bending, turning, and fixing of silk cord. The handcraft process shapes smooth curves by hand before securing the outline. Construction method prioritizes maintaining the ruyi profile through careful cord placement.',
      },
      material: {
        value: 'Soft silk cord with rounded handmade contour',
        explanation:
          'Silk cord provides pliable material for curved shaping. Textile characteristics emphasize softness, rounded edges, and handmade tactility. Visual qualities highlight gentle surface volume and craft-led material expression.',
      },
      colour: {
        value: 'Golden yellow with auspicious warmth',
        explanation:
          'Dominant colour reads as warm golden yellow. Colour relationships support the ruyi motif through bright, decorative contrast against garment fabric. Cultural meaning links the tone to blessing, fortune, and ornamental richness.',
      },
      composition: sharedCompositionGene,
      motif: {
        value: 'Auspiciousness and wish fulfillment',
        explanation:
          'Decorative motifs draw on the ruyi form as a symbolic shape. Symbolic meanings include good fortune, smoothness, and fulfilled wishes. Cultural interpretation treats the knot as an auspicious fastening emblem in Haipai dress culture.',
      },
      skeleton: {
        value: 'Curvilinear symbolic skeleton',
        explanation:
          'Axial structure follows a continuous curved path rather than a straight axis. Symmetry appears through balanced turning points and rounded terminals. Internal framework is organized as a flowing loop path with symbolic construction logic.',
      },
    },
  },
  {
    id: 'panhua',
    code: 'S02',
    title: 'Floral Knot',
    titleZh: '盘花扣',
    imageSrc: '/images/pankou-7d-form-panhua-model.png',
    genes: {
      form: {
        value: 'Floral coiled silhouette with layered volume',
        explanation:
          'Silhouette structure is built from coiled floral loops and outward extensions. Shape characteristics include layered circular forms and ornamental density. Symmetry and visual organization emerge through repeated coiling around a decorative centre.',
      },
      craft: {
        value: 'Coiling and layered knot formation',
        explanation:
          'Knotting techniques rely on repeated coiling, bending, and fixing of cord. The handcraft process builds volume through successive loops and controlled turns. Construction method creates a firmer ornamental structure with raised contour.',
      },
      material: {
        value: 'Soft textile cord with raised brocade tactility',
        explanation:
          'Silk cord and brocade-related textile surfaces support dimensional shaping. Material characteristics highlight softness, surface texture, and handmade volume. Tactile and visual qualities emphasize decorative richness and craft depth.',
      },
      colour: {
        value: 'Pale sage grey in a cool decorative tone',
        explanation:
          'Dominant colour appears as pale sage grey. Colour relationships create a calm contrast against garment fabric and floral form. Cultural meaning supports refined, quiet elegance in Haipai decorative dress culture.',
      },
      composition: sharedCompositionGene,
      motif: {
        value: 'Floral auspicious meaning',
        explanation:
          'Decorative motifs are organized around floral coiling and blossom-like contour. Symbolic meanings include beauty, refinement, blessing, and feminine elegance. Cultural interpretation links the floral knot to auspicious adornment in Republican-era Haipai dress.',
      },
      skeleton: {
        value: 'Coiled floral skeleton',
        explanation:
          'Axial structure is organized through continuous loop paths and repeated turning points. Symmetry is maintained through coiled repetition rather than strict bilateral mirroring. Internal framework and construction logic follow a dense ornamental loop system.',
      },
    },
  },
  {
    id: 'butterfly',
    code: 'S03',
    title: 'Butterfly Knot',
    titleZh: '蝴蝶扣',
    imageSrc: '/images/hudie.png',
    genes: {
      form: {
        value: 'Butterfly-shaped symmetrical silhouette',
        explanation:
          'Silhouette structure spreads outward in wing-like curves around a central body. Shape characteristics emphasize paired contours and mirrored extension. Symmetry and visual organization are defined by bilateral wing balance.',
      },
      craft: {
        value: 'Paired loop shaping and mirrored construction',
        explanation:
          'Knotting techniques use paired loop formation and controlled bending. The handcraft process shapes both wings through mirrored cord arrangement. Construction method fixes the loops to preserve symmetrical butterfly volume.',
      },
      material: {
        value: 'Flexible silk cord with soft dimensionality',
        explanation:
          'Silk cord supports curved outlines and raised loop surfaces. Textile characteristics emphasize flexibility, softness, and delicate handmade texture. Visual and tactile qualities enhance the lightness of the butterfly form.',
      },
      colour: {
        value: 'Dark walnut brown in a neutral tone',
        explanation:
          'Dominant colour reads as dark walnut brown. Colour relationships create stable contrast with garment fabric while preserving decorative clarity. Cultural meaning supports maturity, restraint, and balanced visual presence.',
      },
      composition: sharedCompositionGene,
      motif: {
        value: 'Grace, vitality, and auspicious transformation',
        explanation:
          'Decorative motifs translate butterfly wings into an ornamental fastening form. Symbolic meanings include lightness, elegance, vitality, and transformation. Cultural interpretation connects the motif to feminine grace and auspicious adornment.',
      },
      skeleton: {
        value: 'Mirrored loop skeleton',
        explanation:
          'Axial structure is anchored by a central connection point with paired wing loops. Symmetry is explicitly bilateral across left and right loop paths. Internal framework and construction logic follow mirrored loop organization.',
      },
    },
  },
  {
    id: 'yizi',
    code: 'S04',
    title: 'Yizi Knot',
    titleZh: '一字扣',
    imageSrc: '/images/pankou-7d-form-yizi-model.png',
    genes: {
      form: {
        value: 'Straight linear silhouette with axial orientation',
        explanation:
          'Silhouette structure is defined by a restrained horizontal line. Shape characteristics emphasize simplicity, order, and minimal contour. Symmetry and visual organization follow a clear single-axis arrangement.',
      },
      craft: {
        value: 'Basic corded knot construction',
        explanation:
          'Knotting techniques focus on wrapping, shaping, and fixing a single cord line. The handcraft process is concise and function-led. Construction method produces a stable closure through controlled cord manipulation.',
      },
      material: {
        value: 'Textile cord against brocade fabric surface',
        explanation:
          'Silk cord and brocade fabric create a soft but structured material pairing. Textile characteristics highlight pliability, hand-shaped texture, and garment integration. Tactile and visual qualities keep craft detail visually prominent.',
      },
      colour: {
        value: 'Blush pink in a soft decorative tone',
        explanation:
          'Dominant colour appears as blush pink. Colour relationships support warmth and delicacy without overpowering the linear form. Cultural meaning aligns with gentle elegance and refined feminine dress expression.',
      },
      composition: sharedCompositionGene,
      motif: {
        value: 'Functional restraint and ritual order',
        explanation:
          'Decorative motifs remain minimal, with meaning carried by restraint rather than figurative symbolism. Symbolic meanings emphasize order, propriety, and understated elegance. Cultural interpretation links the linear form to ritualized dress closure.',
      },
      skeleton: {
        value: 'Single-axis skeleton',
        explanation:
          'Axial structure follows one horizontal line with low node complexity. Symmetry is expressed through balanced placement along the fastening axis. Internal framework and construction logic are simple, direct, and easy to annotate.',
      },
    },
  },
];
