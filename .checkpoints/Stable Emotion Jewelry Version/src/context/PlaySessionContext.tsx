import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PlaySpecimen, PlayStep, ReflectionAnswers, AssemblyScores } from '../types/play';
import { PLAY_SPECIMENS } from '../data/playSpecimens';

interface PlaySessionState {
  step: PlayStep;
  selectedSpecimen: PlaySpecimen | null;
  revealedParts: Set<string>;
  assemblyPlacements: Record<string, string | null>;
  assemblyScores: AssemblyScores | null;
  matchCompleted: boolean;
  matchCorrect: boolean;
  reinterpretUnlocked: boolean;
  reflection: ReflectionAnswers;
  completedSteps: Set<PlayStep>;
}

interface PlaySessionContextValue extends PlaySessionState {
  setStep: (step: PlayStep) => void;
  selectSpecimen: (id: string) => void;
  revealPart: (partId: string) => void;
  setPlacement: (slotId: string, componentId: string | null) => void;
  setAssemblyScores: (scores: AssemblyScores) => void;
  completeMatch: (correct: boolean) => void;
  setReflection: (field: keyof ReflectionAnswers, value: string) => void;
  markStepComplete: (step: PlayStep) => void;
  resetSession: () => void;
  canAccessReinterpret: boolean;
}

const defaultReflection: ReflectionAnswers = {
  structureLearning: '',
  easiestHardest: '',
  generativeHelp: '',
};

const initialState: PlaySessionState = {
  step: 'start',
  selectedSpecimen: null,
  revealedParts: new Set(),
  assemblyPlacements: {},
  assemblyScores: null,
  matchCompleted: false,
  matchCorrect: false,
  reinterpretUnlocked: false,
  reflection: defaultReflection,
  completedSteps: new Set(),
};

const PlaySessionContext = createContext<PlaySessionContextValue | null>(null);

export function PlaySessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaySessionState>(initialState);

  const setStep = useCallback((step: PlayStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const selectSpecimen = useCallback((id: string) => {
    const specimen = PLAY_SPECIMENS.find((p) => p.id === id) ?? null;
    setState((s) => ({
      ...s,
      selectedSpecimen: specimen,
      revealedParts: new Set(),
      assemblyPlacements: {},
      assemblyScores: null,
      matchCompleted: false,
      matchCorrect: false,
    }));
  }, []);

  const revealPart = useCallback((partId: string) => {
    setState((s) => {
      const next = new Set(s.revealedParts);
      next.add(partId);
      return { ...s, revealedParts: next };
    });
  }, []);

  const setPlacement = useCallback((slotId: string, componentId: string | null) => {
    setState((s) => ({
      ...s,
      assemblyPlacements: { ...s.assemblyPlacements, [slotId]: componentId },
      assemblyScores: null,
    }));
  }, []);

  const setAssemblyScores = useCallback((scores: AssemblyScores) => {
    setState((s) => ({ ...s, assemblyScores: scores }));
  }, []);

  const completeMatch = useCallback((correct: boolean) => {
    setState((s) => ({
      ...s,
      matchCompleted: true,
      matchCorrect: correct,
      reinterpretUnlocked: correct || s.reinterpretUnlocked,
    }));
  }, []);

  const setReflection = useCallback((field: keyof ReflectionAnswers, value: string) => {
    setState((s) => ({
      ...s,
      reflection: { ...s.reflection, [field]: value },
    }));
  }, []);

  const markStepComplete = useCallback((step: PlayStep) => {
    setState((s) => {
      const next = new Set(s.completedSteps);
      next.add(step);
      return { ...s, completedSteps: next };
    });
  }, []);

  const resetSession = useCallback(() => {
    setState(initialState);
  }, []);

  const canAccessReinterpret =
    state.reinterpretUnlocked ||
    (state.assemblyScores !== null &&
      state.revealedParts.size >= 5 &&
      state.matchCompleted);

  const value = useMemo<PlaySessionContextValue>(
    () => ({
      ...state,
      setStep,
      selectSpecimen,
      revealPart,
      setPlacement,
      setAssemblyScores,
      completeMatch,
      setReflection,
      markStepComplete,
      resetSession,
      canAccessReinterpret,
    }),
    [
      state,
      setStep,
      selectSpecimen,
      revealPart,
      setPlacement,
      setAssemblyScores,
      completeMatch,
      setReflection,
      markStepComplete,
      resetSession,
      canAccessReinterpret,
    ],
  );

  return (
    <PlaySessionContext.Provider value={value}>{children}</PlaySessionContext.Provider>
  );
}

export function usePlaySession() {
  const ctx = useContext(PlaySessionContext);
  if (!ctx) throw new Error('usePlaySession must be used within PlaySessionProvider');
  return ctx;
}
