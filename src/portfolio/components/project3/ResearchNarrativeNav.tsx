import { useEffect, useState } from 'react';
import { PROJECT3_NAV } from '../../data/project3Content';

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  return false;
}

export function ResearchNarrativeNav() {
  const [activeId, setActiveId] = useState<string>(PROJECT3_NAV[0].id);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    let retryTimer: number | undefined;

    const connectObserver = () => {
      const sections = PROJECT3_NAV.map((item) => document.getElementById(item.id)).filter(
        (section): section is HTMLElement => section !== null,
      );

      if (sections.length !== PROJECT3_NAV.length) {
        return false;
      }

      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          const nextActive = visible[0]?.target.id;
          if (nextActive) {
            setActiveId(nextActive);
          }
        },
        {
          rootMargin: '-24% 0px -58% 0px',
          threshold: [0, 0.2, 0.45, 0.7, 1],
        },
      );

      sections.forEach((section) => observer?.observe(section));
      return true;
    };

    if (!connectObserver()) {
      retryTimer = window.setInterval(() => {
        if (connectObserver() && retryTimer) {
          window.clearInterval(retryTimer);
        }
      }, 200);
    }

    return () => {
      if (retryTimer) {
        window.clearInterval(retryTimer);
      }
      observer?.disconnect();
    };
  }, []);

  const handleClick = (id: string) => {
    setActiveId(id);

    if (scrollToSection(id)) {
      return;
    }

    document
      .querySelector('[aria-label="Project 3 research narrative"]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    let attempts = 0;
    const retryScroll = window.setInterval(() => {
      if (scrollToSection(id) || attempts >= 24) {
        window.clearInterval(retryScroll);
      }
      attempts += 1;
    }, 150);
  };

  return (
    <ol className="project-process-timeline project-process-timeline--narrative" aria-label="Research narrative index">
      {PROJECT3_NAV.map((item, index) => {
        const isActive = activeId === item.id;

        return (
          <li key={item.id} className="project-process-step-item">
            <a
              href={`#${item.id}`}
              className={`project-process-step${isActive ? ' project-process-step--active' : ''}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={(event) => {
                event.preventDefault();
                handleClick(item.id);
              }}
            >
              <span className="project-process-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="project-process-label">{item.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
