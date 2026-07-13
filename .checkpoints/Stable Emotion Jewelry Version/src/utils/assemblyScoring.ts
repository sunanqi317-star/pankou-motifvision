import type { AssemblyScores, PlaySpecimen } from '../types/play';

const IDEAL_PLACEMENT: Record<string, string> = {
  'slot-left': 'left-loop',
  'slot-right': 'right-loop',
  'slot-center': 'central-knot',
  'slot-tail': 'tail-cord',
  'slot-closure': 'closure-node',
  'slot-motif': 'decorative-motif',
};

export function scoreAssembly(
  placements: Record<string, string | null>,
  _specimen: PlaySpecimen,
): AssemblyScores {
  const slots = Object.keys(IDEAL_PLACEMENT);
  let correct = 0;
  for (const slotId of slots) {
    if (placements[slotId] === IDEAL_PLACEMENT[slotId]) correct++;
  }
  const placementRatio = correct / slots.length;

  const symmetry =
    placements['slot-left'] === 'left-loop' && placements['slot-right'] === 'right-loop'
      ? 95
      : placements['slot-left'] || placements['slot-right']
        ? 55
        : 30;

  const pathContinuity =
    placements['slot-center'] === 'central-knot' && placements['slot-tail'] === 'tail-cord'
      ? 90
      : 50;

  const closureLogic = placements['slot-closure'] === 'closure-node' ? 92 : 45;

  const culturalMatch = Math.round(60 + placementRatio * 35);

  return {
    symmetry: Math.round(symmetry * 0.4 + placementRatio * 60),
    pathContinuity: Math.round(pathContinuity * 0.5 + placementRatio * 50),
    closureLogic: Math.round(closureLogic * 0.6 + placementRatio * 40),
    culturalMatch,
  };
}

export function feedbackMessage(scores: AssemblyScores): string {
  const avg = (scores.symmetry + scores.pathContinuity + scores.closureLogic + scores.culturalMatch) / 4;
  if (avg >= 85) {
    return 'Excellent craft logic! Your assembly respects bilateral symmetry, continuous path flow, and cultural fastening tradition.';
  }
  if (avg >= 65) {
    return 'Good effort. Review loop pairing and closure placement—these anchor Pankou structural grammar.';
  }
  return 'Try again: place left and right loops symmetrically, connect the central knot to the tail cord, and position the closure node at the fastening point.';
}

export function averageScore(scores: AssemblyScores): number {
  return Math.round(
    (scores.symmetry + scores.pathContinuity + scores.closureLogic + scores.culturalMatch) / 4,
  );
}
