import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  geneDimensionIntros,
  placketStructureReference,
  pankouGeneDimensions,
  pankouGeneSamples,
  type GeneEntry,
  type GeneId,
  type PankouSample,
  type SampleId,
} from '../data/pankouGeneSamples';

function resolveSampleGeneEntry(sample: PankouSample, activeGeneId: GeneId): GeneEntry {
  return sample.genes[activeGeneId];
}

function GenePopupSampleSummary({ geneEntry }: { geneEntry: GeneEntry }) {
  return (
    <div className="gene-popup-sample-summary">
      <div className="gene-popup-value">{geneEntry.value}</div>
      <p className="gene-popup-description">{geneEntry.explanation}</p>
    </div>
  );
}

const GENE_NODE_CLASS: Record<GeneId, string> = {
  form: 'gene-node-form',
  craft: 'gene-node-craft',
  material: 'gene-node-material',
  colour: 'gene-node-colour',
  composition: 'gene-node-composition',
  motif: 'gene-node-motif',
  skeleton: 'gene-node-skeleton',
};

const FORM_CATEGORIES = [
  {
    id: 'yizi' as const,
    title: 'Yizi Knot',
    titleZh: '一字扣',
    value: 'Straight linear morphology',
    description:
      'A restrained horizontal structure with clear axial orientation and simple linear silhouette.',
  },
  {
    id: 'panhua' as const,
    title: 'Panhua Knot',
    titleZh: '盘花扣',
    value: 'Floral coiled morphology',
    description:
      'A decorative floral structure with coiled loops, curved extensions, and layered ornamental form.',
  },
] as const;

type MaterialTypeId = 'silk' | 'brocade' | 'cotton-linen';

function getFormCategoryId(sampleId: SampleId): 'yizi' | 'panhua' {
  return sampleId === 'yizi' ? 'yizi' : 'panhua';
}

function getMaterialTypeId(sampleId: SampleId): MaterialTypeId {
  if (sampleId === 'yizi' || sampleId === 'panhua') {
    return 'brocade';
  }

  if (sampleId === 'butterfly') {
    return 'silk';
  }

  return 'cotton-linen';
}

const CRAFT_CATEGORIES = [
  {
    id: 'soft',
    matchesSample: (sampleId: SampleId) => sampleId === 'yizi' || sampleId === 'ruyi',
    title: 'Soft Flower Knot',
    titleZh: '软花扣',
    value: 'Flexible textile shaping',
    description:
      'Soft Flower Knot emphasizes flexible fabric manipulation, soft cord shaping, and hand-formed curves. The structure is usually softer and less fixed, allowing the Pankou form to retain a more pliable textile quality.',
  },
  {
    id: 'hard',
    matchesSample: (sampleId: SampleId) => sampleId === 'panhua' || sampleId === 'butterfly',
    title: 'Hard Flower Knot',
    titleZh: '硬花扣',
    value: 'Structured shaping and fixed formation',
    description:
      'Hard Flower Knot emphasizes more structured shaping, repeated coiling, bending, and fixing. The making process creates a firmer decorative form with clearer contour, raised volume, and more stable ornamental structure.',
  },
] as const;

const MATERIAL_CATEGORIES: readonly {
  id: MaterialTypeId;
  title: string;
  value: string;
  description: string;
}[] = [
  {
    id: 'silk',
    title: 'Silk',
    value: 'Smooth sheen and soft textile fluidity',
    description:
      'Silk emphasizes a smooth surface, soft sheen, and refined textile fluidity. It enhances the elegant and delicate visual character of Pankou forms.',
  },
  {
    id: 'brocade',
    title: 'Brocade',
    value: 'Decorative woven texture and structured surface',
    description:
      'Brocade emphasizes patterned weaving, denser surface texture, and a more structured textile appearance. It supports ornamental richness and cultural decorative expression.',
  },
  {
    id: 'cotton-linen',
    title: 'Cotton-linen',
    value: 'Matte texture and natural fabric tactility',
    description:
      'Cotton-linen emphasizes a more matte surface, visible fabric grain, and natural handmade tactility. It gives the Pankou form a softer, warmer, and less glossy material quality.',
  },
];

type ColourToneKey = 'soft' | 'neutral' | 'cool';

function getCurrentColour(sampleId: SampleId): {
  name: string;
  tone: string;
  toneKey: ColourToneKey;
  description: string;
} {
  switch (sampleId) {
    case 'yizi':
      return {
        name: 'Blush Pink',
        tone: 'Soft Tone',
        toneKey: 'soft',
        description:
          'A pale blush pink with a soft and gentle visual quality. It conveys delicacy, warmth, and a refined decorative softness.',
      };
    case 'panhua':
      return {
        name: 'Pale Sage Grey',
        tone: 'Cool Tone',
        toneKey: 'cool',
        description:
          'A muted pale sage-grey tone with a calm and restrained appearance. It gives the sample a quiet, elegant, and subtly cool visual character.',
      };
    case 'butterfly':
      return {
        name: 'Dark Walnut Brown',
        tone: 'Neutral Tone',
        toneKey: 'neutral',
        description:
          'A deep dark brown with a stable and grounded visual presence. It creates a restrained, mature, and balanced tonal impression.',
      };
    case 'ruyi':
      return {
        name: 'Golden Yellow',
        tone: 'Soft Tone',
        toneKey: 'soft',
        description:
          'A warm golden yellow with a bright and auspicious decorative quality. It conveys warmth, liveliness, and ornamental richness.',
      };
  }
}

const COLOUR_TONE_CATEGORIES: readonly {
  id: ColourToneKey;
  title: string;
  value: string;
  description: string;
  assignedSamples: string;
}[] = [
  {
    id: 'soft',
    title: 'Soft Tone',
    value: 'Gentle, warm, and visually approachable colour expression',
    description:
      'Soft tone refers to colours with a gentle, warm, or emotionally accessible visual quality. These colours often support softness, intimacy, elegance, and decorative warmth in Pankou design.',
    assignedSamples:
      'Current assigned samples: S01 Ruyi Knot · Golden Yellow; S04 Yizi Knot · Blush Pink',
  },
  {
    id: 'neutral',
    title: 'Neutral Tone',
    value: 'Restrained, balanced, and formal colour expression',
    description:
      'Neutral tone refers to colours with a restrained and balanced visual quality, such as black, white, grey, beige, or dark muted colours. These colours often support order, stability, and formal elegance.',
    assignedSamples: 'Current assigned sample: S03 Butterfly Knot · Dark Walnut Brown',
  },
  {
    id: 'cool',
    title: 'Cool Tone',
    value: 'Calm, quiet, and visually refreshing colour expression',
    description:
      'Cool tone refers to colours such as blue, green, cyan, blue-grey, or purple-based hues. These colours often create a calm, reserved, and refreshing visual atmosphere.',
    assignedSamples: 'Current assigned sample: S02 Floral Knot · Pale Sage Grey',
  },
];

type MeaningTypeId =
  | 'aesthetic-orientation'
  | 'emotional-projection'
  | 'ritual-order'
  | 'gender-identity';

function getMeaningTypeId(sampleId: SampleId): MeaningTypeId {
  switch (sampleId) {
    case 'yizi':
      return 'ritual-order';
    case 'panhua':
      return 'aesthetic-orientation';
    case 'butterfly':
      return 'gender-identity';
    case 'ruyi':
      return 'emotional-projection';
  }
}

const MEANING_CATEGORIES: readonly {
  id: MeaningTypeId;
  title: string;
  value: string;
  description: string;
}[] = [
  {
    id: 'aesthetic-orientation',
    title: 'Aesthetic Orientation',
    value: 'Refined decorative taste and visual elegance',
    description:
      'Aesthetic orientation emphasizes the visual refinement, ornamental rhythm, and decorative taste embodied in Pankou forms. It reflects the pursuit of elegance, delicacy, and stylistic beauty in Haipai dress culture.',
  },
  {
    id: 'emotional-projection',
    title: 'Emotional Projection',
    value: 'Auspicious wishes and symbolic blessing',
    description:
      'Emotional projection refers to the way Pankou motifs carry wishes, blessings, and emotional expectations. Ruyi-shaped forms are especially associated with smoothness, good fortune, and the fulfilment of wishes.',
  },
  {
    id: 'ritual-order',
    title: 'Ritual Order',
    value: 'Order, restraint, and formal closure',
    description:
      'Ritual order emphasizes the role of Pankou as a structured fastening element within dress etiquette. Linear and restrained forms express order, propriety, and controlled visual discipline.',
  },
  {
    id: 'gender-identity',
    title: 'Gender Identity',
    value: 'Feminine grace and embodied identity',
    description:
      'Gender identity refers to the way decorative Pankou forms participate in the expression of feminine elegance, body-related adornment, and gendered visual identity within qipao culture.',
  },
];

type SkeletonTypeId =
  | 'linear-axis'
  | 'bilateral'
  | 'radial'
  | 'continuous-loop'
  | 'composite-modular';

const SKELETON_TYPES: readonly {
  id: SkeletonTypeId;
  title: string;
  pathType: string;
  nodeDensity: string;
  constraint: string;
}[] = [
  {
    id: 'linear-axis',
    title: 'Linear-Axis Skeleton',
    pathType: 'Linear',
    nodeDensity: 'Low',
    constraint: 'Axial symmetry',
  },
  {
    id: 'bilateral',
    title: 'Bilateral Symmetric Skeleton',
    pathType: 'Mirrored',
    nodeDensity: 'Medium',
    constraint: 'Axial symmetry',
  },
  {
    id: 'radial',
    title: 'Radial Skeleton',
    pathType: 'Radial',
    nodeDensity: 'Medium',
    constraint: 'Approximate symmetry',
  },
  {
    id: 'continuous-loop',
    title: 'Continuous Loop Skeleton',
    pathType: 'Continuous loop',
    nodeDensity: 'High',
    constraint: 'Dynamic balance',
  },
  {
    id: 'composite-modular',
    title: 'Composite Modular Skeleton',
    pathType: 'Multi-path',
    nodeDensity: 'Multi-center',
    constraint: 'Mixed constraints',
  },
];

const SAMPLE_SKELETON: Record<SampleId, { typeId: SkeletonTypeId; note: string }> = {
  yizi: {
    typeId: 'linear-axis',
    note: 'The Yizi Knot is organized along a clear horizontal axis with a simple linear structure and low node complexity.',
  },
  panhua: {
    typeId: 'continuous-loop',
    note: 'The Floral Knot is formed by repeated coiling and curved loop structures, creating a dense and continuous ornamental path.',
  },
  butterfly: {
    typeId: 'bilateral',
    note: 'The Butterfly Knot is organized through mirrored wing-like loops on both sides of a central fastening point.',
  },
  ruyi: {
    typeId: 'continuous-loop',
    note: 'The Ruyi Knot follows curved and turning paths, creating a continuous symbolic skeleton with rounded terminals and flowing structural rhythm.',
  },
};

const SAMPLE_IMAGE_CLASS: Partial<Record<SampleId, string>> = {
  yizi: 'sample-image-yizi',
  panhua: 'sample-image-panhua',
};

function GeneSampleImage({
  src,
  alt,
  placeholder,
  sampleId,
}: {
  src: string;
  alt: string;
  placeholder?: string;
  sampleId?: SampleId;
}) {
  const [failed, setFailed] = useState(false);
  const sampleImageClass = sampleId ? SAMPLE_IMAGE_CLASS[sampleId] : undefined;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <span className="gene-image-placeholder">
        {placeholder ?? 'Sample image pending'}
      </span>
    );
  }

  const className = ['gene-sample-image', sampleImageClass].filter(Boolean).join(' ');

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function GeneConnectorLayer() {
  return (
    <svg
      className="gene-connector-layer"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line className="gene-connector" x1="25" y1="24" x2="43" y2="47" />
      <line className="gene-connector" x1="75" y1="24" x2="57" y2="47" />
      <line className="gene-connector" x1="84" y1="50" x2="66" y2="50" />
      <line className="gene-connector" x1="72" y1="74" x2="58" y2="56" />
      <line className="gene-connector" x1="50" y1="82" x2="50" y2="58" />
      <line className="gene-connector" x1="22" y1="74" x2="42" y2="56" />
      <line className="gene-connector" x1="12" y1="50" x2="34" y2="50" />
    </svg>
  );
}

function GeneDetailPopup({
  activeGene,
  sampleCode,
  sample,
  onClose,
}: {
  activeGene: GeneId;
  sampleCode: string;
  sample: (typeof pankouGeneSamples)[number];
  onClose: () => void;
}) {
  const geneMeta = pankouGeneDimensions.find((item) => item.id === activeGene)!;
  const isComposition = activeGene === 'composition';
  const isForm = activeGene === 'form';
  const isCraft = activeGene === 'craft';
  const isMaterial = activeGene === 'material';
  const isColour = activeGene === 'colour';
  const isMotif = activeGene === 'motif';
  const isSkeleton = activeGene === 'skeleton';
  const geneContent = resolveSampleGeneEntry(sample, activeGene);
  const isCategoryPopup = isForm || isCraft || isMaterial || isColour || isMotif;
  const currentFormCategoryId = getFormCategoryId(sample.id);
  const currentMaterialTypeId = getMaterialTypeId(sample.id);
  const currentColour = getCurrentColour(sample.id);
  const currentMeaningTypeId = getMeaningTypeId(sample.id);
  const currentSkeleton = SAMPLE_SKELETON[sample.id];

  const popup = (
    <div
      className="project-pankou-gene-lora gene-popup-portal-root"
      data-gene-popup-root={activeGene}
    >
    <div className="gene-popup-backdrop" onClick={onClose} role="presentation">
      <div
        className={`gene-popup-card${isCategoryPopup ? ' gene-popup-card--category' : ''}${
          isSkeleton ? ' skeleton-popup' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gene-popup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="gene-popup-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="gene-popup-label">
          {isComposition ? geneMeta.panelLabel : `${geneMeta.panelLabel} · ${sampleCode}`}
        </div>
        <h3 id="gene-popup-title" className="gene-popup-title">
          {geneMeta.geneTitle}
        </h3>

        {!isForm ? <GenePopupSampleSummary geneEntry={geneContent} /> : null}

        {isForm ? (
          <>
            <div className="form-category-grid">
              {FORM_CATEGORIES.map((category) => {
                const isActive = currentFormCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    className={`form-category-card${isActive ? ' active' : ''}`}
                  >
                    <div className="form-category-header">
                      <h4>{category.title}</h4>
                      {isActive ? (
                        <span className="form-category-check">✓ Current sample</span>
                      ) : null}
                    </div>
                    <div className="form-category-zh">{category.titleZh}</div>
                    <div className="form-category-value">{category.value}</div>
                    <p>{category.description}</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : isCraft ? (
          <>
            <p className="craft-gene-intro">{geneDimensionIntros.craft}</p>

            <div className="craft-category-grid">
              {CRAFT_CATEGORIES.map((category) => {
                const isActive = category.matchesSample(sample.id);

                return (
                  <div
                    key={category.id}
                    className={`craft-category-card${isActive ? ' active' : ''}`}
                  >
                    <div className="craft-category-header">
                      <h4>{category.title}</h4>
                      {isActive ? (
                        <span className="craft-category-check">✓ Current sample</span>
                      ) : null}
                    </div>
                    <div className="craft-category-zh">{category.titleZh}</div>
                    <div className="craft-category-value">{category.value}</div>
                    <p>{category.description}</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : isMaterial ? (
          <>
            <p className="material-gene-intro">{geneDimensionIntros.material}</p>

            <div className="material-category-grid">
              {MATERIAL_CATEGORIES.map((category) => {
                const isActive = currentMaterialTypeId === category.id;

                return (
                  <div
                    key={category.id}
                    className={`material-category-card${isActive ? ' active' : ''}`}
                  >
                    <div className="material-category-header">
                      <h4>{category.title}</h4>
                      {isActive ? (
                        <span className="material-category-check">✓ Current sample</span>
                      ) : null}
                    </div>
                    <div className="material-category-value">{category.value}</div>
                    <p>{category.description}</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : isColour ? (
          <>
            <p className="colour-gene-intro">{geneDimensionIntros.colour}</p>

            <div className="current-colour-summary">
              <div>
                <span>Current sample colour</span>
                <strong>{currentColour.name}</strong>
              </div>
              <div>
                <span>Tone category</span>
                <strong>{currentColour.tone}</strong>
              </div>
            </div>

            <p className="current-colour-description">{currentColour.description}</p>

            <div className="colour-tone-grid">
              {COLOUR_TONE_CATEGORIES.map((category) => {
                const isActive = currentColour.toneKey === category.id;

                return (
                  <div
                    key={category.id}
                    className={`colour-tone-card${isActive ? ' active' : ''}`}
                  >
                    <div className="colour-tone-header">
                      <h4>{category.title}</h4>
                      {isActive ? (
                        <span className="colour-tone-check">✓ Current sample</span>
                      ) : null}
                    </div>
                    <div className="colour-tone-value">{category.value}</div>
                    <p>{category.description}</p>
                    <div className="colour-tone-samples">{category.assignedSamples}</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : isMotif ? (
          <>
            <p className="meaning-gene-intro">{geneDimensionIntros.motif}</p>

            <div className="meaning-category-grid">
              {MEANING_CATEGORIES.map((category) => {
                const isActive = currentMeaningTypeId === category.id;

                return (
                  <div
                    key={category.id}
                    className={`meaning-category-card${isActive ? ' active' : ''}`}
                  >
                    <div className="meaning-category-header">
                      <h4>{category.title}</h4>
                      {isActive ? (
                        <span className="meaning-category-check">✓ Current sample</span>
                      ) : null}
                    </div>
                    <div className="meaning-category-value">{category.value}</div>
                    <p>{category.description}</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : isSkeleton ? (
          <>
            <p className="skeleton-gene-intro">{geneDimensionIntros.skeleton}</p>

            <div className="skeleton-type-grid">
              {SKELETON_TYPES.map((skeletonType) => {
                const isActive = currentSkeleton.typeId === skeletonType.id;

                return (
                  <div
                    key={skeletonType.id}
                    className={`skeleton-type-card${isActive ? ' active' : ''}`}
                  >
                    <div className="skeleton-type-header">
                      <h4>{skeletonType.title}</h4>
                      {isActive ? (
                        <span className="skeleton-type-check">✓ Current sample</span>
                      ) : null}
                    </div>
                    <dl className="skeleton-type-meta">
                      <div>
                        <dt>Path Type</dt>
                        <dd>{skeletonType.pathType}</dd>
                      </div>
                      <div>
                        <dt>Node Density</dt>
                        <dd>{skeletonType.nodeDensity}</dd>
                      </div>
                      <div>
                        <dt>Constraint</dt>
                        <dd>{skeletonType.constraint}</dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </div>

            <p className="skeleton-current-note">{currentSkeleton.note}</p>
          </>
        ) : null}

        {isComposition ? (
          <div className="gene-popup-figure">
            <div className="gene-popup-figure-label">{placketStructureReference.label}</div>
            <img
              src={placketStructureReference.src}
              alt={placketStructureReference.alt}
              loading="lazy"
            />
            <p>{placketStructureReference.caption}</p>
          </div>
        ) : null}
      </div>
    </div>
    </div>
  );

  return createPortal(popup, document.body);
}

function GeneImageNodeStage({
  sample,
  activeGene,
  onSelect,
}: {
  sample: (typeof pankouGeneSamples)[number];
  activeGene: GeneId | null;
  onSelect: (id: GeneId) => void;
}) {
  return (
    <div className="gene-image-node-stage">
      <GeneConnectorLayer />

      <div className="gene-image-node-core">
        <GeneSampleImage
          src={sample.imageSrc}
          alt={`${sample.title} sample`}
          placeholder={sample.imagePlaceholder}
          sampleId={sample.id}
        />
      </div>

      <div
        className="gene-image-node-toolbar gene-node-row-mobile"
        role="toolbar"
        aria-label="Pankou cultural gene map"
      >
        {pankouGeneDimensions.map((dimension) => (
          <button
            key={dimension.id}
            type="button"
            className={`gene-node ${GENE_NODE_CLASS[dimension.id]}${
              activeGene === dimension.id ? ' active' : ''
            }`}
            aria-pressed={activeGene === dimension.id}
            onClick={() => onSelect(dimension.id)}
          >
            <span className="gene-node-box">{dimension.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PankouGeneExplorer() {
  const [activeSample, setActiveSample] = useState<SampleId>('ruyi');
  const [activeGene, setActiveGene] = useState<GeneId | null>(null);

  const sample =
    pankouGeneSamples.find((item) => item.id === activeSample) ?? pankouGeneSamples[0]!;

  const closeGenePopup = () => setActiveGene(null);

  const handleGeneSelect = (id: GeneId) => {
    setActiveGene(id);
  };

  useEffect(() => {
    if (!activeGene) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeGenePopup();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeGene]);

  return (
    <section className="gene-profile-fullwidth">
      <div className="sample-selector-row pankou-sample-selector" role="tablist" aria-label="Pankou samples">
        {pankouGeneSamples.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === activeSample}
            className={`sample-button pankou-sample-button${item.id === activeSample ? ' active' : ''}`}
            onClick={() => {
              setActiveSample(item.id);
              setActiveGene(null);
            }}
          >
            {item.code} {item.title}
          </button>
        ))}
      </div>

      <GeneImageNodeStage sample={sample} activeGene={activeGene} onSelect={handleGeneSelect} />

      {activeGene ? (
        <GeneDetailPopup
          activeGene={activeGene}
          sampleCode={sample.code}
          sample={sample}
          onClose={closeGenePopup}
        />
      ) : null}
    </section>
  );
}
