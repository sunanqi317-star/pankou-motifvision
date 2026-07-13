import { experienceCardMuted } from './ui/experienceStyles';

const FUTURE_WORK = [
  {
    heading: 'Embedding Integration',
    body: 'Replace mock encoders with CLIP or domain-fine-tuned ViT models. Retrieval logic accepts swapped embedding functions without interface changes.',
  },
  {
    heading: 'Generative Model Connection',
    body: 'Connect the jewelry studio to Stable Diffusion or ComfyUI APIs for in-browser generation with researcher-trained LoRA weights.',
  },
  {
    heading: 'Corpus Expansion',
    body: 'Extend beyond thirty placeholder specimens with museum holdings, field documentation, and community annotations.',
  },
] as const;

export function TechnicalNoteContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {FUTURE_WORK.map(({ heading, body }) => (
          <article key={heading} className={`${experienceCardMuted} p-5`}>
            <h3 className="text-sm font-semibold text-[#2c2825]">{heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{body}</p>
          </article>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-stone-600">
        Current build uses deterministic mock embeddings, cosine similarity with keyword re-ranking,
        and rule-based jewelry prompt generation over corpus metadata. No external model APIs are
        invoked unless Cloud SD is configured.
      </p>
    </div>
  );
}
