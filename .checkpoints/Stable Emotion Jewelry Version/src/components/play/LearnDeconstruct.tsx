import { usePlaySession } from '../../context/PlaySessionContext';
import { craftButton, craftCard, craftPanel } from '../ui/craftStyles';
import { PankouDiagram } from './PankouDiagram';

export function LearnDeconstruct() {
  const {
    selectedSpecimen,
    revealedParts,
    revealPart,
    setStep,
    markStepComplete,
  } = usePlaySession();

  if (!selectedSpecimen) {
    return (
      <p className="text-stone-600">
        Please choose a Pankou first.{' '}
        <button type="button" className="text-amber-700 underline" onClick={() => setStep('choose')}>
          Go back
        </button>
      </p>
    );
  }

  const allRevealed = revealedParts.size >= selectedSpecimen.deconstructRegions.length;
  const lastRevealed = selectedSpecimen.deconstructRegions.find((r) =>
    revealedParts.has(r.id),
  );

  const handleContinue = () => {
    markStepComplete('deconstruct');
    setStep('build');
  };

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Learn by Deconstructing</h2>
        <p className="mt-1 text-stone-600">
          Click regions on the {selectedSpecimen.englishName} diagram to reveal structural parts.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${craftCard} p-6`}>
          <p className="mb-4 text-center text-xs text-stone-500">
            Click highlighted zones · {revealedParts.size}/{selectedSpecimen.deconstructRegions.length}{' '}
            explored
          </p>
          <PankouDiagram
            specimen={selectedSpecimen}
            highlightedParts={revealedParts}
            interactive
            onPartClick={revealPart}
          />

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {selectedSpecimen.deconstructRegions.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => revealPart(r.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  revealedParts.has(r.id)
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-stone-100 text-stone-600 hover:bg-amber-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {lastRevealed ? (
            <div className={craftPanel}>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                {lastRevealed.label}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {lastRevealed.explanation}
              </p>
            </div>
          ) : (
            <div className={`${craftPanel} text-sm text-stone-500`}>
              Select a region to read a short explanation of that structural element.
            </div>
          )}

          <div className={`${craftCard} max-h-64 overflow-y-auto p-4`}>
            <h3 className="mb-3 text-sm font-semibold text-stone-800">Discovery log</h3>
            {revealedParts.size === 0 ? (
              <p className="text-sm text-stone-500">No parts revealed yet.</p>
            ) : (
              <ul className="space-y-3">
                {selectedSpecimen.deconstructRegions
                  .filter((r) => revealedParts.has(r.id))
                  .map((r) => (
                    <li key={r.id} className="border-b border-stone-100 pb-2 text-sm last:border-0">
                      <strong className="text-amber-900">{r.label}:</strong>{' '}
                      <span className="text-stone-600">{r.explanation}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className={craftButton}
            disabled={revealedParts.size < 3}
            onClick={handleContinue}
          >
            {allRevealed ? 'Build Your Pankou →' : 'Continue to Assembly →'}
          </button>
          {revealedParts.size < 3 && (
            <p className="text-xs text-stone-500">Reveal at least 3 parts to continue.</p>
          )}
        </div>
      </div>
    </section>
  );
}
