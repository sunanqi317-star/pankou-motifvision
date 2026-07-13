import { useEffect, useMemo, useState } from 'react';
import { MOTIFS } from '../data/pankouData';
import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import { generateInterpretationReport } from '../utils/interpretationReport';
import { getSpecimenAffinityPathLabels } from '../utils/networkHighlight';
import { Section } from './Section';
import { btnExperienceAccent, btnExperiencePrimary } from './ui/experienceStyles';

const REPORT_SECTIONS = [
  { key: 'visualPatternSummary', title: '1. Visual Pattern Summary' },
  { key: 'similarityCluster', title: '2. Similarity Cluster' },
  { key: 'structuralClassification', title: '3. Structural Classification' },
  { key: 'structuralFeatures', title: '4. Structural Features' },
  { key: 'culturalInterpretation', title: '5. Cultural Interpretation' },
  { key: 'motifAffinityHypothesis', title: '6. Motif Affinity Hypothesis' },
  { key: 'methodologicalLimitation', title: '7. Methodological Limitation' },
  { key: 'reinterpretationPotential', title: '8. Reinterpretation Potential' },
] as const;

export function VisualAnalysisReport() {
  const { selectedSpecimen } = useSelectedSpecimen();
  const [motifOverride, setMotifOverride] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const reportSpecimen = useMemo(() => {
    if (motifOverride && motifOverride !== selectedSpecimen.motif) {
      return { ...selectedSpecimen, motif: motifOverride };
    }
    return selectedSpecimen;
  }, [selectedSpecimen, motifOverride]);

  const report = useMemo(
    () => (generated ? generateInterpretationReport(reportSpecimen) : null),
    [generated, reportSpecimen],
  );

  const affinityPath = useMemo(
    () => getSpecimenAffinityPathLabels(reportSpecimen),
    [reportSpecimen],
  );

  useEffect(() => {
    setMotifOverride(null);
    setGenerated(false);
  }, [selectedSpecimen.id]);

  const handleGenerate = () => setGenerated(true);

  const handleUseForJewelry = () => {
    document.getElementById('jewelry-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Section id="cultural-meaning" workflowStep={5}>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-stone-600">
        Read how your selected specimen connects motif pattern, structural logic, cultural meaning,
        and emotional tone before opening the AI Jewelry Studio.
      </p>

      <div className="mb-6 rounded border border-stone-200 bg-stone-50 p-4 text-xs text-stone-600">
        <p className="font-medium text-slate-700">Source specimen: {selectedSpecimen.id}</p>
        <dl className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-stone-400">Motif class</dt>
            <dd className="text-slate-800">{selectedSpecimen.motif}</dd>
          </div>
          <div>
            <dt className="text-stone-400">Similarity cluster</dt>
            <dd className="text-slate-800">{selectedSpecimen.cluster}</dd>
          </div>
          <div>
            <dt className="text-stone-400">Cultural meaning</dt>
            <dd className="text-slate-800">{selectedSpecimen.symbolicMeaning}</dd>
          </div>
          <div>
            <dt className="text-stone-400">Emotional tone</dt>
            <dd className="text-slate-800">{selectedSpecimen.emotionalTone}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <dt className="text-stone-400">Motif affinity path</dt>
            <dd className="text-slate-800">{affinityPath.join(' → ')}</dd>
          </div>
        </dl>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-medium text-stone-600">Motif Class (override)</span>
          <select
            value={motifOverride ?? selectedSpecimen.motif}
            onChange={(e) => {
              const value = e.target.value;
              setMotifOverride(value === selectedSpecimen.motif ? null : value);
              setGenerated(false);
            }}
            className="rounded border border-stone-300 bg-white px-3 py-2 text-sm text-slate-800"
          >
            {MOTIFS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          className={btnExperiencePrimary}
        >
          Read Cultural Meaning
        </button>
      </div>

      {!generated && (
        <p className="rounded border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
          Generate a cultural reading of your selected specimen before opening the AI Jewelry Studio.
        </p>
      )}

      {report && (
        <article className="rounded border border-stone-200 bg-white">
          <header className="border-b border-stone-200 bg-slate-50 px-6 py-4">
            <p className="text-xs text-stone-500">
              INTERPRETATION REPORT | {report.specimenId} | {report.motif.toUpperCase()}
            </p>
            <h3 className="mt-1 text-xl text-slate-800">
              {report.chineseName} ({report.englishName})
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-stone-600">
              This reading becomes the cultural foundation for your AI jewelry design in the next
              stage.
            </p>
            <button
              type="button"
              onClick={handleUseForJewelry}
              className={`mt-3 ${btnExperienceAccent} text-xs`}
            >
              Open AI Jewelry Studio
            </button>
          </header>

          <div className="space-y-6 p-6 text-sm leading-relaxed text-stone-700">
            {REPORT_SECTIONS.map(({ key, title }) => (
              <section
                key={key}
                className={
                  key === 'methodologicalLimitation' || key === 'reinterpretationPotential'
                    ? 'rounded border border-stone-200 bg-stone-50 p-4'
                    : undefined
                }
              >
                <h4 className="mb-2 text-base font-semibold text-slate-800">{title}</h4>
                {key === 'structuralFeatures' ? (
                  <ul className="list-inside list-disc space-y-1">
                    {report.structuralFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={key === 'methodologicalLimitation' ? 'italic text-stone-600' : ''}>
                    {report[key]}
                  </p>
                )}
              </section>
            ))}
          </div>
        </article>
      )}
    </Section>
  );
}
