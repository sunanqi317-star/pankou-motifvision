import { Suspense, lazy } from 'react';
import { LazyMount } from '../LazyMount';

const Project3SymbolInterpretation = lazy(() =>
  import('./Project3SymbolInterpretation').then((module) => ({
    default: module.Project3SymbolInterpretation,
  })),
);
const Project3KeywordFramework = lazy(() =>
  import('./Project3KeywordFramework').then((module) => ({
    default: module.Project3KeywordFramework,
  })),
);
const Project3AigcGeneration = lazy(() =>
  import('./Project3AigcGeneration').then((module) => ({
    default: module.Project3AigcGeneration,
  })),
);
const Project3HealingValidation = lazy(() =>
  import('./Project3HealingValidation').then((module) => ({
    default: module.Project3HealingValidation,
  })),
);

function SectionPlaceholder({ minHeight }: { minHeight: string }) {
  return <div aria-hidden="true" style={{ minHeight }} />;
}

export function Project3Page() {
  return (
    <>
      <LazyMount
        rootMargin="320px 0px"
        minHeight="22rem"
        fallback={<SectionPlaceholder minHeight="22rem" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="22rem" />}>
          <Project3SymbolInterpretation />
        </Suspense>
      </LazyMount>
      <LazyMount
        rootMargin="320px 0px"
        minHeight="20rem"
        fallback={<SectionPlaceholder minHeight="20rem" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="20rem" />}>
          <Project3KeywordFramework />
        </Suspense>
      </LazyMount>
      <LazyMount
        rootMargin="320px 0px"
        minHeight="24rem"
        fallback={<SectionPlaceholder minHeight="24rem" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="24rem" />}>
          <Project3AigcGeneration />
        </Suspense>
      </LazyMount>
      <LazyMount
        rootMargin="320px 0px"
        minHeight="18rem"
        fallback={<SectionPlaceholder minHeight="18rem" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="18rem" />}>
          <Project3HealingValidation />
        </Suspense>
      </LazyMount>
    </>
  );
}
