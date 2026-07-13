import { experienceCardMuted } from './ui/experienceStyles';

const FRAMING = [
  {
    term: 'Research Question',
    body: 'How can visual transformer-inspired methods support motif retrieval, similarity analysis, and cultural reinterpretation of Haipai Pankou heritage images?',
  },
  {
    term: 'Prototype Goal',
    body: 'Connect skeleton-based classification, structured metadata, visual similarity retrieval, motif affinity visualization, cultural interpretation, and LoRA-ready generative reinterpretation.',
  },
  {
    term: 'Research Positioning',
    body: 'Bridges AI and digital art history, cultural heritage informatics, HCI, and design computing.',
  },
] as const;

export function ResearchNotesContent() {
  return (
    <div className="space-y-6">
      <dl className="grid gap-4 md:grid-cols-3">
        {FRAMING.map(({ term, body }) => (
          <div key={term} className={`${experienceCardMuted} p-5`}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-amber-950/80">
              {term}
            </dt>
            <dd className="mt-3 text-sm leading-relaxed text-stone-700">{body}</dd>
          </div>
        ))}
      </dl>
      <p className="max-w-3xl text-sm leading-relaxed text-stone-600">
        Main narrative: Haipai Pankou corpus → structural classification → motif retrieval → visual
        similarity → cultural relations → interpretation → LoRA jewelry reinterpretation.
      </p>
    </div>
  );
}
