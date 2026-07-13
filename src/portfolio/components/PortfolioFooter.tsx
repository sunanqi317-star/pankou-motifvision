import { profile } from '../data/profile';

export function PortfolioFooter() {
  return (
    <footer className="border-t border-portfolio-beige-dark/35 bg-portfolio-beige/15">
      <div className="portfolio-container py-6 text-center">
        <p className="font-body text-xs text-portfolio-brown/45">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
