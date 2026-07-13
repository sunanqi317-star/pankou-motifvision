import { useRef, type ReactNode } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyMountProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
  minHeight?: string;
}

export function LazyMount({
  children,
  fallback = null,
  rootMargin = '280px 0px',
  className,
  minHeight,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(ref, { rootMargin, once: true });

  return (
    <div ref={ref} className={className} style={minHeight ? { minHeight } : undefined}>
      {isIntersecting ? children : fallback}
    </div>
  );
}
