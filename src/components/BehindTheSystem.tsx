import { CollapsiblePanel } from './CollapsiblePanel';
import { PortfolioSection } from './PortfolioSection';

export function BehindTheSystem() {
  return (
    <PortfolioSection id="behind-system" title="Behind the System" tone="warm">
      <div className="space-y-3">
        <CollapsiblePanel
          title="Research Basis"
          summary="Cultural gene source: visual form, structural skeleton, and cultural semantics."
        >
          <p className="text-sm leading-relaxed text-stone-700 lg:text-base">
            This prototype follows the framework From Cultural Gene to Generative Design. The core
            layer treats each Haipai Pankou as a cultural gene composed of visual form (motif and
            structure), structural skeleton (axis, bilateral, radial, loop, or modular logic), and
            cultural semantics (symbolic meaning and emphasis). These three elements supply the
            interpretive source for jewelry generation.
          </p>
        </CollapsiblePanel>

        <CollapsiblePanel
          title="Translation Logic"
          summary="Seven-dimensional metadata, label mapping, and skeleton extraction."
        >
          <p className="text-sm leading-relaxed text-stone-700 lg:text-base">
            The processing layer translates specimen metadata into a cultural profile. Seven
            dimensions (form, craft, material, color, composition, motif semantics, structural skeleton)
            provide structured labels for interpretation. Skeleton extraction aligns path organization
            and constraint patterns with wearable structure strategies. Cultural emphasis chips let
            users steer how symbolic reading enters the design brief.
          </p>
        </CollapsiblePanel>

        <CollapsiblePanel
          title="LoRA Generation"
          summary="How cultural tags and structure constraints become jewelry prompts."
        >
          <p className="text-sm leading-relaxed text-stone-700 lg:text-base">
            The application layer encodes cultural profile selections as LoRA-ready prompts for
            pankou02. Jewelry type, material and color style, design style, structure preservation
            level, and generation direction shape the positive prompt. Cultural emphasis and skeleton
            constraints keep generative output tied to heritage metadata rather than generic ornament.
          </p>
        </CollapsiblePanel>
      </div>
    </PortfolioSection>
  );
}
