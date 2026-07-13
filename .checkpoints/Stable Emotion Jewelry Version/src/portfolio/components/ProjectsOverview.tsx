import { projectOverviews, projectsIntro } from '../data/projects';
import { ContentSection } from './ContentSection';
import { ProjectOverviewImage } from './ProjectOverviewImage';

interface ProjectsOverviewProps {
  onViewProject: (projectId: string) => void;
}

function ProjectOverviewCard({
  project,
  onViewProject,
}: {
  project: (typeof projectOverviews)[number];
  onViewProject: (projectId: string) => void;
}) {
  const isFeatured = project.featured;

  return (
    <article
      className={`project-overview-card${
        isFeatured ? ' project-overview-card--featured' : ''
      }`}
    >
      <div
        className={`project-overview-card-inner${
          isFeatured ? ' project-overview-card-inner--featured' : ''
        }`}
      >
        <header className="project-overview-card-header">
          <p className="project-overview-number">{project.number}</p>
          <h3 className="project-overview-title">{project.title}</h3>
          {project.subtitle ? <p className="project-overview-subtitle">{project.subtitle}</p> : null}
        </header>

        <ProjectOverviewImage
          src={project.image.src}
          placeholderCaption={project.image.placeholderCaption}
          objectFit={project.image.objectFit}
          layout={project.image.layout}
        />

        <div className="project-overview-card-content">
          <p className="project-overview-summary">{project.summary}</p>

          <div className="project-keyword-list">
            {project.keywords.map((keyword) => (
              <span key={keyword} className="project-keyword">
                {keyword}
              </span>
            ))}
          </div>

          <a
            href={`/projects/${project.id}`}
            className="project-details-link"
            onClick={(event) => {
              event.preventDefault();
              onViewProject(project.id);
            }}
          >
            View Project Details
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProjectsOverview({ onViewProject }: ProjectsOverviewProps) {
  return (
    <ContentSection id="projects" title="Projects">
      <p className="projects-intro">{projectsIntro}</p>

      <div className="projects-overview-grid">
        {projectOverviews.map((project) => (
          <ProjectOverviewCard
            key={project.id}
            project={project}
            onViewProject={onViewProject}
          />
        ))}
      </div>
    </ContentSection>
  );
}
