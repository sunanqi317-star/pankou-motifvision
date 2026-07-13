import { useCallback, useEffect, useState } from 'react';

export type PortfolioRoute =
  | { name: 'home' }
  | { name: 'projects' }
  | { name: 'project-detail'; slug: string };

function parseRoute(): PortfolioRoute {
  const pathname = window.location.pathname;

  if (pathname === '/projects') {
    return { name: 'projects' };
  }

  const detailMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (detailMatch) {
    return { name: 'project-detail', slug: detailMatch[1] };
  }

  return { name: 'home' };
}

function scrollToTopInstant() {
  window.scrollTo(0, 0);
}

function scrollToHashTarget() {
  const hash = window.location.hash.slice(1);
  if (!hash) {
    return false;
  }

  requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  });

  return true;
}

export function isProjectsRoute(route: PortfolioRoute): boolean {
  return route.name === 'projects' || route.name === 'project-detail';
}

export function usePortfolioRoute() {
  const [route, setRoute] = useState<PortfolioRoute>(parseRoute);
  const [locationKey, setLocationKey] = useState(0);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute());
      setLocationKey((key) => key + 1);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (scrollToHashTarget()) {
      return;
    }

    scrollToTopInstant();
    requestAnimationFrame(scrollToTopInstant);
  }, [route, locationKey]);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', to);
    setRoute(parseRoute());
    setLocationKey((key) => key + 1);
  }, []);

  return { route, navigate };
}
