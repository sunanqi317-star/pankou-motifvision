import { PLAY_SPECIMENS } from '../../data/playSpecimens';
import { usePlaySession } from '../../context/PlaySessionContext';
import { craftBadge, craftButton, craftCard } from '../ui/craftStyles';
import { PankouDiagram } from './PankouDiagram';

export function ChoosePankou() {
  const { selectedSpecimen, selectSpecimen, setStep, markStepComplete } = usePlaySession();

  const handleContinue = () => {
    if (!selectedSpecimen) return;
    markStepComplete('choose');
    setStep('deconstruct');
  };

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Choose a Pankou</h2>
        <p className="mt-1 text-stone-600">
          Select one specimen. Each carries motif, skeleton type, path organization, symbolic
          meaning, and emotional tone.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLAY_SPECIMENS.map((specimen) => {
          const selected = selectedSpecimen?.id === specimen.id;
          return (
            <button
              key={specimen.id}
              type="button"
              onClick={() => selectSpecimen(specimen.id)}
              className={`${craftCard} p-4 text-left transition hover:shadow-md ${
                selected ? 'ring-2 ring-amber-500 ring-offset-2' : ''
              }`}
            >
              <PankouDiagram specimen={specimen} />
              <h3 className="mt-3 font-semibold text-stone-900">{specimen.englishName}</h3>
              <p className="text-sm text-stone-500">{specimen.chineseName}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className={craftBadge}>{specimen.motif}</span>
                <span className={craftBadge}>{specimen.skeletonType}</span>
              </div>
              <p className="mt-2 text-xs text-stone-600">
                {specimen.culturalMeaning} · {specimen.emotionalTone}
              </p>
            </button>
          );
        })}
      </div>

      {selectedSpecimen && (
        <div className={`${craftCard} mt-6 p-5`}>
          <h3 className="font-semibold text-stone-900">{selectedSpecimen.englishName} — metadata</h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-stone-500">Motif</dt>
              <dd className="font-medium">{selectedSpecimen.motif}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Skeleton type</dt>
              <dd className="font-medium">{selectedSpecimen.skeletonType}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Path organization</dt>
              <dd className="font-medium">{selectedSpecimen.pathOrganization}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Symbolic meaning</dt>
              <dd className="font-medium">{selectedSpecimen.symbolicMeaning}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-stone-500">Emotional tone</dt>
              <dd className="font-medium">{selectedSpecimen.emotionalTone}</dd>
            </div>
          </dl>
          <button type="button" className={`${craftButton} mt-4`} onClick={handleContinue}>
            Learn by Deconstructing →
          </button>
        </div>
      )}
    </section>
  );
}
