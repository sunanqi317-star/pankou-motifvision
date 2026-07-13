import styles from './Project2FbxViewer.module.css';

export function Project2FbxViewerPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`${styles.viewer} ${styles.viewerPlaceholder}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    />
  );
}
