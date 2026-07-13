import { PLAY_STEPS } from '../../data/playSpecimens';
import type { PlayStep } from '../../types/play';
import { usePlaySession } from '../../context/PlaySessionContext';

const VISIBLE_STEPS = PLAY_STEPS.filter((s) => s.id !== 'start');

interface PlayProgressProps {
  current: PlayStep;
}

export function PlayProgress({ current }: PlayProgressProps) {
  const { completedSteps, setStep } = usePlaySession();
  const currentIdx = VISIBLE_STEPS.findIndex((s) => s.id === current);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {VISIBLE_STEPS.map((step, idx) => {
          const done = completedSteps.has(step.id);
          const active = step.id === current;
          const reachable = idx <= currentIdx || done;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!reachable && step.id !== 'choose'}
              onClick={() => reachable && setStep(step.id)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 transition ${
                reachable ? 'cursor-pointer' : 'cursor-default opacity-50'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  active
                    ? 'bg-amber-700 text-white ring-4 ring-amber-200'
                    : done
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-stone-200 text-stone-600'
                }`}
              >
                {done && !active ? '✓' : step.short}
              </span>
              <span
                className={`hidden text-[10px] font-medium sm:block ${
                  active ? 'text-amber-800' : 'text-stone-500'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-amber-600 transition-all duration-500"
          style={{
            width: `${Math.max(0, ((currentIdx + 1) / VISIBLE_STEPS.length) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
