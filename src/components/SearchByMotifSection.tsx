import { TextToImageSearch } from './TextToImageSearch';
import { Section } from './Section';

export function SearchByMotifSection() {
  return (
    <Section id="search-motif" workflowStep={2}>
      <TextToImageSearch />
    </Section>
  );
}
