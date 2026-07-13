import { craftButton, craftCard, craftPanel } from '../ui/craftStyles';
import { usePlaySession } from '../../context/PlaySessionContext';

export function StartExperience() {
  const { setStep } = usePlaySession();

  return (
    <section className={`${craftCard} overflow-hidden`}>
      <div className="grid gap-0 md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-10">
          <span className="mb-3 text-sm font-medium uppercase tracking-wider text-amber-700">
            Intangible Heritage Craft
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-stone-900">
            Learn Pankou through play
          </h2>
          <p className="mb-4 leading-relaxed text-stone-600">
            <strong className="text-stone-800">Pankou</strong> (盘扣) are traditional Chinese
            garment fasteners—hand-wrapped cord knots that close qipao and cheongsam while carrying
            decorative motifs and cultural symbolism.
          </p>
          <p className="mb-6 leading-relaxed text-stone-600">
            In PankouCraft Play, you observe specimens, deconstruct their structure, assemble
            components, match cultural meanings, and reinterpret craft knowledge into jewelry
            concepts—with human-AI collaboration as a learning tool, not a product shop.
          </p>
          <button type="button" className={craftButton} onClick={() => setStep('choose')}>
            Start Craft Journey →
          </button>
        </div>

        <div className={`${craftPanel} m-4 flex flex-col justify-center gap-4 md:m-6`}>
          <h3 className="text-sm font-semibold text-amber-900">What you will do</h3>
          <ul className="space-y-3 text-sm text-stone-700">
            <li className="flex gap-2">
              <span className="text-amber-600">①</span>
              Choose a Pankou specimen and read its craft metadata
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">②</span>
              Click to deconstruct motif, path, skeleton, and closure
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">③</span>
              Drag-and-drop assembly with structural feedback
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">④</span>
              Match types to cultural meanings, then reinterpret as jewelry
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
