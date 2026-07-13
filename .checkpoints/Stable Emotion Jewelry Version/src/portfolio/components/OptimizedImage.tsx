import { forwardRef, type ImgHTMLAttributes } from 'react';
import { getProject2ImageMeta } from '../data/project2ImageMeta';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  src: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

function toWebpSrc(src: string): string {
  return src.replace(/\.(png|jpe?g)$/i, '.webp');
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(function OptimizedImage(
  { src, alt, loading = 'lazy', width, height, className, ...props },
  ref,
) {
  const meta = getProject2ImageMeta(src);
  const resolvedWidth = width ?? meta?.width;
  const resolvedHeight = height ?? meta?.height;
  const webpSrc = toWebpSrc(src);

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        width={resolvedWidth}
        height={resolvedHeight}
        className={className}
        {...props}
      />
    </picture>
  );
});
