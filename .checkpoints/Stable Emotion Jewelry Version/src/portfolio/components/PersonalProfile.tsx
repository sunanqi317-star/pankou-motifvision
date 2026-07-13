import { aboutMe } from '../data/profile';
import { ContentSection } from './ContentSection';

export function PersonalProfile() {
  return (
    <ContentSection id="about-me" title="About Me">
      <div className="personal-profile about-text">
        <p className="personal-profile-text">
          I am a Master of Design candidate at China University of Geosciences, Beijing, with a
          background in product design, jewelry design, and traditional material culture. I expect to
          graduate in <strong className="about-emphasis">June 2027</strong> and hope to pursue PhD
          opportunities for <strong className="about-emphasis">2027 entry</strong>, with a focus on{' '}
          <strong className="about-emphasis">digital heritage</strong>,{' '}
          <strong className="about-emphasis">interactive virtual museums</strong>,{' '}
          <strong className="about-emphasis">digital craft</strong>, and{' '}
          <strong className="about-emphasis">AIGC-assisted cultural design</strong>.
        </p>
        <p className="personal-profile-text">{aboutMe[1]}</p>
        <p className="personal-profile-text">{aboutMe[2]}</p>
      </div>
    </ContentSection>
  );
}
