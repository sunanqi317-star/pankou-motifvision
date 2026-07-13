import { AcademicBackground } from './components/AcademicBackground';
import { PersonalProfile } from './components/PersonalProfile';
import { PortfolioLayout } from './components/PortfolioLayout';
import { PublicationsAndPresentations } from './components/PublicationsAndPresentations';
import { ResearchExperiencePreview } from './components/ResearchExperiencePreview';
import type { PortfolioRoute } from './usePortfolioRoute';

interface HomePageProps {
  route: PortfolioRoute;
  onNavigate: (to: string) => void;
}

export function HomePage({ route, onNavigate }: HomePageProps) {
  return (
    <PortfolioLayout route={route} onNavigate={onNavigate}>
      <PersonalProfile />
      <AcademicBackground />
      <PublicationsAndPresentations />
      <ResearchExperiencePreview onViewAll={() => onNavigate('/projects')} />
    </PortfolioLayout>
  );
}
