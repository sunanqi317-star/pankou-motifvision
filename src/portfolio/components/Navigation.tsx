import { navLinks, profile } from '../data/profile';
import { isProjectsRoute, type PortfolioRoute } from '../usePortfolioRoute';

interface NavigationProps {
  route: PortfolioRoute;
  onNavigate: (to: string) => void;
}

function NavAnchor({
  link,
  isActive,
  onNavigate,
}: {
  link: (typeof navLinks)[number];
  isActive: boolean;
  onNavigate: (to: string) => void;
}) {
  if ('href' in link) {
    return (
      <a
        href={link.href}
        className="nav-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.label}
      </a>
    );
  }

  const href = link.path === '/' ? '/#about-me' : link.path;

  return (
    <a
      href={href}
      className={`nav-link${isActive ? ' nav-link--active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(link.path === '/' ? '/#about-me' : link.path);
      }}
    >
      {link.label}
    </a>
  );
}

export function Navigation({ route, onNavigate }: NavigationProps) {
  const onProjectsSection = isProjectsRoute(route);

  return (
    <header className="site-header">
      <nav className="site-nav">
        <a
          href="/#about-me"
          className="nav-brand"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('/#about-me');
          }}
        >
          {profile.name}
        </a>

        <div className="nav-links">
          {navLinks.map((link) => {
            const isActive =
              'path' in link &&
              !('href' in link) &&
              (link.path === '/projects' ? onProjectsSection : !onProjectsSection);

            return (
              <NavAnchor
                key={link.label}
                link={link}
                isActive={isActive}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      </nav>
    </header>
  );
}
