import { Fragment, useState } from 'react';
import type { ProjectDetail } from '../data/projects';
import { PankouGeneExplorer } from './PankouGeneExplorer';
import '../styles/project-pankou-gene-lora.css';

const MILESTONES = [
  {
    title: 'Cultural Gene Profile',
    href: '#cultural-gene-profile',
  },
  {
    title: 'LoRA Training Simulation',
    href: '#lora-training',
  },
  { title: 'AI-Assisted Design Output', href: '#ai-design-output' },
] as const;

const LORA_DATASET_ROWS = [
  {
    sample: 'S01 Ruyi Knot',
    caption:
      'ruyi knot · panhua knot · soft flower knot · cotton-linen · golden yellow · soft tone · emotional projection · continuous loop skeleton',
  },
  {
    sample: 'S02 Floral Knot',
    caption:
      'floral knot · panhua knot · hard flower knot · brocade · pale sage grey · cool tone · aesthetic orientation · continuous loop skeleton',
  },
  {
    sample: 'S03 Butterfly Knot',
    caption:
      'butterfly knot · panhua knot · hard flower knot · silk · dark walnut brown · neutral tone · gender identity · bilateral symmetric skeleton',
  },
  {
    sample: 'S04 Yizi Knot',
    caption:
      'yizi knot · soft flower knot · brocade · blush pink · soft tone · ritual order · linear-axis skeleton',
  },
] as const;

const LORA_TRAINING_CONFIG = [
  { label: 'Model', value: 'realisticVisionV60' },
  { label: 'Repeat', value: '50' },
  { label: 'Epochs', value: '12' },
  { label: 'Batch Size', value: '2' },
  { label: 'UNet LR', value: '1e-4' },
  { label: 'Text Encoder LR', value: '1e-5' },
  { label: 'Optimizer', value: 'AdamW8' },
  { label: 'Network Dim', value: '128' },
  { label: 'Network Alpha', value: '64' },
] as const;

const LORA_CHECKPOINTS = [
  'pankou02',
  'pankou04',
  'pankou06',
  'pankou08',
  'pankou10',
  'pankou12',
] as const;

const LORA_GENERATION_PROMPT =
  'butterfly pankou jewelry, traditional Chinese pankou knot, butterfly-shaped ornamental fastening, symmetrical wing structure, central knot body, pink enamel-like surface, delicate jewelry design, handcrafted decorative structure, soft highlights, clean background, high detail';

const LORA_NEGATIVE_PROMPT =
  'deformed wings, broken symmetry, extra body parts, blurry structure, low quality, messy background, distorted knot, incomplete ornament, incorrect fastening structure, asymmetrical central knot, disconnected loops, plastic texture, flat lighting';

const LORA_RESULT_MATRIX = '/images/lora6.png';

const AI_GENERATION_PROMPT =
  'pink silk floral jewelry, handcrafted fabric flower accessory, soft satin petals, layered silk folds, delicate textile texture, subtle gold accents, pearl embellishment, elegant feminine design';

const AI_NEGATIVE_PROMPT =
  'low quality, blurry, distorted structure, deformed petals, messy composition, broken symmetry, extra elements, harsh lighting, dull texture, unrealistic material, cluttered background';

const AI_OUTPUTS = [
  {
    id: 'd1',
    label: 'Output 01',
    title: 'Generated Design 01',
    image: '/images/d1.png',
  },
  {
    id: 'd2',
    label: 'Output 02',
    title: 'Generated Design 02',
    image: '/images/d2.png',
  },
  {
    id: 'd3',
    label: 'Output 03',
    title: 'Generated Design 03',
    image: '/images/d3.png',
  },
  {
    id: 'd4',
    label: 'Output 04',
    title: 'Generated Design 04',
    image: '/images/d4.png',
  },
] as const;

const AI_GENERATOR_SETTINGS = [
  { label: 'Model', value: 'realisticVisionV60' },
  { label: 'Checkpoint', value: 'pankou02' },
  { label: 'LoRA Weight', value: '1.0' },
] as const;

function ProjectHeroImage({
  src,
  alt,
  caption,
  fallbackLabel,
}: {
  src?: string;
  alt: string;
  caption: string;
  fallbackLabel: string;
}) {
  return (
    <figure className="project-hero-cover">
      <div className="project-hero-image">
        {src ? (
          <img src={src} alt={alt} loading="eager" />
        ) : (
          <span className="project-hero-image-placeholder">{fallbackLabel}</span>
        )}
      </div>
      <figcaption className="project-hero-caption">{caption}</figcaption>
    </figure>
  );
}

function AiGeneratorWorkspace() {
  const [currentOutputIndex, setCurrentOutputIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const currentOutput = AI_OUTPUTS[currentOutputIndex];

  const handleGenerateNext = () => {
    setImageFailed(false);
    setCurrentOutputIndex((prev) => (prev + 1) % AI_OUTPUTS.length);
  };

  return (
    <div className="ai-generator-unified-card">
      <div className="ai-preview-side">
        <div className="ai-preview-header">
          <span>Generated Preview</span>
          <strong>{currentOutput.label} / 04</strong>
        </div>

        <div className="ai-preview-frame">
          {imageFailed ? (
            <div className="ai-output-placeholder">Output image pending</div>
          ) : (
            <img
              key={currentOutput.id}
              src={currentOutput.image}
              alt={currentOutput.title}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
      </div>

      <div className="ai-control-side">
        <div className="ai-control-label">AI GENERATOR</div>

        <div className="ai-control-block ai-control-scroll-block">
          <span>Prompt</span>
          <div className="ai-control-scroll-area">
            <p id="ai-generator-prompt">{AI_GENERATION_PROMPT}</p>
          </div>
        </div>

        <div className="ai-control-block ai-control-scroll-block ai-control-block--negative">
          <span>Negative Prompt</span>
          <div className="ai-control-scroll-area">
            <p id="ai-generator-negative-prompt">{AI_NEGATIVE_PROMPT}</p>
          </div>
        </div>

        <div className="ai-control-chip-row">
          {AI_GENERATOR_SETTINGS.map((setting) => (
            <div key={setting.label}>
              <span>{setting.label}</span>
              <strong>{setting.value}</strong>
            </div>
          ))}
        </div>

        <button type="button" className="ai-generate-button" onClick={handleGenerateNext}>
          Generate Next
        </button>
      </div>
    </div>
  );
}

interface PankouGeneLoraDetailViewProps {
  project: ProjectDetail;
  onBack: () => void;
}

export function PankouGeneLoraDetailView({ project, onBack }: PankouGeneLoraDetailViewProps) {
  return (
    <article
      id="projects"
      className="project-detail-page project-detail-page--horizontal-hero scroll-mt-20"
    >
      <main className="project-pankou-gene-lora" data-project-layout="rebuilt-project-1">
        <a
          href="/projects"
          className="project-back-link"
          onClick={(event) => {
            event.preventDefault();
            onBack();
          }}
        >
          ← All Projects
        </a>

        <header className="project-hero project-hero--horizontal">
          <div className="project-hero-text">
            <p className="project-overview-number">{project.number}</p>
            <h1 className="project-hero-title">{project.title}</h1>
            <p className="project-hero-subtitle">{project.subtitle}</p>
            <p className="project-hero-meta">
              {project.time}
              <span className="research-experience-meta-sep" aria-hidden="true">
                ·
              </span>
              {project.institution}
            </p>
            <div className="project1-hero-panel">
              <div className="project1-hero-keywords">
                <h2 className="project1-hero-mini-heading">Keywords</h2>
                <div className="project-keyword-list project1-hero-keyword-list">
                  {project.keywords.map((keyword) => (
                    <span key={keyword} className="project-keyword">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="project1-hero-scale">
                <h2 className="project1-hero-mini-heading">Research Scale</h2>
                <dl className="project1-hero-scale-list">
                  <div className="project1-hero-scale-item">
                    <dt className="project1-hero-scale-value">200+</dt>
                    <dd>Historical images analyzed</dd>
                  </div>
                  <div className="project1-hero-scale-item">
                    <dt className="project1-hero-scale-value">50+</dt>
                    <dd>Digital models reconstructed</dd>
                  </div>
                  <div className="project1-hero-scale-item">
                    <dt className="project1-hero-scale-value">7D</dt>
                    <dd>Cultural gene labeling framework developed</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <ProjectHeroImage
            src={project.cover.src}
            alt={project.cover.caption}
            caption={project.cover.caption}
            fallbackLabel={project.cover.slotLabel}
          />
        </header>

        <section className="project-detail-section project-detail-section--lead">
          <div className="project-section-label project-section-kicker">Overview</div>
          <p className="project-detail-overview">{project.overview}</p>
        </section>

        <section className="project-detail-section project-section project-key-milestones">
          <div className="project-section-label project-section-kicker">Project Key Milestones</div>
          <nav className="project-pathway-row" aria-label="Project key milestones">
            {MILESTONES.map((item, index) => (
              <Fragment key={item.href}>
                {index > 0 ? (
                  <span className="project-path-arrow" aria-hidden="true">
                    →
                  </span>
                ) : null}
                <a href={item.href} className="project-path-step">
                  {item.title}
                </a>
              </Fragment>
            ))}
          </nav>
        </section>

        <section
          id="cultural-gene-profile"
          className="project-detail-section project-section cultural-gene-profile-section"
        >
          <div className="project-section-label project-section-kicker">Cultural Gene Profile</div>
          <p className="cultural-gene-intro-text project-detail-overview">
            Republican-era Haipai Pankou can be classified by motif and formal structure into four
            representative types: Ruyi Knot, Floral Knot, Butterfly Knot, and Yizi Knot. The
            following display presents the cultural gene profiles of these major Pankou types through
            form, craft, material, colour, composition, motif semantics, and structural skeleton.
          </p>
          <PankouGeneExplorer />
          <p className="gene-interaction-hint">
            Select a sample, then click a gene dimension to view its cultural profile.
          </p>
        </section>

        <section
          id="lora-training"
          className="project-detail-section project-section lora-training-simulation-section"
        >
          <div className="project-section-label project-section-kicker">LoRA Training Simulation</div>
          <p className="lora-training-intro-text project-detail-overview">
            This section applies the seven-dimensional Pankou label system to LoRA training as a way
            to translate traditional craft knowledge into a contemporary generative design workflow.
            Rather than treating AI as the final goal, the experiment uses it as a tool to support
            the protection, communication, and creative transformation of Pankou craft in modern
            design practice.
          </p>

          <div className="lora-workflow-dashboard compact">
            <details className="lora-compact-details">
              <summary className="lora-compact-summary">
                <span className="lora-compact-index">01</span>

                <span className="lora-compact-main">
                  <span className="lora-compact-label">CAPTION DATASET</span>
                  <span className="lora-compact-desc">
                    4 captioned samples · seven-dimensional labels
                  </span>
                </span>

                <span className="lora-expand-arrow" aria-hidden="true">
                  →
                </span>
              </summary>

              <div className="lora-compact-content">
                <div className="lora-caption-list compact">
                  {LORA_DATASET_ROWS.map((row) => (
                    <div key={row.sample} className="lora-caption-row">
                      <strong>{row.sample}</strong>
                      <p>{row.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            <details className="lora-compact-details">
              <summary className="lora-compact-summary">
                <span className="lora-compact-index">02</span>

                <span className="lora-compact-main">
                  <span className="lora-compact-label">TRAINING SETUP</span>
                  <span className="lora-compact-desc">
                    realisticVisionV60 · 12 epochs · AdamW8 · rank 128
                  </span>
                </span>

                <span className="lora-expand-arrow" aria-hidden="true">
                  →
                </span>
              </summary>

              <div className="lora-compact-content">
                <div className="lora-config-grid compact">
                  {LORA_TRAINING_CONFIG.map((item) => (
                    <div key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            <details className="lora-compact-details" open>
              <summary className="lora-compact-summary">
                <span className="lora-compact-index">03</span>

                <span className="lora-compact-main">
                  <span className="lora-compact-label">GENERATION PROMPT</span>
                  <span className="lora-compact-desc">
                    Butterfly Pankou prompt · checkpoint and weight testing
                  </span>
                </span>

                <span className="lora-expand-arrow" aria-hidden="true">
                  →
                </span>
              </summary>

              <div className="lora-compact-content">
                <div className="prompt-block">
                  <span>Prompt</span>
                  <pre>{LORA_GENERATION_PROMPT}</pre>
                </div>

                <div className="prompt-block">
                  <span>Negative Prompt</span>
                  <pre>{LORA_NEGATIVE_PROMPT}</pre>
                </div>

                <div className="prompt-test-settings compact">
                  <div>
                    <span>LoRA Checkpoints</span>
                    <strong>{LORA_CHECKPOINTS.join(', ')}</strong>
                  </div>
                  <div>
                    <span>LoRA Weights</span>
                    <strong>0.2, 0.4, 0.6, 0.8, 1.0</strong>
                  </div>
                </div>

                <span className="lora-matrix-label">Prompt Test Result Matrix</span>
                <figure className="lora-result-matrix-figure">
                  <img
                    src={LORA_RESULT_MATRIX}
                    alt="LoRA generated butterfly Pankou result matrix"
                    loading="lazy"
                  />
                  <figcaption>
                    Generated output matrix comparing selected LoRA checkpoints under five weight
                    values. Columns represent checkpoint versions, while rows represent LoRA weights
                    from 0.2 to 1.0. Based on the comparison, pankou02 with a LoRA weight of 1.0
                    was selected for the final generation stage.
                  </figcaption>
                </figure>
              </div>
            </details>
          </div>
        </section>

        <section
          id="ai-design-output"
          className="project-detail-section project-section ai-assisted-output-section ai-generator-section"
        >
          <div className="project-section-label project-section-kicker">AI-Assisted Design Output</div>
          <p className="ai-output-intro-text project-detail-overview">
            This section presents four AI-assisted Pankou design outputs generated under the same
            structured prompt and selected LoRA setting. The aim is to explore how cultural gene
            labels can support the transformation of traditional Pankou craft into contemporary
            jewelry design while maintaining cultural recognisability, structural coherence, and
            craft-inspired visual qualities.
          </p>

          <AiGeneratorWorkspace />
        </section>

        <div className="project-detail-meta-grid">
          <section className="project-detail-section project-detail-section--compact">
            <h2 className="project-detail-heading">My Role</h2>
            <ul className="project-role-tags">
              {project.roleTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </section>

          <section className="project-detail-section project-detail-section--compact">
            <h2 className="project-detail-heading">Outputs</h2>
            <ul className="project-output-list">
              {project.outputs.map((output) => (
                <li key={output}>{output}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </article>
  );
}
