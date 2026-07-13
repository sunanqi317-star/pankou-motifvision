import { Section } from './Section';

const FUTURE_WORK = [
  {
    heading: 'Embedding Integration',
    body:
      'Replace mock encoders in src/utils/embeddings.ts with CLIP or domain-fine-tuned ViT models trained on heritage textile and ornament imagery. ' +
      'The retrieval logic in src/utils/search.ts is structured to accept swapped embedding functions without interface changes.',
  },
  {
    heading: 'Generative Model Connection',
    body:
      'Connect the LoRA jewelry module to Stable Diffusion WebUI API or ComfyUI API for in-browser image generation using researcher-trained LoRA weights. ' +
      'Current output is limited to structured prompts and design concepts.',
  },
  {
    heading: 'Corpus Expansion',
    body:
      'Extend the annotated corpus beyond thirty placeholder specimens with digitized museum holdings, field documentation, and community-sourced annotations. ' +
      'Network topology and motif reports should be regenerated or learned from expanded data.',
  },
] as const;

export function TechnicalNoteSection() {
  return (
    <Section
      id="future-work"
      tone="muted"
      title="Technical Note / Future Work"
      subtitle="Implementation constraints of the current demonstrator and planned extensions for research deployment."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {FUTURE_WORK.map(({ heading, body }) => (
          <article key={heading} className="rounded border border-stone-200 bg-stone-50 p-5">
            <h3 className="text-sm font-semibold text-slate-800">{heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{body}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded border border-stone-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-800">Current Implementation</h3>
        <p className="mt-2 text-xs leading-relaxed text-stone-600">
          The prototype uses deterministic mock embeddings in{' '}
          <code className="rounded bg-stone-50 px-1 font-mono text-[11px]">src/utils/embeddings.ts</code>.
          Text and image retrieval in{' '}
          <code className="rounded bg-stone-50 px-1 font-mono text-[11px]">src/utils/search.ts</code>{' '}
          applies cosine similarity with keyword re-ranking. Jewelry prompt generation in{' '}
          <code className="rounded bg-stone-50 px-1 font-mono text-[11px]">src/utils/loraJewelry.ts</code>{' '}
          is rule-based over corpus metadata. No external model APIs are invoked at runtime.
        </p>
      </div>
    </Section>
  );
}
