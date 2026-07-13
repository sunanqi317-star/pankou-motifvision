import { useCallback, useMemo, useState } from 'react';
import { MOTIFS, STRUCTURES, SYMBOLIC_MEANINGS, pankouItems } from '../data/pankouData';
import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import type { PankouItem } from '../types';
import {
  type CulturalEmphasis,
  defaultEmphasisForSpecimen,
} from '../utils/culturalFramework';
import { GeneSourceCard } from './GeneSourceCard';
import { PankouProfileModal } from './PankouProfileModal';
import { PortfolioSection } from './PortfolioSection';
import {
  btnExperienceReset,
  experienceCard,
  experienceSelect,
} from './ui/experienceStyles';

export function CulturalGeneSource() {
  const { setSelectedSpecimen } = useSelectedSpecimen();

  const [motifFilter, setMotifFilter] = useState('');
  const [structureFilter, setStructureFilter] = useState('');
  const [symbolicFilter, setSymbolicFilter] = useState('');
  const [selectedPankou, setSelectedPankou] = useState<PankouItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCulturalEmphasis, setSelectedCulturalEmphasis] = useState<CulturalEmphasis>(
    'Auspicious Blessing',
  );
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);

  const filtered = useMemo(() => {
    return pankouItems.filter((item) => {
      if (motifFilter && item.motif !== motifFilter) return false;
      if (structureFilter && item.structure !== structureFilter) return false;
      if (symbolicFilter && item.symbolicMeaning !== symbolicFilter) return false;
      return true;
    });
  }, [motifFilter, structureFilter, symbolicFilter]);

  const handleSelectCard = useCallback(
    (item: PankouItem) => {
      setSelectedPankou(item);
      setSelectedSpecimen(item);
      setSelectedCulturalEmphasis(defaultEmphasisForSpecimen(item));
      setIsMetadataOpen(false);
      setIsModalOpen(true);
    },
    [setSelectedSpecimen],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <PortfolioSection
        id="cultural-gene-source"
        title="Cultural Gene Source"
        subtitle="Choose a Haipai Pankou as the cultural source for AI jewelry generation."
        headerClassName="mb-12"
      >
        <div className={`gene-filter-bar ${experienceCard} mb-8 shadow-sm`}>
          <label className="min-w-0">
            <span className="mb-1.5 block text-xs font-medium text-stone-600">Motif</span>
            <select value={motifFilter} onChange={(e) => setMotifFilter(e.target.value)} className={experienceSelect}>
              <option value="">All motifs</option>
              {MOTIFS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="min-w-0">
            <span className="mb-1.5 block text-xs font-medium text-stone-600">Structure</span>
            <select value={structureFilter} onChange={(e) => setStructureFilter(e.target.value)} className={experienceSelect}>
              <option value="">All structures</option>
              {STRUCTURES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="min-w-0">
            <span className="mb-1.5 block text-xs font-medium text-stone-600">Symbolic Meaning</span>
            <select value={symbolicFilter} onChange={(e) => setSymbolicFilter(e.target.value)} className={experienceSelect}>
              <option value="">All meanings</option>
              {SYMBOLIC_MEANINGS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setMotifFilter('');
                setStructureFilter('');
                setSymbolicFilter('');
              }}
              className={btnExperienceReset}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="gene-gallery">
          {filtered.map((item) => (
            <GeneSourceCard
              key={item.id}
              item={item}
              selected={isModalOpen && selectedPankou?.id === item.id}
              onClick={() => handleSelectCard(item)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-stone-500">No specimens match the current filters.</p>
        )}
      </PortfolioSection>

      {selectedPankou && (
        <PankouProfileModal
          specimen={selectedPankou}
          isOpen={isModalOpen}
          selectedCulturalEmphasis={selectedCulturalEmphasis}
          isMetadataOpen={isMetadataOpen}
          onClose={handleCloseModal}
          onEmphasisChange={setSelectedCulturalEmphasis}
          onMetadataToggle={setIsMetadataOpen}
        />
      )}
    </>
  );
}
