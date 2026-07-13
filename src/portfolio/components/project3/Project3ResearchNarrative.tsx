import { Fragment, useState, type ReactNode } from 'react';
import {
  AIGC_SECTION,
  ARTIFACT_SELECTION,
  EMOTIONAL_RESPONSE_EVALUATION,
  HEALING_VALIDATION,
  JEWELRY_CONCEPTS,
  KEYWORD_DIMENSIONS,
  PEIRCE_SEMIOTICS,
  RESEARCH_MOTIVATION,
  SYMBOL_EMOTION_MAPPINGS,
  VALIDATION_CONCEPTS,
} from '../../data/project3Content';
import { ProjectSectionIntro } from '../ProjectSectionIntro';
import styles from './Project3ResearchNarrative.module.css';

function FlowArrow() {
  return (
    <span className={styles.flowArrow} aria-hidden="true">
      ↓
    </span>
  );
}

function NarrativeBlock({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.block} aria-labelledby={`${id}-kicker`}>
      <div id={`${id}-kicker`} className={styles.kicker}>
        <span className={styles.kickerNumber}>{number}</span>
        {title}
      </div>
      {children}
    </section>
  );
}

function formatKeywordLines(keywords: readonly string[]): string[] {
  const lines: string[] = [];

  for (let index = 0; index < keywords.length; index += 2) {
    lines.push(keywords.slice(index, index + 2).join(' · '));
  }

  return lines;
}

function ConceptGalleryImage({
  src,
  alt,
  blendFrame = false,
}: {
  src: string;
  alt: string;
  blendFrame?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    <figure className={styles.conceptImage}>
      {/* concept-01 (a1) carries an embedded beige backdrop; a transparent PNG would remove the need for frame matching */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={blendFrame ? styles.conceptImageBlend : undefined}
        onError={() => {
          console.error(`Missing image at path: ${src}`);
          setFailed(true);
        }}
      />
    </figure>
  );
}

function ValidationConceptCard({
  concept,
}: {
  concept: (typeof VALIDATION_CONCEPTS)[number];
}) {
  const fields = [
    { label: 'Emotional Theme', value: concept.emotionalTheme },
    { label: 'Cultural Translation', value: concept.culturalTranslation },
    { label: 'Design Strategy', value: concept.designStrategy },
    { label: 'Emotional Response', value: concept.emotionalResponse },
  ] as const;

  return (
    <article className={styles.validationCard}>
      <figure className={styles.validationFigure}>
        <div
          className={styles.validationImageFrame}
          style={{ backgroundColor: concept.frameBackground }}
        >
          <ConceptGalleryImage
            src={concept.image}
            alt={`${concept.name} — emotion-oriented jewelry validation concept`}
            blendFrame={concept.blendFrame}
          />
        </div>
        <figcaption className={styles.validationCaption}>
          <span className={styles.validationConceptIndex}>{concept.label}</span>
          <span className={styles.validationConceptName}>{concept.name}</span>
        </figcaption>
      </figure>
      <dl className={styles.validationFields}>
        {fields.map((field) => (
          <div key={field.label} className={styles.validationField}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function AigcJewelryWorkflow() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeConcept = JEWELRY_CONCEPTS[activeIndex];
  const conceptCounter = `Concept ${String(activeIndex + 1).padStart(2, '0')} / ${String(JEWELRY_CONCEPTS.length).padStart(2, '0')}`;

  const handlePrevious = () => {
    setActiveIndex((index) =>
      index === 0 ? JEWELRY_CONCEPTS.length - 1 : index - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((index) =>
      index === JEWELRY_CONCEPTS.length - 1 ? 0 : index + 1,
    );
  };

  return (
    <div className={styles.aigcBoard} aria-label="AIGC prompt record and generated concept preview">
      <aside className={styles.aigcPromptPanel} aria-label="Prompt record">
        <p className={styles.aigcPanelHeading}>{AIGC_SECTION.panelHeading}</p>
        <div className={styles.aigcPromptStack}>
          {AIGC_SECTION.promptSections.map((section) => (
            <div key={section.label} className={styles.aigcPromptBlock}>
              <p className={styles.aigcPromptLabel}>{section.label}</p>
              <p className={styles.aigcPromptValue}>{section.value}</p>
            </div>
          ))}
          <div className={styles.aigcPromptBlock}>
            <p className={styles.aigcPromptLabel}>{AIGC_SECTION.aiModelLabel}</p>
            <p className={styles.aigcPromptValue}>{AIGC_SECTION.aiModel}</p>
          </div>
        </div>
        <div className={styles.aigcStructuredPrompt}>
          <p className={styles.aigcPromptLabel}>{AIGC_SECTION.structuredPromptHeading}</p>
          <div className={styles.aigcStructuredPromptBox}>{AIGC_SECTION.structuredPrompt}</div>
        </div>
      </aside>

      <span className={styles.aigcFlowConnector} aria-hidden="true">
        →
      </span>

      <section
        className={styles.aigcPreviewPanel}
        aria-label="Generated concept preview"
        aria-live="polite"
      >
        <p className={styles.aigcPreviewHeading}>{AIGC_SECTION.previewHeading}</p>

        <div
          className={styles.aigcPreviewFrame}
          style={{ backgroundColor: activeConcept.frameBackground }}
        >
          <ConceptGalleryImage
            key={activeConcept.image}
            src={activeConcept.image}
            alt={`${activeConcept.name} — AIGC jewelry concept`}
            blendFrame={activeConcept.id === 'concept-01'}
          />
        </div>

        <div className={styles.aigcConceptMeta}>
          <p className={styles.conceptName}>{activeConcept.name}</p>
        </div>

        <nav className={styles.aigcConceptNav} aria-label="Concept navigation">
          <button
            type="button"
            className={styles.aigcConceptNavButton}
            onClick={handlePrevious}
          >
            ← Previous
          </button>
          <p className={styles.aigcConceptCounter}>{conceptCounter}</p>
          <button type="button" className={styles.aigcConceptNavButton} onClick={handleNext}>
            Next →
          </button>
        </nav>
      </section>
    </div>
  );
}

export function Project3ResearchNarrative() {
  return (
    <div className={styles.narrative} aria-label="Project 3 research narrative">
      <NarrativeBlock id="research-motivation" number="01" title="Research Motivation">
        <div className={styles.motivationFramework} aria-label="Research motivation framework">
          {RESEARCH_MOTIVATION.map((stage, index) => (
            <Fragment key={stage.label}>
              {index > 0 ? (
                <span className={styles.motivationArrow} aria-hidden="true">
                  →
                </span>
              ) : null}
              <article className={styles.motivationStage}>
                <p className={styles.motivationLabel}>
                  <span className={styles.motivationStageNumber}>{stage.stage}</span>
                  {stage.label}
                </p>
                <p className={styles.motivationText}>{stage.text}</p>
              </article>
            </Fragment>
          ))}
        </div>
      </NarrativeBlock>

      <FlowArrow />

      <NarrativeBlock id="peircean-semiotics" number="02" title="Application of Peircean Semiotics">
        <ProjectSectionIntro>{PEIRCE_SEMIOTICS.intro}</ProjectSectionIntro>
        <div className={styles.peirceanBridge} aria-label="Peircean semiotic transformation pathway">
          {PEIRCE_SEMIOTICS.flow.map((step, index) => (
            <Fragment key={step.term}>
              {index > 0 ? (
                <span className={styles.peirceanArrow} aria-hidden="true">
                  →
                </span>
              ) : null}
              <div className={styles.peirceanStep}>
                <p className={styles.peirceanTerm}>{step.term}</p>
                <p className={styles.peirceanLabel}>{step.label}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </NarrativeBlock>

      <FlowArrow />

      <NarrativeBlock id="artifact-selection" number="03" title="Artifact Symbol Extraction">
        <ProjectSectionIntro>{ARTIFACT_SELECTION.intro}</ProjectSectionIntro>
        <div className={styles.artifactLayout}>
          <figure className={styles.artifactIdentityCard}>
            <div className={styles.artifactImageSlot}>
              <img
                src={ARTIFACT_SELECTION.image}
                alt={ARTIFACT_SELECTION.imageAlt}
                loading="lazy"
                decoding="async"
                width={400}
                height={598}
                className={styles.artifactImage}
              />
            </div>
            <figcaption className={styles.artifactCaption}>
              <p className={styles.artifactName}>{ARTIFACT_SELECTION.name}</p>
              <p className={styles.artifactMeta}>{ARTIFACT_SELECTION.period}</p>
              <p className={styles.artifactMeta}>{ARTIFACT_SELECTION.material}</p>
            </figcaption>
          </figure>

          <div className={styles.translationFlow} aria-label="Peircean symbolic translation flow">
            <div className={styles.translationFlowLegend} aria-hidden="true">
              {ARTIFACT_SELECTION.flowStages.map((stage, index) => (
                <Fragment key={stage.term}>
                  {index > 0 ? (
                    <span className={styles.translationFlowArrow}>→</span>
                  ) : null}
                  <div className={styles.translationFlowStage}>
                    <p className={styles.translationFlowTerm}>{stage.term}</p>
                    <p className={styles.translationFlowLabel}>{stage.label}</p>
                  </div>
                </Fragment>
              ))}
            </div>

            {ARTIFACT_SELECTION.analysisCards.map((card) => (
              <article key={card.id} className={styles.translationEntry}>
                <p className={styles.translationEntryTitle}>
                  {card.number} {card.title}
                </p>
                <div className={styles.translationRow}>
                  <div className={styles.translationCell}>
                    <p className={styles.translationLabel}>Sign</p>
                    <p className={styles.translationText}>{card.sign}</p>
                  </div>
                  <span className={styles.translationRowArrow} aria-hidden="true">
                    →
                  </span>
                  <div className={styles.translationCell}>
                    <p className={styles.translationLabel}>Object</p>
                    <p className={styles.translationText}>{card.object}</p>
                  </div>
                  <span className={styles.translationRowArrow} aria-hidden="true">
                    →
                  </span>
                  <div className={styles.translationCell}>
                    <p className={styles.translationLabel}>Interpretant</p>
                    <p className={styles.translationText}>{card.interpretant}</p>
                  </div>
                  <span className={styles.translationRowArrow} aria-hidden="true">
                    →
                  </span>
                  <div className={styles.translationCell}>
                    <p className={styles.translationLabel}>Design Translation</p>
                    <p className={styles.translationText}>{card.designTranslation}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </NarrativeBlock>

      <FlowArrow />

      <NarrativeBlock id="emotion-keyword-framework" number="04" title="Emotion Keyword Framework">
        <ProjectSectionIntro>
          Extracted symbols are structured into emotional keywords that guide jewelry design
          direction.
        </ProjectSectionIntro>
        <div className={styles.mappingGrid} aria-label="Symbol to emotion mapping">
          {SYMBOL_EMOTION_MAPPINGS.map((item) => (
            <article key={item.id} className={styles.mappingItem}>
              <p className={styles.mappingValue}>{item.visual}</p>
              <FlowArrow />
              <p className={styles.mappingValue}>{item.cultural}</p>
              <FlowArrow />
              <p className={styles.mappingValue}>{item.emotional}</p>
            </article>
          ))}
        </div>
        <div className={styles.keywordGrid} aria-label="Emotion keyword dimensions">
          {KEYWORD_DIMENSIONS.map((dimension) => (
            <article key={dimension.number} className={styles.keywordModule}>
              <p className={styles.keywordIndex}>{dimension.number}</p>
              <h3 className={styles.keywordTitle}>{dimension.title}</h3>
              <div className={styles.keywordList}>
                {formatKeywordLines(dimension.keywords).map((line) => (
                  <p key={line} className={styles.keywordLine}>
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </NarrativeBlock>

      <FlowArrow />

      <NarrativeBlock id="aigc-jewelry-generation" number="05" title="AIGC-driven Jewelry Generation">
        <ProjectSectionIntro>{AIGC_SECTION.intro}</ProjectSectionIntro>
        <AigcJewelryWorkflow />
      </NarrativeBlock>

      <FlowArrow />

      <NarrativeBlock id="emotional-healing-validation" number="06" title="Emotional Healing Validation">
        <ProjectSectionIntro>{HEALING_VALIDATION.intro}</ProjectSectionIntro>
        <div className={styles.validationGrid} aria-label="Emotional validation framework">
          {VALIDATION_CONCEPTS.map((concept) => (
            <ValidationConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
        <section
          className={styles.validationEvaluation}
          aria-labelledby="emotional-response-evaluation-heading"
        >
          <h3 id="emotional-response-evaluation-heading" className={styles.validationEvaluationHeading}>
            {HEALING_VALIDATION.evaluationHeading}
          </h3>
          <div className={styles.validationEvaluationGrid}>
            {EMOTIONAL_RESPONSE_EVALUATION.map((item) => (
              <article key={item.id} className={styles.validationEvaluationItem}>
                <p className={styles.validationEvaluationLabel}>{item.label}</p>
                <p className={styles.validationEvaluationValue}>{item.value}</p>
              </article>
            ))}
          </div>
        </section>
      </NarrativeBlock>
    </div>
  );
}
