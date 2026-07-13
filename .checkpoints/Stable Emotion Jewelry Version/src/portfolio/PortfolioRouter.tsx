import { HomePage } from './HomePage';
import { ProjectsPage } from './ProjectsPage';
import { isProjectsRoute, usePortfolioRoute } from './usePortfolioRoute';

export function PortfolioRouter() {
  const { route, navigate } = usePortfolioRoute();

  if (isProjectsRoute(route)) {
    return <ProjectsPage route={route} onNavigate={navigate} />;
  }

  return <HomePage route={route} onNavigate={navigate} />;
}
