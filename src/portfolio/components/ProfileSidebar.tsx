import { profile } from '../data/profile';

export function ProfileSidebar() {
  return (
    <aside className="profile-sidebar profile-card">
      <div className="profile-header">
        <div className="profile-photo">
          <img
            src={profile.profileImage}
            alt={`Portrait of ${profile.name}`}
            className="profile-photo-img"
          />
        </div>

        <div className="profile-identity">
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-subtitle">{profile.academicIdentity.role}</p>
          <p className="profile-meta">{profile.academicIdentity.institution}</p>
          <a href={`mailto:${profile.email}`} className="profile-email">
            {profile.email}
          </a>
        </div>
      </div>

      <div className="profile-divider" aria-hidden="true" />

      <div className="profile-core">
        <p className="profile-core-label">Research Interests</p>
        <ul className="research-interests-list">
          {profile.researchInterests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
