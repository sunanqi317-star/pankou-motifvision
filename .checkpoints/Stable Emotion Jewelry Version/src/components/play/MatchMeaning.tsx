import { useMemo, useState } from 'react';
import { CULTURAL_MEANINGS } from '../../data/playSpecimens';
import { usePlaySession } from '../../context/PlaySessionContext';
import { craftButton, craftCard, craftPanel } from '../ui/craftStyles';

export function MatchMeaning() {
  const {
    selectedSpecimen,
    matchCompleted,
    matchCorrect,
    completeMatch,
    setStep,
    markStepComplete,
  } = usePlaySession();

  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null);

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

  const shuffledMeanings = useMemo(
    () => [...CULTURAL_MEANINGS].sort(() => Math.random() - 0.5),
    [selectedSpecimen?.id],
  );

  const handleCheck = () => {
    if (!selectedMeaningId) return;
    const correct = selectedMeaningId === selectedSpecimen.correctMeaningId;
    completeMatch(correct);
    if (correct) markStepComplete('match');
  };

  const handleContinue = () => {
    markStepComplete('match');
    setStep('reinterpret');
  };

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Match Meaning</h2>
        <p className="mt-1 text-stone-600">
          Connect your chosen specimen to its cultural reading.
        </p>
      </header>

      <div className={`${craftCard} mb-6 p-6`}>
        <p className="text-sm text-stone-500">Your specimen</p>
        <h3 className="text-xl font-bold text-stone-900">{selectedSpecimen.englishName}</h3>
        <p className="text-sm text-stone-600">{selectedSpecimen.chineseName}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {shuffledMeanings.map((pair) => {
          const selected = selectedMeaningId === pair.id;
          const showResult = matchCompleted;
          const isCorrectOption = pair.id === selectedSpecimen.correctMeaningId;

          let ringClass = '';
          if (showResult && selected) {
            ringClass = matchCorrect ? 'ring-2 ring-green-500' : 'ring-2 ring-red-400';
          } else if (showResult && isCorrectOption) {
            ringClass = 'ring-2 ring-green-400';
          } else if (selected) {
            ringClass = 'ring-2 ring-amber-500';
          }

          return (
            <button
              key={pair.id}
              type="button"
              disabled={matchCompleted}
              onClick={() => setSelectedMeaningId(pair.id)}
              className={`${craftCard} p-4 text-left transition hover:shadow-md ${ringClass}`}
            >
              <p className="font-semibold text-stone-900">{pair.pankouType}</p>
              <p className="mt-1 text-sm text-stone-600">{pair.meaning}</p>
            </button>
          );
        })}
      </div>

      {!matchCompleted ? (
        <button
          type="button"
          className={`${craftButton} mt-6`}
          disabled={!selectedMeaningId}
          onClick={handleCheck}
        >
          Check Match
        </button>
      ) : (
        <div className={`${craftPanel} mt-6`}>
          {matchCorrect ? (
            <p className="text-sm text-green-800">
              Correct! <strong>{selectedSpecimen.englishName}</strong> carries the meaning "
              {selectedSpecimen.culturalMeaning}."
            </p>
          ) : (
            <p className="text-sm text-red-800">
              Not quite. The correct match is "{selectedSpecimen.culturalMeaning}." Cultural
              readings help connect structure to symbolism.
            </p>
          )}
          <button type="button" className={`${craftButton} mt-4`} onClick={handleContinue}>
            Reinterpret as Jewelry →
          </button>
        </div>
      )}
    </section>
  );
}
