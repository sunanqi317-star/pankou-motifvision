import { useState } from 'react';

interface ProjectOverviewImageProps {
  src: string;
  placeholderCaption: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
  layout?: 'horizontal' | 'default';
}

export function ProjectOverviewImage({
  src,
  placeholderCaption,
  className = '',
  objectFit = 'cover',
  layout = 'default',
}: ProjectOverviewImageProps) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const containClass = objectFit === 'contain' ? 'project-overview-media--contain' : '';
  const layoutClass = layout === 'horizontal' ? 'project-overview-media--horizontal' : '';

  return (
    <figure className={`project-overview-media ${containClass} ${layoutClass} ${className}`.trim()}>
      {usePlaceholder ? (
        <div
          className={`project-overview-image project-overview-image--placeholder${
            objectFit === 'contain' ? ' project-overview-image--contain' : ''
          }`}
        >
          <span className="project-overview-image-caption">{placeholderCaption}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={placeholderCaption}
          className={`project-overview-image${
            objectFit === 'contain' ? ' project-overview-image--contain' : ''
          }`}
          loading="lazy"
          onError={() => setUsePlaceholder(true)}
        />
      )}
    </figure>
  );
}
