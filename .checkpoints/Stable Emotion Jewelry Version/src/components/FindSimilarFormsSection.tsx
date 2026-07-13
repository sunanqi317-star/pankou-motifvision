import { ImageToImageSearch } from './ImageToImageSearch';
import { Section } from './Section';

export function FindSimilarFormsSection() {
  return (
    <Section id="find-similar" workflowStep={3} tone="warm">
      <ImageToImageSearch />
    </Section>
  );
}
