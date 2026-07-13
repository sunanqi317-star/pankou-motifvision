import { useState, type ReactNode } from 'react';
import { experienceCard } from './ui/experienceStyles';

interface CollapsiblePanelProps {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsiblePanel({
  title,
  summary,
  defaultOpen = false,
  children,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`${experienceCard} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#faf8f4]"
        aria-expanded={open}
      >
        <div>
          <p className="text-sm font-semibold text-[#2c2825]">{title}</p>
          {summary && !open && (
            <p className="mt-1 text-xs leading-relaxed text-stone-500">{summary}</p>
          )}
        </div>
        <span className="text-lg text-amber-900/60" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && <div className="border-t border-stone-100 px-5 py-5">{children}</div>}
    </div>
  );
}
