import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_SELECTED_ITEM } from '../data/pankouData';
import type { PankouItem } from '../types';

interface SelectedSpecimenContextValue {
  selectedSpecimen: PankouItem;
  setSelectedSpecimen: (item: PankouItem) => void;
}

const SelectedSpecimenContext = createContext<SelectedSpecimenContextValue | null>(null);

export function SelectedSpecimenProvider({ children }: { children: ReactNode }) {
  const [selectedSpecimen, setSelectedSpecimen] = useState<PankouItem>(DEFAULT_SELECTED_ITEM);

  const value = useMemo(
    () => ({ selectedSpecimen, setSelectedSpecimen }),
    [selectedSpecimen],
  );

  return (
    <SelectedSpecimenContext.Provider value={value}>{children}</SelectedSpecimenContext.Provider>
  );
}

export function useSelectedSpecimen(): SelectedSpecimenContextValue {
  const context = useContext(SelectedSpecimenContext);
  if (!context) {
    throw new Error('useSelectedSpecimen must be used within SelectedSpecimenProvider');
  }
  return context;
}
