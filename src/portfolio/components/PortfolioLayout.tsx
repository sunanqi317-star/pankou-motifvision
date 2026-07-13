import type { ReactNode } from 'react';
import type { PortfolioRoute } from '../usePortfolioRoute';
import { Navigation } from './Navigation';
import { PortfolioFooter } from './PortfolioFooter';
import { ProfileSidebar } from './ProfileSidebar';

interface PortfolioLayoutProps {
  children: ReactNode;
  route: PortfolioRoute;
  onNavigate: (to: string) => void;
}

export function PortfolioLayout({
  children,
  route,
  onNavigate,
}: PortfolioLayoutProps) {
  return (
    <div className="portfolio-page min-h-screen bg-portfolio-ivory text-portfolio-brown antialiased">
      <Navigation route={route} onNavigate={onNavigate} />

      <main className="main-layout">
        <div className="profile-column">
          <ProfileSidebar />
        </div>

        <section className="main-content content-column" aria-label="Portfolio content">
          {children}
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
