import { pankouItems } from '../../data/pankouData';
import { SKELETON_TAXONOMY } from '../../data/skeletonTaxonomy';
import { formatStructuralClassification } from '../../data/skeletonTaxonomy';
import { craftBadge, craftCard, craftPanel } from '../ui/craftStyles';

const RESEARCH_QUESTIONS = [
  'Does interactive deconstruction improve structural literacy compared to static annotation?',
  'How do assembly tasks affect understanding of symmetry, path continuity, and closure logic?',
  'Does human-AI jewelry reinterpretation bridge intangible heritage knowledge and contemporary design thinking?',
  'Which Pankou skeleton types are hardest to learn through play-based interaction?',
];

const EVALUATION_METRICS = [
  { name: 'Structural literacy', desc: 'Pre/post quiz on motif, path, skeleton, closure identification' },
  { name: 'Assembly accuracy', desc: 'Symmetry, path continuity, closure logic, cultural match scores' },
  { name: 'Meaning retention', desc: 'Correct cultural meaning matches after play session' },
  { name: 'Reinterpretation quality', desc: 'Expert rating of skeleton fidelity in generated concepts' },
  { name: 'Engagement', desc: 'Time on task, step completion rate, voluntary replays' },
  { name: 'Reflection depth', desc: 'Thematic coding of open reflection responses' },
];

const USER_STUDY_PLAN = [
  { phase: 'Pilot', n: 8, task: 'Think-aloud on full play flow; iterate UI' },
  { phase: 'Controlled study', n: 40, task: 'Play vs. static baseline; pre/post structural quiz' },
  { phase: 'Follow-up', n: 12, task: 'Semi-structured interviews on reinterpretation module' },
];

export function ResearchMode() {
  const pathCounts = pankouItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.pathOrganization] = (acc[item.pathOrganization] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-stone-900">Research Mode</h2>
        <p className="mt-1 max-w-2xl text-stone-600">
          Academic scaffolding for the PankouCraft Play HCI study—not a paper dashboard, but
          structured research metadata alongside the interactive prototype.
        </p>
      </header>

      {/* Dataset metadata */}
      <section className={craftCard}>
        <div className="border-b border-stone-100 px-6 py-4">
          <h3 className="font-semibold text-stone-900">Dataset metadata</h3>
          <p className="text-sm text-stone-500">Haipai Pankou corpus (mock static data)</p>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className={craftPanel}>
            <p className="text-2xl font-bold text-amber-800">{pankouItems.length}</p>
            <p className="text-sm text-stone-600">Specimens</p>
          </div>
          <div className={craftPanel}>
            <p className="text-2xl font-bold text-amber-800">8</p>
            <p className="text-sm text-stone-600">Motif categories</p>
          </div>
          <div className={craftPanel}>
            <p className="text-2xl font-bold text-amber-800">5</p>
            <p className="text-sm text-stone-600">Path organizations</p>
          </div>
          <div className={craftPanel}>
            <p className="text-2xl font-bold text-amber-800">5</p>
            <p className="text-sm text-stone-600">Play-mode specimens</p>
          </div>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="pb-2 pr-4 font-medium">ID</th>
                <th className="pb-2 pr-4 font-medium">Name</th>
                <th className="pb-2 pr-4 font-medium">Motif</th>
                <th className="pb-2 pr-4 font-medium">Skeleton</th>
                <th className="pb-2 font-medium">Path</th>
              </tr>
            </thead>
            <tbody>
              {pankouItems.slice(0, 8).map((item) => (
                <tr key={item.id} className="border-b border-stone-100">
                  <td className="py-2 pr-4 font-mono text-xs">{item.id}</td>
                  <td className="py-2 pr-4">{item.englishName}</td>
                  <td className="py-2 pr-4">{item.motif}</td>
                  <td className="py-2 pr-4">{item.skeletonType}</td>
                  <td className="py-2">{item.pathOrganization}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-stone-400">Showing 8 of {pankouItems.length} records</p>
        </div>
      </section>

      {/* Skeleton classification */}
      <section className={craftCard}>
        <div className="border-b border-stone-100 px-6 py-4">
          <h3 className="font-semibold text-stone-900">Skeleton-based structural classification</h3>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {Object.values(SKELETON_TAXONOMY).map((entry) => (
            <div key={entry.pathOrganization} className={craftPanel}>
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-stone-900">{entry.representativeType}</h4>
                <span className={craftBadge}>{pathCounts[entry.pathOrganization] ?? 0} specimens</span>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                {entry.skeletonType} · {entry.pathOrganization} · {entry.constraintPattern}
              </p>
            </div>
          ))}
        </div>
        {pankouItems[0] && (
          <p className="border-t border-stone-100 px-6 py-4 text-xs text-stone-500">
            Example: {formatStructuralClassification(pankouItems[0])}
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interaction log placeholder */}
        <section className={craftCard}>
          <div className="border-b border-stone-100 px-6 py-4">
            <h3 className="font-semibold text-stone-900">Interaction log</h3>
            <p className="text-sm text-stone-500">Placeholder for session telemetry</p>
          </div>
          <div className="space-y-2 p-6 font-mono text-xs text-stone-500">
            <p>[pending] step_enter: deconstruct</p>
            <p>[pending] part_reveal: symmetry</p>
            <p>[pending] assembly_evaluate: symmetry=82</p>
            <p>[pending] meaning_match: correct=true</p>
            <p>[pending] reinterpret_generate: form=Brooch</p>
            <p className="pt-2 text-stone-400">
              Logs will capture timestamps, specimen ID, scores, and reflection length in the user
              study build.
            </p>
          </div>
        </section>

        {/* User study plan */}
        <section className={craftCard}>
          <div className="border-b border-stone-100 px-6 py-4">
            <h3 className="font-semibold text-stone-900">User study plan</h3>
            <p className="text-sm text-stone-500">Placeholder protocol outline</p>
          </div>
          <ul className="divide-y divide-stone-100 p-6">
            {USER_STUDY_PLAN.map((phase) => (
              <li key={phase.phase} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                <span className={craftBadge}>{phase.phase}</span>
                <div>
                  <p className="text-sm font-medium text-stone-800">n ≈ {phase.n}</p>
                  <p className="text-sm text-stone-600">{phase.task}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Research questions */}
      <section className={craftCard}>
        <div className="border-b border-stone-100 px-6 py-4">
          <h3 className="font-semibold text-stone-900">Research questions</h3>
        </div>
        <ol className="list-decimal space-y-3 p-6 pl-10 text-sm text-stone-700">
          {RESEARCH_QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </section>

      {/* Evaluation metrics */}
      <section className={craftCard}>
        <div className="border-b border-stone-100 px-6 py-4">
          <h3 className="font-semibold text-stone-900">Evaluation metrics</h3>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVALUATION_METRICS.map((m) => (
            <div key={m.name} className={craftPanel}>
              <h4 className="font-medium text-amber-900">{m.name}</h4>
              <p className="mt-1 text-sm text-stone-600">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
