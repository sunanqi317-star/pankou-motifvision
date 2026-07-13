import { profile } from '../data/profile';
import { ContentSection } from './ContentSection';

export function ContactSection() {
  return (
    <ContentSection id="contact" title="Contact">
      <p className="font-body text-sm text-portfolio-brown/70">
        Email:{' '}
        <a
          href={`mailto:${profile.email}`}
          className="text-portfolio-brown hover:text-portfolio-red transition-colors"
        >
          {profile.email}
        </a>
      </p>
      <a href={profile.cvPath} download className="portfolio-btn portfolio-btn-primary profile-cv-btn mt-3">
        Download CV
      </a>
    </ContentSection>
  );
}
