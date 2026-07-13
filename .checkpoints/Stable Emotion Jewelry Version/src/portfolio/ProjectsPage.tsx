import { getProjectDetail } from './data/projects';
import { PortfolioLayout } from './components/PortfolioLayout';
import { ProjectDetailView } from './components/ProjectDetailView';
import { ProjectsOverview } from './components/ProjectsOverview';
import type { PortfolioRoute } from './usePortfolioRoute';
import { useEffect, useLayoutEffect } from 'react';

interface ProjectsPageProps {
  route: PortfolioRoute;
  onNavigate: (to: string) => void;
}

export function ProjectsPage({ route, onNavigate }: ProjectsPageProps) {
  const slug = route.name === 'project-detail' ? route.slug : undefined;
  const project = slug ? getProjectDetail(slug) : undefined;

  useEffect(() => {
    if (route.name === 'project-detail' && !project) {
      onNavigate('/projects');
    }
  }, [route.name, project, onNavigate]);

  useLayoutEffect(() => {
    if (route.name === 'project-detail' && project) {
      window.scrollTo(0, 0);
    }
  }, [route.name, slug, project]);

  return (
    <PortfolioLayout route={route} onNavigate={onNavigate}>
      {project ? (
        <ProjectDetailView
          project={project}
          onBack={() => onNavigate('/projects')}
        />
      ) : (
        <ProjectsOverview onViewProject={(id) => onNavigate(`/projects/${id}`)} />
      )}
    </PortfolioLayout>
  );
}
