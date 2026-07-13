import { useCallback, useState, type FormEvent } from 'react';
import { pankouItems } from '../data/pankouData';
import { useSelectedSpecimen } from '../context/SelectedSpecimenContext';
import type { SearchResult } from '../types';
import { searchByText } from '../utils/search';
import { PankouCard } from './PankouCard';
import { WorkflowSubsection } from './WorkflowSubsection';
import { btnChip, btnPrimary, inputField } from './ui/researchStyles';

const SUGGESTIONS = [
  'butterfly motif',
  'curved spiral structure',
  'auspicious symbol',
  'floral pankou',
  'dragon protection',
  'radial symmetry lotus',
];

export function TextToImageSearch() {
  const { selectedSpecimen, setSelectedSpecimen } = useSelectedSpecimen();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const hits = await searchByText(trimmed, pankouItems, 10);
    setResults(hits);
    setLoading(false);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <WorkflowSubsection>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='e.g. "butterfly motif", "curved spiral structure", "auspicious symbol"'
            className={`${inputField} flex-1 px-4 py-2.5`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`${btnPrimary} px-5 py-2.5`}
          >
            {loading ? 'Encoding...' : 'Search'}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuery(s);
                runSearch(s);
              }}
              className={btnChip}
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {loading && (
        <p className="text-sm text-stone-500" aria-live="polite">
          Computing text embedding and ranking image corpus...
        </p>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="text-sm text-stone-500">No results. Try a different query.</p>
      )}

      {results.length > 0 && (
        <div>
          <p className="mb-4 text-xs text-stone-500">
            Ranked by embedding similarity (mock). Top {results.length} matches.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {results.map((r, i) => (
              <div key={r.item.id} className="relative">
                <span className="absolute -left-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] text-white">
                  {i + 1}
                </span>
                <PankouCard
                  item={r.item}
                  score={r.score}
                  compact
                  selected={selectedSpecimen.id === r.item.id}
                  onClick={() => setSelectedSpecimen(r.item)}
                />
                {r.matchedTerms && r.matchedTerms.length > 0 && (
                  <p className="mt-1 text-[10px] text-stone-400">
                    Matched: {r.matchedTerms.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </WorkflowSubsection>
  );
}
