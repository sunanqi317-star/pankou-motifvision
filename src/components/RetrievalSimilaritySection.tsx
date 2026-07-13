import { IntroSection } from './IntroSection';
import { ImageToImageSearch } from './ImageToImageSearch';
import { TextToImageSearch } from './TextToImageSearch';

export function RetrievalSimilaritySection() {
  return (
    <IntroSection
      id="retrieval-similarity"
      eyebrow="Workflow Steps 2 and 3"
      tone="muted"
      title="Retrieval and Similarity Analysis"
      subtitle="Two complementary retrieval modes query the annotated corpus from Step 1 and feed specimen selection for motif affinity analysis in Step 4."
    >
      <p className="mb-8 max-w-3xl border-l-2 border-stone-300 pl-4 text-sm leading-relaxed text-stone-600">
        This stage combines two complementary retrieval questions:
        <br />
        <span className="text-stone-700">
          A. Text-to-image retrieval: Can cultural language locate relevant Pankou images?
        </span>
        <br />
        <span className="text-stone-700">
          B. Image-to-image retrieval: Can one Pankou image retrieve visually similar specimens?
        </span>
      </p>

      <div className="space-y-8">
        <TextToImageSearch />
        <ImageToImageSearch />
      </div>
    </IntroSection>
  );
}
