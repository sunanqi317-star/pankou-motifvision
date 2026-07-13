import type { ReactNode } from 'react';

export type AppMode = 'play' | 'research';

interface AppShellProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  children: ReactNode;
}

export function AppShell({ mode, onModeChange, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-stone-50 to-white text-stone-800">
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-lg font-bold text-white shadow-sm"
              aria-hidden
            >
              扣
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-stone-900">
                PankouCraft Play
              </h1>
              <p className="text-xs text-stone-500">HCI craft-learning prototype</p>
            </div>
          </div>

          <nav className="flex rounded-full border border-stone-200 bg-stone-100/80 p-1" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'play'}
              onClick={() => onModeChange('play')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                mode === 'play'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Play Mode
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'research'}
              onClick={() => onModeChange('research')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                mode === 'research'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Research Mode
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>

      <footer className="border-t border-stone-200/60 bg-white/50 py-6 text-center text-xs text-stone-500">
        PankouCraft Play — intangible heritage learning through interaction, not a commercial generator.
      </footer>
    </div>
  );
}
