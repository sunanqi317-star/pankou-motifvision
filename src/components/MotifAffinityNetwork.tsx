import { useEffect, useMemo, useState } from 'react';
import { networkNodes } from '../data/pankouData';
import { getNodeInterpretation } from '../data/networkNodeContent';
import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import type { NetworkNodeType } from '../types';
import {
  getEdgesForNode,
  getHighlightedPathChips,
  getSpecimenNetworkHighlight,
} from '../utils/networkHighlight';
import { CulturalRelationMap, NODE_STYLES } from './CulturalRelationMap';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Section } from './Section';
import { btnExperiencePrimary, experienceCard } from './ui/experienceStyles';

const LEGEND: { type: NetworkNodeType; label: string }[] = [
  { type: 'motif', label: 'Motif' },
  { type: 'path', label: 'Structure' },
  { type: 'skeleton', label: 'Skeleton' },
  { type: 'symbolic', label: 'Symbolism' },
  { type: 'cluster', label: 'Cluster' },
  { type: 'interpretation', label: 'Design output' },
];

export function MotifAffinityNetwork() {
  const { selectedSpecimen } = useSelectedSpecimen();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');

  const highlight = useMemo(
    () => getSpecimenNetworkHighlight(selectedSpecimen),
    [selectedSpecimen],
  );

  const pathChips = useMemo(
    () => getHighlightedPathChips(selectedSpecimen),
    [selectedSpecimen],
  );

  useEffect(() => {
    setSelectedNodeId(highlight.motifNodeId);
    setHoveredNodeId(null);
  }, [selectedSpecimen.id, highlight.motifNodeId]);

  const nodeMap = useMemo(
    () => Object.fromEntries(networkNodes.map((n) => [n.id, n])),
    [],
  );

  const focusNodeId = hoveredNodeId ?? selectedNodeId;
  const focusEdgeIds = useMemo(
    () => (focusNodeId ? getEdgesForNode(focusNodeId) : new Set<string>()),
    [focusNodeId],
  );

  const selectedNode = nodeMap[selectedNodeId] ?? nodeMap[highlight.motifNodeId];
  const interpretation = useMemo(
    () =>
      selectedNode
        ? getNodeInterpretation(selectedNode, selectedSpecimen, highlight.pathNodeIds)
        : null,
    [selectedNode, selectedSpecimen, highlight.pathNodeIds],
  );

  const hoverInterpretation = useMemo(() => {
    if (!hoveredNodeId || hoveredNodeId === selectedNodeId) return null;
    const node = nodeMap[hoveredNodeId];
    return node ? getNodeInterpretation(node, selectedSpecimen, highlight.pathNodeIds) : null;
  }, [hoveredNodeId, selectedNodeId, nodeMap, selectedSpecimen, highlight.pathNodeIds]);

  const handleSendToStudio = () => {
    document.getElementById('jewelry-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Section
      id="cultural-relations"
      workflowStep={4}
      subtitle="See how the selected Pankou connects motif, structure, symbolism, and jewelry design potential."
    >
      <p className="mb-6 text-xs leading-relaxed text-stone-500">
        <span className="font-medium text-stone-600">Interpretive note:</span> This map visualizes
        visual-semantic affinity. It does not claim verified historical transmission.
      </p>

      <div className="mb-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
          Highlighted Path
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {pathChips.map((chip, index) => (
            <div key={chip} className="flex items-center gap-2">
              <span className="rounded-full border border-amber-900/15 bg-white px-3 py-1.5 text-xs font-medium text-[#2c2825] shadow-sm">
                {chip}
              </span>
              {index < pathChips.length - 1 && (
                <span className="text-stone-300" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(200px,0.9fr)_minmax(280px,1.5fr)_minmax(220px,1fr)]">
        <aside className={`${experienceCard} p-5`}>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Current Object
          </p>
          <div className="overflow-hidden rounded-xl border border-stone-200/80">
            <div className="aspect-square">
              <ImagePlaceholder
                hue={selectedSpecimen.hue}
                id={selectedSpecimen.id}
                className="h-full w-full rounded-none border-0"
              />
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            {[
              ['ID', selectedSpecimen.id],
              ['Chinese', selectedSpecimen.chineseName],
              ['English', selectedSpecimen.englishName],
              ['Motif', selectedSpecimen.motif],
              ['Structure', selectedSpecimen.structure],
              ['Skeleton', selectedSpecimen.skeletonType],
              ['Symbolism', selectedSpecimen.symbolicMeaning],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] uppercase tracking-wider text-stone-400">{label}</dt>
                <dd className="mt-0.5 text-[#2c2825]">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Motif Relation Map
          </p>
          <CulturalRelationMap
            activeNodes={highlight.activeNodes}
            activeEdges={highlight.activeEdges}
            motifNodeId={highlight.motifNodeId}
            hoveredNodeId={hoveredNodeId}
            selectedNodeId={selectedNodeId}
            focusEdgeIds={focusEdgeIds}
            onHoverNode={setHoveredNodeId}
            onSelectNode={setSelectedNodeId}
          />
          {hoverInterpretation && (
            <p className="rounded-xl border border-stone-200/70 bg-white/80 px-4 py-2.5 text-xs text-stone-600">
              <span className="font-medium text-[#2c2825]">{hoverInterpretation.title}</span>
              {' · '}
              {hoverInterpretation.tooltip}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-1">
            {LEGEND.map(({ type, label }) => (
              <div key={type} className="flex items-center gap-1.5 text-[10px] text-stone-500">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: NODE_STYLES[type].fill }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>

        <aside className={`${experienceCard} flex flex-col p-5`}>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Interpretation
          </p>

          {interpretation ? (
            <div className="flex flex-1 flex-col">
              <h3 className="text-lg font-semibold text-[#2c2825]">{interpretation.title}</h3>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-900/70">
                  Why this relation matters
                </p>
                <ul className="mt-2 space-y-2">
                  {interpretation.whyItMatters.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-relaxed text-stone-700">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-800/60" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-900/70">
                  Design translation
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  {interpretation.designTranslation}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Suggested jewelry forms
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {interpretation.jewelryForms.map((form) => (
                    <span
                      key={form}
                      className="rounded-full border border-stone-200 bg-[#faf8f4] px-2.5 py-1 text-[11px] text-stone-700"
                    >
                      {form}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendToStudio}
                className={`${btnExperiencePrimary} mt-auto pt-6 w-full`}
              >
                Send to AI Jewelry Studio
              </button>
            </div>
          ) : (
            <p className="text-sm text-stone-500">Select a node on the map to read its interpretation.</p>
          )}
        </aside>
      </div>
    </Section>
  );
}
