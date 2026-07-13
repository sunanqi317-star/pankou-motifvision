import { useMemo, useState } from 'react';
import {
  CLASSIFICATION_DIMENSIONS,
  PANKOU_TYPES,
  pankouItems,
} from '../data/pankouData';
import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import type { PankouClassification, PankouItem } from '../types';
import { MetadataModal } from './MetadataModal';
import { PankouCard } from './PankouCard';
import { Section } from './Section';
import { btnExperienceSecondary, experienceCard, experienceSelect } from './ui/experienceStyles';

type ClassificationKey = keyof PankouClassification;

const EMPTY_FILTERS: Record<ClassificationKey, string> = {
  form: '',
  craft: '',
  material: '',
  color: '',
  composition: '',
  motifSemantics: '',
  structuralSkeleton: '',
};

export function DatasetViewer() {
  const { selectedSpecimen, setSelectedSpecimen } = useSelectedSpecimen();
  const [pankouTypeFilter, setPankouTypeFilter] = useState('');
  const [classificationFilters, setClassificationFilters] =
    useState<Record<ClassificationKey, string>>(EMPTY_FILTERS);
  const [modalItem, setModalItem] = useState<PankouItem | null>(null);

  const filtered = useMemo(() => {
    return pankouItems.filter((item) => {
      if (pankouTypeFilter && item.pankouType !== pankouTypeFilter) return false;
      for (const dim of CLASSIFICATION_DIMENSIONS) {
        const key = dim.key as ClassificationKey;
        const value = classificationFilters[key];
        if (value && item.classification[key] !== value) return false;
      }
      return true;
    });
  }, [pankouTypeFilter, classificationFilters]);

  const handleCardClick = (item: PankouItem) => {
    setModalItem(item);
    setSelectedSpecimen(item);
  };

  const clearFilters = () => {
    setPankouTypeFilter('');
    setClassificationFilters(EMPTY_FILTERS);
  };

  return (
    <Section id="choose-pankou" workflowStep={1}>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-stone-600">
        Tap a specimen to carry it through search, cultural relations, interpretation, and AI
        jewelry design. Filter by Pankou type or any of the seven classification dimensions.
      </p>

      <div className={`${experienceCard} mb-8 p-5`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-medium text-stone-600">Pankou Type</span>
            <select
              value={pankouTypeFilter}
              onChange={(e) => setPankouTypeFilter(e.target.value)}
              className={experienceSelect}
            >
              <option value="">All types</option>
              {PANKOU_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          {CLASSIFICATION_DIMENSIONS.map((dim) => (
            <label key={dim.key} className="flex flex-col gap-1 text-xs">
              <span className="font-medium text-stone-600">{dim.label}</span>
              <select
                value={classificationFilters[dim.key as ClassificationKey]}
                onChange={(e) =>
                  setClassificationFilters((prev) => ({
                    ...prev,
                    [dim.key]: e.target.value,
                  }))
                }
                className={experienceSelect}
              >
                <option value="">All</option>
                {dim.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={clearFilters}
            className={`${btnExperienceSecondary} px-3 py-1.5 text-xs`}
          >
            Clear filters
          </button>
          <p className="text-xs text-stone-500">
            Showing {filtered.length} of {pankouItems.length} specimens
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <PankouCard
            key={item.id}
            item={item}
            onClick={() => handleCardClick(item)}
            selected={selectedSpecimen.id === item.id}
          />
        ))}
      </div>

      <MetadataModal item={modalItem} onClose={() => setModalItem(null)} />
    </Section>
  );
}
