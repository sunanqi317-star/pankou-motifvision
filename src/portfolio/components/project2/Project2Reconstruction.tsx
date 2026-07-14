import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DEFAULT_RECONSTRUCTION_MODEL,
  RECONSTRUCTION_MODELS,
  getReconstructionModel,
  type ReconstructionModelId,
} from '../../data/project2ReconstructionModels';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { OptimizedImage } from '../OptimizedImage';
import { Project2FbxViewerPlaceholder } from './Project2FbxViewerPlaceholder';
import styles from './Project2Reconstruction.module.css';

const LazyProject2FbxViewer = lazy(() =>
  import('./Project2FbxViewer').then((module) => ({ default: module.Project2FbxViewer })),
);

function DeferredModelViewer({
  modelId,
  onModelClick,
  viewerClassName,
}: {
  modelId: ReconstructionModelId;
  onModelClick: () => void;
  viewerClassName?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(stageRef, { rootMargin: '240px 0px', once: true });
  const model = getReconstructionModel(modelId);

  return (
    <div ref={stageRef}>
      {isVisible ? (
        <Suspense fallback={<Project2FbxViewerPlaceholder className={viewerClassName} />}>
          {/* No key on the viewer — keep WebGL Canvas persistent; only modelPath changes. */}
          <LazyProject2FbxViewer
            modelPath={model.path}
            rotation={model.rotation}
            scale={model.scale}
            onModelClick={onModelClick}
            viewerClassName={viewerClassName}
          />
        </Suspense>
      ) : (
        <Project2FbxViewerPlaceholder className={viewerClassName} />
      )}
    </div>
  );
}

export function Project2Reconstruction() {
  const [activeModel, setActiveModel] = useState<ReconstructionModelId>(DEFAULT_RECONSTRUCTION_MODEL);
  const [isStructuralOpen, setIsStructuralOpen] = useState(false);
  const current = getReconstructionModel(activeModel);

  const openStructural = useCallback(() => {
    setIsStructuralOpen(true);
  }, []);

  useEffect(() => {
    setIsStructuralOpen(false);
  }, [activeModel]);

  useEffect(() => {
    if (!isStructuralOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsStructuralOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isStructuralOpen]);

  return (
    <section
      id="structural-reconstruction"
      className={`project-detail-section reconstruction-section ${styles.section}`}
      aria-labelledby="project2-reconstruction-kicker"
    >
      <header className={styles.header}>
        <div id="project2-reconstruction-kicker" className={styles.kicker}>
          3D Reconstruction
        </div>

        <p className={styles.purpose}>
          3D reconstruction translates restored Pankou forms into inspectable digital models,
          enabling structural analysis, form comparison, and craft validation.
        </p>
      </header>

      <div className={`model-selector ${styles.modelSelector}`}>
        <div className={styles.selector} role="tablist" aria-label="Pankou type selector">
          {RECONSTRUCTION_MODELS.map((type) => (
            <button
              key={type.id}
              type="button"
              role="tab"
              aria-selected={activeModel === type.id}
              className={`${styles.selectorBtn}${
                activeModel === type.id ? ` ${styles.selectorBtnActive}` : ''
              }`}
              onClick={() => setActiveModel(type.id)}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div
        id="restructure-3d-reconstruction-layout"
        className={`viewer-container project2-reconstruction-viewer-container ${styles.viewerContainer}`}
      >
        <div className={`project2-reconstruction-viewer-pedestal ${styles.viewerPedestal}`}>
          <DeferredModelViewer
            modelId={activeModel}
            onModelClick={openStructural}
            viewerClassName={`project2-reconstruction-viewer ${styles.viewerFocus}`}
          />

          <figure className={styles.referenceOverlay} aria-label="Historical reference">
            <figcaption className={styles.referenceLabel}>Historical Reference</figcaption>
            <OptimizedImage
              src={current.referenceImage}
              alt={`Archival ${current.name} historical reference`}
              loading="lazy"
            />
          </figure>
        </div>
      </div>

      {isStructuralOpen
        ? createPortal(
            <div
              className={styles.modalBackdrop}
              onClick={() => setIsStructuralOpen(false)}
              role="presentation"
            >
              <div
                className={styles.modalCard}
                role="dialog"
                aria-modal="true"
                aria-labelledby="structural-popup-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.modalClose}
                  aria-label="Close structural information"
                  onClick={() => setIsStructuralOpen(false)}
                >
                  ×
                </button>

                <div className={styles.modalHeader}>
                  <h3 id="structural-popup-title" className={styles.modalTitle}>
                    {current.name}
                  </h3>
                  <p className={styles.modalSubtitle}>{current.chineseName}</p>
                </div>

                <div className={styles.modalDivider} aria-hidden="true" />

                <div className={styles.modalSection}>
                  <h4 className={styles.modalSectionTitle}>Structural Information</h4>
                  <dl className={styles.modalList}>
                    {current.specs.map((spec) => (
                      <div key={spec.label} className={styles.modalItem}>
                        <dt className={styles.modalLabel}>{spec.label}</dt>
                        <dd className={styles.modalValue}>{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
