import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { OptimizedImage } from './OptimizedImage';

const PANKOU_IMAGE = '/images/pankou-transparent.png';

const restorationEvidenceImages = {
  before: '/images/repare.png',
  repair: '/images/Repair.png',
} as const;

const restorationStageImages = {
  lineSketch: '/images/xiangao.png',
  model: '/images/moxing.png',
  rendering: '/images/yanse.png',
} as const;

const RENDERING_ZOOM = 2.5;
const MAGNIFIER_LENS_SIZE = 160;

function RestorationStagePreview({
  src,
  alt,
  variant = 'default',
}: {
  src: string;
  alt: string;
  variant?: 'default' | 'line-sketch' | 'model' | 'rendering';
}) {
  return (
    <div
      className={`restoration-stage-image-container${
        variant === 'line-sketch' ? ' restoration-stage-image-container--line-sketch' : ''
      }`}
    >
      <OptimizedImage
        className={
          variant === 'line-sketch'
            ? 'restoration-line-sketch-image'
            : variant === 'model'
              ? 'restoration-model-image'
              : variant === 'rendering'
                ? 'restoration-rendering-image'
                : 'restoration-stage-image'
        }
        src={src}
        alt={alt}
        loading="lazy"
      />
    </div>
  );
}

function EmbroideryHoopImageStage({
  activeRevealStep,
  pankouState,
  magnifierEnabled,
  src,
  alt,
}: {
  activeRevealStep: number;
  pankouState: { visible: boolean };
  magnifierEnabled: boolean;
  src: string;
  alt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, visible: false });
  const [lensMetrics, setLensMetrics] = useState<{
    imgWidth: number;
    imgHeight: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const handleMouseEnter = () => {
    if (!magnifierEnabled) return;
    setZoomPosition((prev) => ({ ...prev, visible: true }));
  };

  const handleMouseLeave = () => {
    setZoomPosition({ x: 0, y: 0, visible: false });
    setLensMetrics(null);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!magnifierEnabled) return;

    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;
    const halfLens = MAGNIFIER_LENS_SIZE / 2;

    const lensLeft = Math.max(
      0,
      Math.min(mouseX - halfLens, containerRect.width - MAGNIFIER_LENS_SIZE),
    );
    const lensTop = Math.max(
      0,
      Math.min(mouseY - halfLens, containerRect.height - MAGNIFIER_LENS_SIZE),
    );

    const relativeX = event.clientX - imageRect.left;
    const relativeY = event.clientY - imageRect.top;

    setZoomPosition({
      x: lensLeft + halfLens,
      y: lensTop + halfLens,
      visible: true,
    });
    setLensMetrics({
      imgWidth: imageRect.width,
      imgHeight: imageRect.height,
      offsetX: relativeX,
      offsetY: relativeY,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`pankou-image-stage${
        magnifierEnabled ? ' pankou-image-stage--inspectable' : ''
      }`}
      data-reveal-step={activeRevealStep}
      onMouseEnter={magnifierEnabled ? handleMouseEnter : undefined}
      onMouseMove={magnifierEnabled ? handleMouseMove : undefined}
      onMouseLeave={magnifierEnabled ? handleMouseLeave : undefined}
    >
      <OptimizedImage
        ref={imageRef}
        className={`pankou-restoration-image ${pankouState.visible ? 'visible' : ''}`}
        src={src}
        alt={alt}
        loading="eager"
        aria-hidden={!pankouState.visible}
      />
      {magnifierEnabled && zoomPosition.visible && lensMetrics && (
        <div
          className="embroidery-hoop-magnifier-lens"
          style={{
            width: MAGNIFIER_LENS_SIZE,
            height: MAGNIFIER_LENS_SIZE,
            left: zoomPosition.x - MAGNIFIER_LENS_SIZE / 2,
            top: zoomPosition.y - MAGNIFIER_LENS_SIZE / 2,
          }}
          aria-hidden="true"
        >
          <img
            className="pankou-restoration-image pankou-restoration-image--lens visible"
            src={src}
            alt=""
            style={{
              width: lensMetrics.imgWidth * RENDERING_ZOOM,
              height: lensMetrics.imgHeight * RENDERING_ZOOM,
              transform: `translate(${
                -lensMetrics.offsetX * RENDERING_ZOOM + MAGNIFIER_LENS_SIZE / 2
              }px, ${
                -lensMetrics.offsetY * RENDERING_ZOOM + MAGNIFIER_LENS_SIZE / 2
              }px)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

const pankouRevealStates = {
  1: {
    visible: false,
  },
  2: {
    visible: true,
    opacity: 0.25,
    blur: '2px',
    contrast: 0.85,
    saturate: 0.75,
  },
  3: {
    visible: true,
    opacity: 0.5,
    blur: '1px',
    contrast: 1,
    saturate: 0.85,
  },
  4: {
    visible: true,
    opacity: 0.75,
    blur: '0.3px',
    contrast: 1.05,
    saturate: 0.95,
  },
  5: {
    visible: true,
    opacity: 1,
    blur: '0px',
    contrast: 1,
    saturate: 1,
  },
} as const;

type PankouRevealStep = keyof typeof pankouRevealStates;

const getActiveRevealStep = (progress: number): PankouRevealStep =>
  progress <= 1 ? 1 : (Math.min(progress, 5) as PankouRevealStep);

const sdRestorationParams = [
  { label: 'Model', value: 'realisticVisionV50' },
  { label: 'Algorithm', value: 'R-ESRGAN 4x+' },
  { label: 'Scale', value: '4×' },
  { label: 'Encoder Tile', value: '900' },
  { label: 'Decoder Tile', value: '80' },
  { label: 'Control', value: 'Tile' },
  { label: 'Tile Model', value: 'control_v11f1e_sd15_tile' },
] as const;

const restorationSteps = [
  {
    id: 1,
    title: 'Before Restoration',
    description:
      'Shows the original archival Pankou source image before digital restoration.',
    type: 'before' as const,
  },
  {
    id: 2,
    title: 'Image Clarity Restoration',
    description:
      'The original archival Pankou image is enhanced through Stable Diffusion super-resolution to recover clearer contours, structural details, and surface information.',
    type: 'sd-restoration' as const,
  },
  {
    id: 3,
    title: 'Pankou Style Line Sketch',
    description:
      'Transforms the restored visual reference into a structured line sketch that clarifies the Pankou outline, loop path, and decorative form.',
  },
  {
    id: 4,
    title: 'Pankou 3D Modelling',
    description:
      'Reconstructs the Pankou style as a three-dimensional form, allowing the structure to be examined beyond the flat image.',
  },
  {
    id: 5,
    title: 'Pankou Rendering',
    description:
      'Applies colour, material, texture, and final visual details to complete the restored Pankou style for digital display.',
  },
] as const;

type RestorationStep = (typeof restorationSteps)[number];

const needlePositions = [
  { left: '28%', top: '26%' },
  { left: '50%', top: '32%' },
  { left: '68%', top: '44%' },
  { left: '50%', top: '64%' },
  { left: '52%', top: '48%' },
];

const fireworkParticles = [
  { tx: 0, ty: -8.5, size: 1.7, tone: 'coral', delay: 0 },
  { tx: 5.5, ty: -6.5, size: 1.3, tone: 'gold', delay: 0.04 },
  { tx: 8, ty: -1.5, size: 1.5, tone: 'peach', delay: 0.02 },
  { tx: 7, ty: 4.5, size: 1.2, tone: 'gold', delay: 0.06 },
  { tx: 3, ty: 8, size: 1.6, tone: 'coral', delay: 0.03 },
  { tx: -2.5, ty: 8.5, size: 1.3, tone: 'peach', delay: 0.05 },
  { tx: -7, ty: 5, size: 1.4, tone: 'gold', delay: 0.01 },
  { tx: -8.5, ty: -0.5, size: 1.2, tone: 'coral', delay: 0.07 },
  { tx: -5.5, ty: -5.5, size: 1.5, tone: 'peach', delay: 0.04 },
  { tx: 2.5, ty: -3, size: 1.1, tone: 'gold', delay: 0.08 },
  { tx: -3, ty: 2.5, size: 1, tone: 'peach', delay: 0.06 },
  { tx: 4.5, ty: 2, size: 1.1, tone: 'coral', delay: 0.09 },
] as const;

type FireworkPosition = {
  left: string;
  top: string;
};

const FIREWORK_SIZE_PX = 38;
const FIREWORK_EDGE_MARGIN_PX = 22;
const FIREWORK_MIN_CENTER_DISTANCE_PX = 18;
const FIREWORK_BLOOM_MS = 3000;
const FIREWORK_PAUSE_MS = 500;

function randomFireworkPosition(
  containerWidth: number,
  containerHeight: number,
): FireworkPosition {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { left: '50%', top: '50%' };
  }

  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const hoopRadius = Math.min(containerWidth, containerHeight) / 2;
  const maxRadius = hoopRadius - FIREWORK_EDGE_MARGIN_PX - FIREWORK_SIZE_PX / 2;

  if (maxRadius <= FIREWORK_MIN_CENTER_DISTANCE_PX) {
    return { left: '50%', top: '50%' };
  }

  let x = centerX;
  let y = centerY;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius =
      FIREWORK_MIN_CENTER_DISTANCE_PX +
      Math.sqrt(Math.random()) * (maxRadius - FIREWORK_MIN_CENTER_DISTANCE_PX);
    x = centerX + Math.cos(angle) * radius;
    y = centerY + Math.sin(angle) * radius;

    if (
      Math.hypot(x - centerX, y - centerY) + FIREWORK_SIZE_PX / 2 <=
      hoopRadius - FIREWORK_EDGE_MARGIN_PX
    ) {
      break;
    }
  }

  return {
    left: `${(x / containerWidth) * 100}%`,
    top: `${(y / containerHeight) * 100}%`,
  };
}

function EmbroideryFirework({ left, top }: { left: string; top: string }) {
  return (
    <div className="embroidery-firework" style={{ left, top }}>
      <span className="embroidery-firework__glow" aria-hidden="true" />
      <svg className="embroidery-firework__svg" viewBox="0 0 40 40" aria-hidden="true">
        <circle className="embroidery-firework__core" cx="20" cy="20" r="2" />
        <g className="embroidery-firework__burst">
          {fireworkParticles.map((particle, index) => (
            <circle
              key={index}
              className={`embroidery-firework__particle embroidery-firework__particle--${particle.tone}`}
              cx="20"
              cy="20"
              r={particle.size}
              style={{
                ['--fx-tx' as string]: `${particle.tx}px`,
                ['--fx-ty' as string]: `${particle.ty}px`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

function EmbroideryIdleFireworkLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<FireworkPosition | null>(null);
  const [cycle, setCycle] = useState(0);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const { width, height } = layer.getBoundingClientRect();
    if (width > 0 && height > 0) {
      setPosition(randomFireworkPosition(width, height));
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const layer = layerRef.current;
      if (!layer) return;

      const { width, height } = layer.getBoundingClientRect();
      setPosition(randomFireworkPosition(width, height));
      setCycle((current) => current + 1);
    }, FIREWORK_BLOOM_MS + FIREWORK_PAUSE_MS);

    return () => window.clearTimeout(timer);
  }, [cycle]);

  return (
    <div ref={layerRef} className="embroidery-firework-layer" aria-hidden="true">
      {position ? <EmbroideryFirework key={cycle} left={position.left} top={position.top} /> : null}
    </div>
  );
}

export function PankouRestorationGame() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<RestorationStep | null>(null);
  const [isStitching, setIsStitching] = useState(false);
  const [activeNeedleIndex, setActiveNeedleIndex] = useState(0);
  const [showPopover, setShowPopover] = useState(false);

  const activeNeedlePosition = needlePositions[activeNeedleIndex];
  const activeRevealStep = getActiveRevealStep(progress);
  const pankouState = pankouRevealStates[activeRevealStep];
  const showIdleAttraction = progress === 0 && !isStitching;

  const handleReplay = () => {
    setProgress(0);
    setCurrentStep(null);
    setShowPopover(false);
    setIsStitching(false);
    setActiveNeedleIndex(0);
  };

  const handleHoopClick = () => {
    if (isStitching) return;

    if (progress >= 5) {
      handleReplay();
      return;
    }

    const nextIndex = progress;
    setActiveNeedleIndex(nextIndex);
    setShowPopover(true);
    setIsStitching(true);

    setTimeout(() => {
      const nextProgress = progress + 1;
      setProgress(nextProgress);
      setCurrentStep(restorationSteps[nextProgress - 1]);
    }, 520);

    setTimeout(() => {
      setIsStitching(false);
    }, 1200);
  };

  const navigateToStep = (targetStep: number) => {
    if (isStitching) return;
    if (targetStep < 1 || targetStep > 5) return;
    if (progress === targetStep) return;

    setActiveNeedleIndex(targetStep - 1);
    setShowPopover(true);
    setIsStitching(true);

    setTimeout(() => {
      setProgress(targetStep);
      setCurrentStep(restorationSteps[targetStep - 1]);
    }, 520);

    setTimeout(() => {
      setIsStitching(false);
    }, 1200);
  };

  return (
    <div className="pankou-embroidery-game">
      <div className="pankou-embroidery-header">
        <span>Embroidery Restoration</span>
        <strong>{progress} / 5 stitched</strong>
      </div>

      <div className="pankou-embroidery-main">
        <div className="pankou-embroidery-stage">
          <div
            className={`embroidery-hoop${
              progress >= 5 ? ' restoration-complete' : ''
            }${showIdleAttraction ? ' embroidery-hoop--idle' : ''}`}
            onClick={handleHoopClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleHoopClick();
              }
            }}
          >
            <div className="fabric-surface">
              <EmbroideryHoopImageStage
                activeRevealStep={activeRevealStep}
                pankouState={pankouState}
                magnifierEnabled={progress >= 5 && pankouState.visible}
                src={PANKOU_IMAGE}
                alt={
                  progress >= 5
                    ? 'Fully restored Pankou image'
                    : 'Pankou restoration in progress'
                }
              />
              {showIdleAttraction && <EmbroideryIdleFireworkLayer />}
            </div>
            <div
              className={`stitch-glow ${isStitching ? 'active' : ''}`}
              style={{
                left: activeNeedlePosition.left,
                top: activeNeedlePosition.top,
              }}
              aria-hidden="true"
            />
            <div className={`needle-thread-layer ${isStitching ? 'active' : ''}`} aria-hidden="true">
              <div
                className="needle-path"
                style={{
                  left: activeNeedlePosition.left,
                  top: activeNeedlePosition.top,
                }}
              >
                <div className="embroidery-needle">
                  <span className="needle-thread-trail" />
                  <span className="needle-thread-back" />
                  <span className="needle-tip" />
                  <span className="needle-body" />
                  <span className="needle-eye" />
                  <span className="needle-thread-through" />
                  <span className="needle-thread-front" />
                </div>
              </div>
            </div>
          </div>

          <p className="embroidery-click-hint">
            {!showPopover
              ? 'Click the Pankou to begin restoration.'
              : progress < 5
                ? 'Click the Pankou to stitch the next restoration layer.'
                : 'Click the Pankou again to replay the restoration.'}
          </p>

          <div className={`stitch-progress-dots${isStitching ? ' is-stitching' : ''}`}>
            {restorationSteps.map((step) => (
              <span
                key={step.id}
                role="button"
                tabIndex={isStitching ? -1 : 0}
                className={`stitch-progress-dot ${progress >= step.id ? 'filled' : ''}`}
                onClick={() => navigateToStep(step.id)}
                onKeyDown={(event) => {
                  if (isStitching) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigateToStep(step.id);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {showPopover && currentStep && (
          <aside
            className={`restoration-popover${
              currentStep.id === 2 ? ' restoration-popover--step02' : ''
            }`}
            role="status"
            aria-live="polite"
          >
            {progress >= 5 ? (
              <>
                <span>Restoration Complete</span>
                <h3>Pankou Rendering Complete</h3>
                <RestorationStagePreview
                  src={restorationStageImages.rendering}
                  alt="Final rendered Pankou restoration"
                  variant="rendering"
                />
                <p>
                  The restored Pankou is refined through color application and detail enhancement, adding visual depth and completing the digital restoration process.
                </p>
              </>
            ) : currentStep.id === 1 ? (
              <>
                <span>Step 01 / 5</span>
                <h3>Before Restoration</h3>
                <div className="restoration-popover-image">
                  <OptimizedImage
                    src={restorationEvidenceImages.before}
                    alt="Before restoration archival Pankou source"
                    loading="lazy"
                  />
                </div>
                <p>
                  Shows the original archival Pankou source image before digital restoration.
                </p>
                <p className="restoration-popover-source">
                  Image source: Cover of <em>Liangyou Pictorial</em>, Issue 147, 1939.
                </p>
              </>
            ) : currentStep.id === 2 ? (
              <div className="restoration-popover-step02">
                <div className="restoration-evidence">
                  <span className="restoration-evidence-heading">Restoration Evidence</span>
                  <div className="restoration-evidence-preview">
                    <div className="restoration-evidence-image-wrap">
                      <OptimizedImage
                        className="restoration-evidence-image"
                        src={restorationEvidenceImages.repair}
                        alt="Stable Diffusion restored Pankou image"
                        loading="lazy"
                      />
                    </div>
                    <p className="restoration-evidence-label">Before → Enhanced Preview</p>
                    <p className="restoration-evidence-caption">
                      Enhanced archival detail after super-resolution repair.
                    </p>
                  </div>
                </div>

                <div className="restoration-parameters parameter-card">
                  <span className="restoration-parameters-heading">Restoration Parameters</span>
                  {sdRestorationParams.map((param) => (
                    <div key={param.label} className="parameter-row">
                      <span className="parameter-label">{param.label}</span>
                      <span className="parameter-value">{param.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <span>Step {String(currentStep.id).padStart(2, '0')} / 5</span>
                <h3>{currentStep.title}</h3>
                {currentStep.id === 3 && (
                  <RestorationStagePreview
                    src={restorationStageImages.lineSketch}
                    alt="Pankou style line sketch"
                    variant="line-sketch"
                  />
                )}
                {currentStep.id === 4 && (
                  <RestorationStagePreview
                    src={restorationStageImages.model}
                    alt="Pankou 3D model reconstruction"
                    variant="model"
                  />
                )}
                {currentStep.id === 5 && (
                  <RestorationStagePreview
                    src={restorationStageImages.rendering}
                    alt="Pankou rendering preview"
                    variant="rendering"
                  />
                )}
                <p>{currentStep.description}</p>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

const restorationProcessSteps = [
  {
    id: 'historical',
    label: 'Historical Image',
    caption: 'Archival source',
    image: restorationEvidenceImages.before,
    scrollTarget: 'structural-reconstruction',
  },
  {
    id: 'restored',
    label: 'Restored Image',
    caption: 'Visual recovery',
    image: restorationEvidenceImages.repair,
    scrollTarget: 'structural-reconstruction',
  },
  {
    id: 'sketch',
    label: 'Line Sketch',
    caption: 'Structural outline',
    image: restorationStageImages.lineSketch,
    scrollTarget: 'structural-reconstruction',
  },
  {
    id: 'model',
    label: '3D Model',
    caption: 'Digital reconstruction',
    image: restorationStageImages.model,
    scrollTarget: 'structural-reconstruction',
  },
  {
    id: 'display',
    label: 'Interactive Display',
    caption: 'Public dissemination',
    image: restorationStageImages.rendering,
    scrollTarget: 'virtual-museum-exhibition',
  },
] as const;

type RestorationProcessStepId = (typeof restorationProcessSteps)[number]['id'];

function RestorationProcessOverview() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedStageId, setSelectedStageId] = useState<RestorationProcessStepId | null>(null);

  const handleStageClick = (step: (typeof restorationProcessSteps)[number]) => {
    setSelectedStageId(step.id);

    const target = document.getElementById(step.scrollTarget);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`restoration-process-overview${isExpanded ? ' is-expanded' : ''}`}>
      <button
        type="button"
        className="restoration-process-overview__header"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className="restoration-process-overview__header-text">
          <strong>Restoration Process Overview</strong>
          <span>
            Five stages from archival source to interactive display — expand to view the full
            restoration pipeline.
          </span>
        </span>
        <span className="restoration-process-overview__toggle" aria-hidden="true">
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      <div className="restoration-process-overview__panel">
        <div className="restoration-process-overview__panel-inner">
          <div className="pankou-reconstruction-timeline" aria-label="Restoration process timeline">
            <div className="pankou-reconstruction-timeline__track" aria-hidden="true" />
            <ol className="pankou-reconstruction-timeline__steps">
              {restorationProcessSteps.map((step, index) => (
                <li key={step.id} className="pankou-reconstruction-timeline__step">
                  <button
                    type="button"
                    className={`pankou-reconstruction-timeline__step-button${
                      selectedStageId === step.id ? ' is-selected' : ''
                    }`}
                    onClick={() => handleStageClick(step)}
                  >
                    <div className="pankou-reconstruction-timeline__node">
                      <span className="pankou-reconstruction-timeline__index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <figure className="pankou-reconstruction-timeline__frame">
                      <OptimizedImage src={step.image} alt={step.label} loading="lazy" />
                    </figure>
                    <div className="pankou-reconstruction-timeline__labels">
                      <strong>{step.label}</strong>
                      <span>{step.caption}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RestorationVisualEvidenceSection() {
  return (
    <section className="project-detail-section project2-visual-evidence-section">
      <div className="section-kicker">Historical Archive</div>
      <p className="project-section-description">
        Republican-era pictorial sources anchor the restoration pipeline. This interactive embroidery
        experience presents archival Pankou imagery as a layered handcraft recovery process — each
        stitching action advances visual reconstruction toward digital heritage preservation.
      </p>

      <PankouRestorationGame />

      <RestorationProcessOverview />
    </section>
  );
}
