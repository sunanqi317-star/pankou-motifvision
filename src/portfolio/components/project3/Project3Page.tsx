import { Suspense, lazy } from 'react';
import { LazyMount } from '../LazyMount';

const Project3ResearchNarrative = lazy(() =>
  import('./Project3ResearchNarrative').then((module) => ({
    default: module.Project3ResearchNarrative,
  })),
);

function SectionPlaceholder({ minHeight }: { minHeight: string }) {
  return <div aria-hidden="true" style={{ minHeight }} />;
}

export function Project3Page() {
  return (
    <LazyMount
      rootMargin="320px 0px"
      minHeight="48rem"
      fallback={<SectionPlaceholder minHeight="48rem" />}
    >
      <Suspense fallback={<SectionPlaceholder minHeight="48rem" />}>
        <Project3ResearchNarrative />
      </Suspense>
    </LazyMount>
  );
}
