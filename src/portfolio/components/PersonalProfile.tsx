import { aboutMeParagraphs } from '../data/profile';
import { ContentSection } from './ContentSection';

export function PersonalProfile() {
  return (
    <ContentSection id="about-me" title="About Me">
      <div className="about-content">
        <div className="about-intro personal-profile about-text">
          {aboutMeParagraphs.map((paragraph, index) => (
            <p key={index} className="personal-profile-text">
              {paragraph.map((segment, segmentIndex) =>
                segment.emphasis ? (
                  <strong key={segmentIndex} className="about-emphasis">
                    {segment.text}
                  </strong>
                ) : (
                  <span key={segmentIndex}>{segment.text}</span>
                ),
              )}
            </p>
          ))}
        </div>
      </div>
    </ContentSection>
  );
}
