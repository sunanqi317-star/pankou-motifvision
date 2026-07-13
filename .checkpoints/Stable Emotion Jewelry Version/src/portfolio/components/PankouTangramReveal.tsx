import { useCallback, useMemo, useState } from 'react';
import {
  pankouGeneDimensions,
  pankouGeneSamples,
  placketStructureReference,
  type GeneId,
  type SampleId,
} from '../data/pankouGeneSamples';
import '../styles/pankou-tangram-reveal.css';

const tangramGeometry: Record<
  GeneId,
  { clipPath: string; labelX: string; labelY: string }
> = {
  form: {
    clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%)',
    labelX: '22%',
    labelY: '18%',
  },
  craft: {
    clipPath: 'polygon(0% 100%, 100% 100%, 50% 50%)',
    labelX: '58%',
    labelY: '78%',
  },
  material: {
    clipPath: 'polygon(100% 0%, 100% 50%, 50% 50%)',
    labelX: '78%',
    labelY: '22%',
  },
  colour: {
    clipPath: 'polygon(100% 50%, 100% 100%, 75% 75%)',
    labelX: '86%',
    labelY: '62%',
  },
  composition: {
    clipPath: 'polygon(50% 50%, 75% 75%, 50% 100%)',
    labelX: '58%',
    labelY: '58%',
  },
  motif: {
    clipPath: 'polygon(50% 0%, 75% 25%, 50% 50%, 25% 25%)',
    labelX: '48%',
    labelY: '32%',
  },
  skeleton: {
    clipPath: 'polygon(0% 0%, 50% 0%, 75% 25%, 25% 25%)',
    labelX: '28%',
    labelY: '38%',
  },
};

const revealMasks: Record<GeneId, string> = {
  form: 'polygon(0% 0%, 38% 0%, 22% 36%, 0% 48%)',
  skeleton: 'polygon(0% 48%, 22% 36%, 38% 0%, 52% 16%, 34% 40%)',
  material: 'polygon(38% 0%, 68% 0%, 54% 32%, 38% 26%)',
  motif: 'polygon(34% 26%, 54% 32%, 60% 52%, 40% 58%, 26% 40%)',
  composition: 'polygon(26% 40%, 40% 58%, 54% 68%, 70% 54%, 54% 32%)',
  craft: 'polygon(54% 68%, 100% 42%, 100% 100%, 0% 100%, 0% 48%)',
  colour: 'polygon(68% 0%, 100% 0%, 100% 42%, 60% 52%, 54% 32%)',
};

interface PankouTangramRevealProps {
  sampleId: SampleId;
}

export function PankouTangramReveal({ sampleId }: PankouTangramRevealProps) {
  const [activePieces, setActivePieces] = useState<GeneId[]>([]);
  const [currentGene, setCurrentGene] = useState<GeneId | null>(null);

  const sample = useMemo(
    () => pankouGeneSamples.find((item) => item.id === sampleId) ?? pankouGeneSamples[0],
    [sampleId],
  );

  const geneItems = useMemo(
    () =>
      pankouGeneDimensions.map((dimension) => ({
        ...dimension,
        ...tangramGeometry[dimension.id],
        gene: sample.genes[dimension.id],
      })),
    [sample],
  );

  const revealedCount = activePieces.length;
  const isComplete = revealedCount === geneItems.length;

  const currentItem = useMemo(
    () => geneItems.find((item) => item.id === currentGene) ?? null,
    [currentGene, geneItems],
  );

  const handlePieceClick = useCallback((id: GeneId) => {
    setActivePieces((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setCurrentGene(id);
  }, []);

  return (
    <div className="pankou-tangram-reveal">
      <div className="tangram-reveal-layout">
        <div className="tangram-square-panel">
          <div className="tangram-square-label">Cultural Gene Tangram</div>
          <p className="tangram-sample-label">
            {sample.code} {sample.title}
            <span lang="zh-Hans"> · {sample.titleZh}</span>
          </p>
          <div className="tangram-square" role="group" aria-label="Cultural gene tangram pieces">
            {geneItems.map((item) => {
              const isActive = activePieces.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`tangram-piece tangram-piece-${item.id}${isActive ? ' is-active' : ''}`}
                  style={{ clipPath: item.clipPath }}
                  aria-pressed={isActive}
                  aria-label={`${item.title}: ${item.gene.value}`}
                  onClick={() => handlePieceClick(item.id)}
                >
                  <span
                    className="tangram-piece-label"
                    style={{ left: item.labelX, top: item.labelY }}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="tangram-square-hint">
            Click each tangram piece to reveal part of the Pankou image and read its gene
            explanation.
          </p>
        </div>

        <div className="pankou-reveal-panel">
          <div className="pankou-reveal-header">
            <span className="pankou-reveal-title">Pankou Reveal</span>
            <span className="pankou-reveal-counter">
              Revealed: {revealedCount} / 7
            </span>
          </div>

          <div className="pankou-reveal-frame">
            <img
              src={sample.imageSrc}
              alt={`${sample.title} cultural gene sample`}
              className="pankou-reveal-image"
              loading="lazy"
            />
            {geneItems.map((item) => (
              <div
                key={item.id}
                className={`pankou-reveal-mask${activePieces.includes(item.id) ? ' is-revealed' : ''}`}
                style={{ clipPath: revealMasks[item.id] }}
                aria-hidden="true"
              />
            ))}
          </div>

          {isComplete ? (
            <p className="pankou-reveal-complete">Full cultural gene image revealed</p>
          ) : null}

          <div className="tangram-gene-detail-panel" aria-live="polite">
            {currentItem ? (
              <>
                <span className="tangram-gene-detail-status">{currentItem.panelLabel}</span>
                <h3 className="tangram-gene-detail-title">{currentItem.geneTitle}</h3>
                <p className="tangram-gene-detail-value">{currentItem.gene.value}</p>
                <p className="tangram-gene-detail-description">
                  {currentItem.gene.explanation}
                </p>
                {currentItem.id === 'composition' ? (
                  <div className="tangram-gene-evidence">
                    <img
                      src={placketStructureReference.src}
                      alt={placketStructureReference.alt}
                      className="tangram-gene-evidence-image"
                      loading="lazy"
                    />
                    <p className="tangram-gene-evidence-caption">
                      {placketStructureReference.caption}
                    </p>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <span className="tangram-gene-detail-status">Awaiting selection</span>
                <h3 className="tangram-gene-detail-title">Explore the cultural gene tangram</h3>
                <p className="tangram-gene-detail-description">
                  Select a tangram piece to reveal a fragment of the {sample.title} image and
                  learn how each of the seven cultural gene dimensions contributes to the
                  complete form.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
