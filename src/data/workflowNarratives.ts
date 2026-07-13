export type WorkflowStepId = 1 | 2 | 3 | 4 | 5 | 6;

export const WORKFLOW_STEP_NARRATIVES: Record<
  WorkflowStepId,
  { title: string; description: string }
> = {
  1: {
    title: 'Choose a Pankou',
    description:
      'Browse Haipai Pankou specimens and select one to carry through the experience. Your choice updates search, similarity, cultural relations, and AI jewelry design.',
  },
  2: {
    title: 'Search by Motif',
    description:
      'Use cultural language to find related specimens. Describe motifs, structures, or symbolic meanings and see which images respond.',
  },
  3: {
    title: 'Find Similar Forms',
    description:
      'Compare visual form across the corpus. Discover specimens that share structural rhythm, motif logic, or craft features with your selection.',
  },
  4: {
    title: 'Discover Cultural Relations',
    description:
      'Explore how motifs, skeleton types, symbolic meanings, and clusters connect in a relational view of cultural pattern.',
  },
  5: {
    title: 'Read Cultural Meaning',
    description:
      'Open an interpretation of your specimen: visual pattern, structural classification, cultural meaning, and design potential.',
  },
  6: {
    title: 'Open AI Jewelry Studio',
    description:
      'Transform cultural interpretation into LoRA-guided jewelry concepts. Adjust form, material, and structure, then generate a design-ready prompt.',
  },
} as const;
