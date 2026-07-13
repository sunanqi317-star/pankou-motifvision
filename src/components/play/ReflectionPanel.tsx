import { usePlaySession } from '../../context/PlaySessionContext';
import { craftButton, craftButtonSecondary, craftCard, craftTextarea } from '../ui/craftStyles';

export function ReflectionPanel() {
  const {
    selectedSpecimen,
    reflection,
    setReflection,
    markStepComplete,
    resetSession,
    setStep,
  } = usePlaySession();

  const handleSubmit = () => {
    markStepComplete('reflection');
  };

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Reflection</h2>
        <p className="mt-1 text-stone-600">
          Briefly note what you learned. These responses are local placeholders for a future user
          study.
        </p>
      </header>

      <div className={`${craftCard} space-y-6 p-6`}>
        {selectedSpecimen && (
          <p className="text-sm text-stone-600">
            Session specimen: <strong>{selectedSpecimen.englishName}</strong>
          </p>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            What did you learn about Pankou structure?
          </label>
          <textarea
            className={craftTextarea}
            value={reflection.structureLearning}
            onChange={(e) => setReflection('structureLearning', e.target.value)}
            placeholder="e.g., bilateral loops mirror around a central knot..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Which structure was easiest or hardest to understand?
          </label>
          <textarea
            className={craftTextarea}
            value={reflection.easiestHardest}
            onChange={(e) => setReflection('easiestHardest', e.target.value)}
            placeholder="e.g., closure logic was hardest until I placed the node..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Did the generative reinterpretation help you connect craft knowledge with contemporary
            design?
          </label>
          <textarea
            className={craftTextarea}
            value={reflection.generativeHelp}
            onChange={(e) => setReflection('generativeHelp', e.target.value)}
            placeholder="e.g., seeing the skeleton in the prompt made the translation clearer..."
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className={craftButton} onClick={handleSubmit}>
            Save Reflection
          </button>
          <button type="button" className={craftButtonSecondary} onClick={() => setStep('reinterpret')}>
            Back to Reinterpret
          </button>
          <button type="button" className={craftButtonSecondary} onClick={resetSession}>
            Start New Journey
          </button>
        </div>
      </div>
    </section>
  );
}
