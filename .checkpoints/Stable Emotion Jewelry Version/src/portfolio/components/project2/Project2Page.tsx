import { Suspense, lazy } from 'react';
import { RestorationVisualEvidenceSection } from '../PankouRestorationGame';
import { LazyMount } from '../LazyMount';

const Project2Reconstruction = lazy(() =>
  import('./Project2Reconstruction').then((module) => ({ default: module.Project2Reconstruction })),
);
const Project2DigitalExhibition = lazy(() =>
  import('./Project2DigitalExhibition').then((module) => ({
    default: module.Project2DigitalExhibition,
  })),
);
const Project2Prototype = lazy(() =>
  import('./Project2Prototype').then((module) => ({ default: module.Project2Prototype })),
);

function SectionPlaceholder({ minHeight }: { minHeight: string }) {
  return <div aria-hidden="true" style={{ minHeight }} />;
}

export function Project2Page() {
  return (
    <>
      <RestorationVisualEvidenceSection />
      <LazyMount
        rootMargin="320px 0px"
        minHeight="28rem"
        fallback={<SectionPlaceholder minHeight="28rem" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="28rem" />}>
          <Project2Reconstruction />
        </Suspense>
      </LazyMount>
      <LazyMount
        rootMargin="320px 0px"
        minHeight="24rem"
        fallback={<SectionPlaceholder minHeight="24rem" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="24rem" />}>
          <Project2DigitalExhibition />
        </Suspense>
      </LazyMount>
      <LazyMount
        rootMargin="320px 0px"
        minHeight="22rem"
        fallback={<SectionPlaceholder minHeight="22rem" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="22rem" />}>
          <Project2Prototype />
        </Suspense>
      </LazyMount>
    </>
  );
}
