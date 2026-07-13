import { usePlaySession } from '../../context/PlaySessionContext';
import { BuildPankou } from './BuildPankou';
import { ChoosePankou } from './ChoosePankou';
import { LearnDeconstruct } from './LearnDeconstruct';
import { MatchMeaning } from './MatchMeaning';
import { PlayProgress } from './PlayProgress';
import { ReinterpretJewelry } from './ReinterpretJewelry';
import { ReflectionPanel } from './ReflectionPanel';
import { StartExperience } from './StartExperience';

export function PlayMode() {
  const { step } = usePlaySession();

  return (
    <div>
      {step !== 'start' && <PlayProgress current={step} />}

      {step === 'start' && <StartExperience />}
      {step === 'choose' && <ChoosePankou />}
      {step === 'deconstruct' && <LearnDeconstruct />}
      {step === 'build' && <BuildPankou />}
      {step === 'match' && <MatchMeaning />}
      {step === 'reinterpret' && <ReinterpretJewelry />}
      {step === 'reflection' && <ReflectionPanel />}
    </div>
  );
}
