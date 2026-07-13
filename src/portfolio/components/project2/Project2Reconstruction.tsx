import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { OptimizedImage } from '../OptimizedImage';
import { Project2FbxViewerPlaceholder } from './Project2FbxViewerPlaceholder';
import styles from './Project2Reconstruction.module.css';

const LazyProject2FbxViewer = lazy(() =>
  import('./Project2FbxViewer').then((module) => ({ default: module.Project2FbxViewer })),
);

type PankouTypeId = 'yizi' | 'floral';

interface PankouTypeConfig {
  id: PankouTypeId;
  label: string;
  modelPath: string;
  chineseName: string;
  referenceImage: string;
  specs: { label: string; value: string }[];
}

const PANKOU_TYPES: PankouTypeConfig[] = [
  {
    id: 'yizi',
    label: 'Yizi Knot',
    chineseName: '一字扣',
    modelPath: '/models/san.fbx',
    referenceImage: '/images/yizi.png',
    specs: [
      { label: 'Skeleton Type', value: 'Linear-axis' },
      { label: 'Craft Category', value: 'Soft flower knot' },
      { label: 'Structural Logic', value: 'Single-axis cord loop' },
    ],
  },
  {
    id: 'floral',
    label: 'Floral Knot',
    chineseName: '盘花扣',
    modelPath: '/models/hudie.fbx',
    referenceImage: '/images/panhua.png',
    specs: [
      { label: 'Skeleton Type', value: 'Continuous loop' },
      { label: 'Craft Category', value: 'Hard flower knot (Panhua)' },
      { label: 'Structural Logic', value: 'Radial petal assembly' },
    ],
  },
];

const DEFAULT_ACTIVE_MODEL: PankouTypeId = 'floral';

const MODEL_PATH_BY_ID: Record<PankouTypeId, string> = {
  yizi: PANKOU_TYPES[0].modelPath,
  floral: PANKOU_TYPES[1].modelPath,
};

function DeferredFbxViewer({
  modelPath,
  onModelClick,
  viewerClassName,
}: {
  modelPath: string;
  onModelClick: () => void;
  viewerClassName?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(stageRef, { rootMargin: '240px 0px', once: true });

  return (
    <div ref={stageRef}>
      {isVisible ? (
        <Suspense fallback={<Project2FbxViewerPlaceholder className={viewerClassName} />}>
          <LazyProject2FbxViewer
            modelPath={modelPath}
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
  const [activeModel, setActiveModel] = useState<PankouTypeId>(DEFAULT_ACTIVE_MODEL);
  const [requestedModels, setRequestedModels] = useState<Set<PankouTypeId>>(
    () => new Set([DEFAULT_ACTIVE_MODEL]),
  );
  const [isStructuralOpen, setIsStructuralOpen] = useState(false);
  const current = PANKOU_TYPES.find((type) => type.id === activeModel) ?? PANKOU_TYPES[1];
  const activeModelPath = requestedModels.has(activeModel)
    ? MODEL_PATH_BY_ID[activeModel]
    : MODEL_PATH_BY_ID[DEFAULT_ACTIVE_MODEL];

  useEffect(() => {
    setIsStructuralOpen(false);
  }, [activeModel]);

  const handleSelectModel = (modelId: PankouTypeId) => {
    setActiveModel(modelId);
    setRequestedModels((previous) => {
      if (previous.has(modelId)) {
        return previous;
      }
      const next = new Set(previous);
      next.add(modelId);
      return next;
    });
  };

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
          {PANKOU_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              role="tab"
              aria-selected={activeModel === type.id}
              className={`${styles.selectorBtn}${
                activeModel === type.id ? ` ${styles.selectorBtnActive}` : ''
              }`}
              onClick={() => handleSelectModel(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id="restructure-3d-reconstruction-layout"
        className={`viewer-container project2-reconstruction-viewer-container ${styles.viewerContainer}`}
      >
        <div className={`project2-reconstruction-viewer-pedestal ${styles.viewerPedestal}`}>
          <DeferredFbxViewer
            modelPath={activeModelPath}
            onModelClick={() => setIsStructuralOpen(true)}
            viewerClassName={`project2-reconstruction-viewer ${styles.viewerFocus}`}
          />

          <figure className={styles.referenceOverlay} aria-label="Historical reference">
            <figcaption className={styles.referenceLabel}>Historical Reference</figcaption>
            <OptimizedImage
              src={current.referenceImage}
              alt={`Archival ${current.label} historical reference`}
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
                    {current.label}
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
