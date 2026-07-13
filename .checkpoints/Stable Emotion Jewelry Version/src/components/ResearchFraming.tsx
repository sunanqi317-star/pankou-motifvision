import { IntroSection } from './IntroSection';
import { panel } from './ui/researchStyles';

const FRAMING = [
  {
    term: 'Research Question',
    body: 'How can visual transformer-inspired methods support motif retrieval, similarity analysis, and cultural reinterpretation of Haipai Pankou heritage images?',
  },
  {
    term: 'Prototype Goal',
    body: 'To connect skeleton-based structural classification, structured metadata, mock visual similarity retrieval, motif affinity visualization, cultural interpretation, and LoRA-ready generative reinterpretation.',
  },
  {
    term: 'Research Positioning',
    body: 'This prototype bridges AI + Digital Art History, Cultural Heritage Informatics, HCI, and Design Computing.',
  },
] as const;

export function ResearchFraming() {
  return (
    <IntroSection
      id="framing"
      title="Research Framing"
      subtitle="This prototype is organized as an end-to-end research narrative. It moves from a Haipai Pankou image corpus to LoRA-based generative reinterpretation, rather than presenting a set of isolated tools."
    >
      <dl className="grid gap-4 md:grid-cols-3">
        {FRAMING.map(({ term, body }) => (
          <div key={term} className={`${panel} p-5`}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              {term}
            </dt>
            <dd className="mt-3 text-sm leading-relaxed text-stone-700">{body}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 max-w-3xl border-l-2 border-slate-700 pl-4 text-sm leading-relaxed text-stone-600">
        <span className="font-medium text-slate-800">Main narrative:</span>{' '}
        Haipai Pankou image corpus → skeleton-based structural classification → motif retrieval →
        visual similarity analysis → motif affinity network → cultural interpretation report →
        LoRA-based generative reinterpretation.
      </p>
    </IntroSection>
  );
}
