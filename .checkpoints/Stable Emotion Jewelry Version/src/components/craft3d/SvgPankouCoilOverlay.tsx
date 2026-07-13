import { useEffect, useRef, useState } from 'react';
import svgRaw from '../../assets/pankou_path.svg?raw';
import type { FabricTypeId } from './fabricMaterials';
import {
  ALL_PATH_IDS,
  correctPathOrder,
  dashOffsetForProgress,
  getCurrentTargetPathId,
  PANKOU_PATH_COUNT,
} from './pankouSvgLoader';

/** Set true to force green debug paths on the operation table (Step 3 visibility fix). */
export const FORCE_SVG_TABLE_DEBUG = true;

const DEBUG_STROKE = '#00ff00';
const DEBUG_STROKE_WIDTH = '3px';
const COMPLETED_STROKE_WIDTH = '8';
const TARGET_STROKE_WIDTH = '10';
const FUTURE_STROKE_WIDTH = '4';
const HIT_STROKE_WIDTH = '28';
const ERROR_STROKE = '#dc2626';
const FUTURE_STROKE = 'rgba(150, 90, 70, 0.35)';
const STROKE_OVERRIDE_STYLE_ID = 'pankou-stroke-only-override';
const DEBUG_LABELS_LAYER_ID = 'pankou-debug-labels';
const HIT_LAYER_ID = 'pankou-hit-layer';
const SVG_SOURCE = 'src/assets/pankou_path.svg';

export type PathClickHandler = (pathId: string) => void;

interface SvgPankouCoilOverlayProps {
  forceTableDebug?: boolean;
  debugMode: boolean;
  strokeColor: string;
  fabricType: FabricTypeId | null;
  completedPathCount: number;
  animatingPathId: string | null;
  pathProgress: number;
  hintActive: boolean;
  errorFlashPathId: string | null;
  interactive: boolean;
  onPathClick: PathClickHandler;
  visible: boolean;
}

type PathEntry = {
  id: string;
  el: SVGPathElement;
  hitEl: SVGPathElement | null;
  length: number;
};

type PathRole = 'completed' | 'current' | 'future' | 'animating' | 'error';

function injectStrokeOnlyOverrides(svg: SVGSVGElement) {
  svg.setAttribute('fill', 'none');

  if (!svg.querySelector(`#${STROKE_OVERRIDE_STYLE_ID}`)) {
    const overrideStyle = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    overrideStyle.setAttribute('id', STROKE_OVERRIDE_STYLE_ID);
    overrideStyle.textContent = `
      path, polygon, polyline, circle, ellipse, rect {
        fill: none !important;
      }
    `;
    svg.insertBefore(overrideStyle, svg.firstChild);
  }
}

function pathLength(path: SVGPathElement): number {
  const length = path.getTotalLength();
  return length > 0 ? length : 1000;
}

function applyForceTableDebugPath(path: SVGPathElement, index: number) {
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', DEBUG_STROKE);
  path.setAttribute('stroke-width', DEBUG_STROKE_WIDTH);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  path.style.setProperty('fill', 'none', 'important');
  path.style.setProperty('stroke', DEBUG_STROKE, 'important');
  path.style.setProperty('stroke-width', DEBUG_STROKE_WIDTH, 'important');
  path.style.setProperty('stroke-linecap', 'round', 'important');
  path.style.setProperty('stroke-linejoin', 'round', 'important');
  path.style.setProperty('opacity', '1', 'important');

  path.style.strokeDasharray = 'none';
  path.style.strokeDashoffset = '0';
  path.style.visibility = 'visible';
  path.style.display = 'inline';
  path.style.filter = 'none';
  path.style.pointerEvents = 'none';

  const length = path.getTotalLength();
  const bbox = path.getBBox();
  console.log(
    `[table-debug] path #${index + 1}`,
    path.id || '(no id)',
    `len=${length.toFixed(1)}`,
    `bbox=${bbox.width.toFixed(1)}x${bbox.height.toFixed(1)}`,
  );
}

function paintAllPathsTableDebug(svg: SVGSVGElement) {
  const allPaths = Array.from(svg.querySelectorAll('path')).filter(
    (path) =>
      !path.closest(`#${HIT_LAYER_ID}, #${DEBUG_LABELS_LAYER_ID}`) &&
      path.getAttribute('data-hit-for') === null,
  );

  allPaths.forEach((path, index) => applyForceTableDebugPath(path, index));
  return allPaths;
}

function resolveSvgPathEntries(svg: SVGSVGElement, hitLayer: SVGGElement | null): PathEntry[] {
  const allPaths = Array.from(svg.querySelectorAll('path')).filter(
    (path) =>
      !path.closest(`#${HIT_LAYER_ID}, #${DEBUG_LABELS_LAYER_ID}`) &&
      path.getAttribute('data-hit-for') === null,
  );

  console.log('svgRaw length:', svgRaw.length);
  console.log('SVG element found:', !!svg);
  console.log('Total path elements:', allPaths.length);

  if (allPaths.length === 0) return [];

  const byId = new Map<string, SVGPathElement>();
  ALL_PATH_IDS.forEach((id) => {
    const path = svg.querySelector(`#${id}`) as SVGPathElement | null;
    if (path) byId.set(id, path);
  });

  const useFallback = ALL_PATH_IDS.some((id) => !byId.has(id));
  const sourcePaths = useFallback ? allPaths : ALL_PATH_IDS.map((id) => byId.get(id)!);

  if (useFallback) {
    console.warn(
      '[SvgPankouCoilOverlay] Path ids missing — using all real SVG paths in document order.',
    );
  }

  hitLayer?.replaceChildren();

  return sourcePaths.map((el, index) => {
    const id = ALL_PATH_IDS[index] ?? el.id ?? `path${index + 1}`;

    let hitEl: SVGPathElement | null = null;
    if (hitLayer) {
      hitEl = el.cloneNode(true) as SVGPathElement;
      hitEl.removeAttribute('id');
      hitEl.setAttribute('data-hit-for', id);
      hitEl.setAttribute('fill', 'none');
      hitEl.setAttribute('stroke', 'transparent');
      hitEl.setAttribute('stroke-width', HIT_STROKE_WIDTH);
      hitEl.style.fill = 'none';
      hitEl.style.stroke = 'transparent';
      hitEl.style.strokeWidth = HIT_STROKE_WIDTH;
      hitEl.style.pointerEvents = 'stroke';
      hitEl.style.cursor = 'pointer';
      hitLayer.appendChild(hitEl);
    }

    return { id, el, hitEl, length: pathLength(el) };
  });
}


function fabricFilter(fabricType: FabricTypeId | null): string {
  return fabricType === 'silk' ? 'drop-shadow(0 0.5px 0 rgba(255,255,255,0.28))' : 'none';
}

function applyVisualPath(
  path: SVGPathElement,
  role: PathRole,
  strokeColor: string,
  fabricType: FabricTypeId | null,
  length: number,
  progress: number,
  hintActive: boolean,
) {
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.style.setProperty('fill', 'none', 'important');
  path.style.setProperty('stroke-linecap', 'round', 'important');
  path.style.setProperty('stroke-linejoin', 'round', 'important');
  path.style.visibility = 'visible';
  path.style.display = 'inline';
  path.classList.remove('pankou-target-pulse');

  if (role === 'error') {
    path.setAttribute('stroke', ERROR_STROKE);
    path.setAttribute('stroke-width', TARGET_STROKE_WIDTH);
    path.style.setProperty('stroke', ERROR_STROKE, 'important');
    path.style.setProperty('opacity', '1', 'important');
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
    return;
  }

  if (role === 'future') {
    path.setAttribute('stroke', FUTURE_STROKE);
    path.setAttribute('stroke-width', FUTURE_STROKE_WIDTH);
    path.style.setProperty('stroke', FUTURE_STROKE, 'important');
    path.style.setProperty('opacity', '0.2', 'important');
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
    return;
  }

  if (role === 'current') {
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', TARGET_STROKE_WIDTH);
    path.style.setProperty('stroke', strokeColor, 'important');
    path.style.setProperty('opacity', '1', 'important');
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
    path.style.filter = fabricFilter(fabricType);
    if (hintActive) path.classList.add('pankou-target-pulse');
    return;
  }

  const dashOffset = role === 'animating' ? dashOffsetForProgress(length, progress) : 0;
  path.setAttribute('stroke', strokeColor);
  path.setAttribute('stroke-width', COMPLETED_STROKE_WIDTH);
  path.style.setProperty('stroke', strokeColor, 'important');
  path.style.setProperty('opacity', '1', 'important');
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${dashOffset}`;
  path.style.filter = fabricFilter(fabricType);
}

function getPathRole(
  pathId: string,
  completedPathCount: number,
  animatingPathId: string | null,
  errorFlashPathId: string | null,
): PathRole {
  if (errorFlashPathId === pathId) return 'error';
  const index = correctPathOrder.indexOf(pathId);
  if (index === -1) return 'future';
  if (index < completedPathCount) return 'completed';
  if (animatingPathId === pathId) return 'animating';
  if (pathId === getCurrentTargetPathId(completedPathCount) && !animatingPathId) return 'current';
  return 'future';
}

export function SvgPankouCoilOverlay({
  forceTableDebug = FORCE_SVG_TABLE_DEBUG,
  debugMode,
  strokeColor,
  fabricType,
  completedPathCount,
  animatingPathId,
  pathProgress,
  hintActive,
  errorFlashPathId,
  interactive,
  onPathClick,
  visible,
}: SvgPankouCoilOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathsRef = useRef<PathEntry[]>([]);
  const allPathsRef = useRef<SVGPathElement[]>([]);
  const onPathClickRef = useRef(onPathClick);
  const [svgReady, setSvgReady] = useState(false);
  const [noPathsFound, setNoPathsFound] = useState(false);

  onPathClickRef.current = onPathClick;

  const showTableDebug = forceTableDebug || debugMode;

  useEffect(() => {
    if (!visible) return;

    const container = containerRef.current;
    if (!container || svgReady) return;

    console.log('svgRaw length:', svgRaw.length);
    container.innerHTML = svgRaw;

    const svg = container.querySelector('svg');
    console.log('SVG element found:', !!svg);

    if (!svg) {
      console.warn(`[SvgPankouCoilOverlay] No <svg> root found in ${SVG_SOURCE}`);
      setNoPathsFound(true);
      setSvgReady(true);
      return;
    }

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', 'auto');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.display = 'block';
    svg.style.overflow = 'visible';
    svg.style.opacity = '1';
    svg.style.visibility = 'visible';

    injectStrokeOnlyOverrides(svg);
    svgRef.current = svg;

    if (showTableDebug) {
      const painted = paintAllPathsTableDebug(svg);
      allPathsRef.current = painted;
      pathsRef.current = [];
      setNoPathsFound(painted.length === 0);
      setSvgReady(true);
      return;
    }

    let hitLayer = svg.querySelector(`#${HIT_LAYER_ID}`) as SVGGElement | null;
    if (!hitLayer) {
      hitLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      hitLayer.setAttribute('id', HIT_LAYER_ID);
      svg.appendChild(hitLayer);
    }

    const entries = resolveSvgPathEntries(svg, hitLayer);
    pathsRef.current = entries;
    allPathsRef.current = [];
    setNoPathsFound(entries.length === 0);

    entries.forEach(({ id, hitEl }) => {
      hitEl?.addEventListener('click', (event) => {
        event.stopPropagation();
        onPathClickRef.current(id);
      });
    });

    setSvgReady(true);
  }, [visible, svgReady, showTableDebug]);

  useEffect(() => {
    if (!svgReady || showTableDebug) return;

    const svg = svgRef.current;
    const entries = pathsRef.current;
    if (!svg || entries.length === 0) return;

    entries.forEach(({ id, el, hitEl, length }) => {
      const role = getPathRole(id, completedPathCount, animatingPathId, errorFlashPathId);
      applyVisualPath(el, role, strokeColor, fabricType, length, pathProgress, hintActive && role === 'current');
      if (hitEl) {
        hitEl.style.pointerEvents = interactive && !animatingPathId ? 'stroke' : 'none';
        hitEl.style.cursor = interactive && !animatingPathId ? 'pointer' : 'default';
      }
    });
  }, [
    svgReady,
    showTableDebug,
    strokeColor,
    fabricType,
    completedPathCount,
    animatingPathId,
    pathProgress,
    hintActive,
    errorFlashPathId,
    interactive,
  ]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={containerRef}
        className={`pankou-svg-layer${showTableDebug ? ' pankou-svg-layer--table-debug' : ''}${interactive && !showTableDebug ? ' pankou-svg-layer--interactive' : ''}`}
        aria-hidden={!visible}
        role="img"
        aria-label="Pankou SVG paths on operation table"
      />
      {noPathsFound && (
        <div className="pointer-events-none absolute left-1/2 top-[58%] z-[80] w-[min(88%,520px)] -translate-x-1/2 rounded-xl border border-amber-700/30 bg-amber-50/95 px-4 py-3 text-center shadow-sm">
          <p className="text-sm font-medium text-amber-950">
            SVG paths not found. Please check src/assets/pankou_path.svg.
          </p>
        </div>
      )}
    </>
  );
}

export { PANKOU_PATH_COUNT };
