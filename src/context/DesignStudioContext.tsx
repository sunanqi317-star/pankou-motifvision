import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSelectedSpecimen } from './SelectedSpecimenContext';
import type { JewelryConcept, LoRAJewelrySettings } from '../types';
import {
  type CulturalEmphasis,
  defaultEmphasisForSpecimen,
  generateDesignStatement,
  structureStrategyForLevel,
} from '../utils/culturalFramework';
import {
  type CloudSdStatus,
  generateCloudSdImage,
  getCloudSdEndpoint,
} from '../utils/cloudSd';
import {
  COLOR_PALETTES,
  DEFAULT_NEGATIVE_PROMPT,
  type VariationPreset,
  VARIATION_PRESETS,
  buildPositivePrompt,
  formatPromptForClipboard,
  generateJewelryConcept,
} from '../utils/loraJewelry';

const DEFAULT_TRIGGERS = 'pankou_jewelry_lora, haipai_pankou_style';

interface DesignStudioContextValue {
  jewelryType: string;
  setJewelryType: (value: string) => void;
  material: string;
  setMaterial: (value: string) => void;
  style: string;
  setStyle: (value: string) => void;
  colorPalette: string;
  setColorPalette: (value: string) => void;
  culturalEmphasis: CulturalEmphasis;
  setCulturalEmphasis: (value: CulturalEmphasis) => void;
  structurePreservationLevel: number;
  setStructurePreservationLevel: (value: number) => void;
  preservationLabel: string;
  variation: VariationPreset;
  setVariation: (value: VariationPreset) => void;
  loraWeight: number;
  setLoraWeight: (value: number) => void;
  triggerWords: string;
  setTriggerWords: (value: string) => void;
  imageSize: string;
  setImageSize: (value: string) => void;
  cfgScale: number;
  setCfgScale: (value: number) => void;
  steps: number;
  setSteps: (value: number) => void;
  sampler: string;
  setSampler: (value: string) => void;
  seed: string;
  setSeed: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  concept: JewelryConcept | null;
  isGeneratingConcept: boolean;
  generateConcept: () => void;
  livePrompt: string;
  designStatement: string;
  settings: LoRAJewelrySettings;
  cloudStatus: CloudSdStatus;
  cloudError: string | null;
  generatedImageUrl: string | null;
  generateImage: () => Promise<void>;
  copyStatus: 'idle' | 'copied';
  copyPrompt: () => Promise<void>;
  clearOutputs: () => void;
}

const DesignStudioContext = createContext<DesignStudioContextValue | null>(null);

export function DesignStudioProvider({ children }: { children: ReactNode }) {
  const { selectedSpecimen } = useSelectedSpecimen();
  const cloudSdEndpoint = getCloudSdEndpoint();

  const [jewelryType, setJewelryType] = useState('Pendant Necklace');
  const [material, setMaterial] = useState('Pearl + Silver');
  const [style, setStyle] = useState('Contemporary Oriental');
  const [colorPalette, setColorPalette] = useState<string>(COLOR_PALETTES[0]);
  const [culturalEmphasis, setCulturalEmphasis] = useState<CulturalEmphasis>('Auspicious Blessing');
  const [structurePreservationLevel, setStructurePreservationLevel] = useState(4);
  const [variation, setVariationState] = useState<VariationPreset>('contemporary-jewelry');
  const [triggerWords, setTriggerWords] = useState(DEFAULT_TRIGGERS);
  const [loraWeight, setLoraWeight] = useState(0.7);
  const [imageSize, setImageSize] = useState('1024x1024');
  const [cfgScale, setCfgScale] = useState(7);
  const [steps, setSteps] = useState(28);
  const [sampler, setSampler] = useState('DPM++ 2M Karras');
  const [seed, setSeed] = useState('-1');
  const [negativePrompt, setNegativePrompt] = useState(DEFAULT_NEGATIVE_PROMPT);
  const [concept, setConcept] = useState<JewelryConcept | null>(null);
  const [isGeneratingConcept, setIsGeneratingConcept] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [cloudStatus, setCloudStatus] = useState<CloudSdStatus>(
    cloudSdEndpoint ? 'ready' : 'not_configured',
  );
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const structureStrategy = useMemo(
    () => structureStrategyForLevel(structurePreservationLevel),
    [structurePreservationLevel],
  );

  const preservationLabel = useMemo(() => {
    const entry = (
      [
        { level: 1, label: 'Symbolic inspiration only' },
        { level: 2, label: 'Keep general silhouette' },
        { level: 3, label: 'Preserve symmetry' },
        { level: 4, label: 'Preserve skeleton logic' },
        { level: 5, label: 'Preserve original Pankou skeleton' },
      ] as const
    ).find((l) => l.level === structurePreservationLevel);
    return entry?.label ?? 'Preserve skeleton logic';
  }, [structurePreservationLevel]);

  const settings = useMemo(
    () => ({ triggerWords, loraWeight, imageSize, cfgScale, steps, negativePrompt }),
    [triggerWords, loraWeight, imageSize, cfgScale, steps, negativePrompt],
  );

  const designOptions = useMemo(
    () => ({
      jewelryType,
      style,
      material,
      colorPalette,
      emotion: selectedSpecimen.emotionalTone,
      structureStrategy,
      culturalEmphasis,
      structurePreservationLevel,
      generationDirection: variation,
    }),
    [
      jewelryType,
      style,
      material,
      colorPalette,
      structureStrategy,
      culturalEmphasis,
      structurePreservationLevel,
      variation,
      selectedSpecimen.emotionalTone,
    ],
  );

  const livePrompt = useMemo(
    () => buildPositivePrompt(selectedSpecimen, designOptions, settings),
    [selectedSpecimen, designOptions, settings],
  );

  const designStatement = useMemo(
    () =>
      generateDesignStatement(
        selectedSpecimen,
        culturalEmphasis,
        jewelryType,
        material,
        colorPalette,
        structurePreservationLevel,
        variation,
      ),
    [
      selectedSpecimen,
      culturalEmphasis,
      jewelryType,
      material,
      colorPalette,
      structurePreservationLevel,
      variation,
    ],
  );

  const clearOutputs = useCallback(() => {
    setConcept(null);
    setGeneratedImageUrl(null);
    setCloudError(null);
    setCloudStatus(cloudSdEndpoint ? 'ready' : 'not_configured');
  }, [cloudSdEndpoint]);

  const setVariation = useCallback(
    (next: VariationPreset) => {
      const preset = VARIATION_PRESETS[next];
      setVariationState(next);
      setStyle(preset.style);
      clearOutputs();
    },
    [clearOutputs],
  );

  useEffect(() => {
    setCulturalEmphasis(defaultEmphasisForSpecimen(selectedSpecimen));
    clearOutputs();
  }, [selectedSpecimen.id, clearOutputs]);

  const generateConcept = useCallback(() => {
    setIsGeneratingConcept(true);
    setCloudError(null);
    window.setTimeout(() => {
      const generated = generateJewelryConcept(selectedSpecimen, designOptions, settings);
      setConcept({
        ...generated,
        designStatement,
      });
      setGeneratedImageUrl(null);
      setIsGeneratingConcept(false);
      if (cloudSdEndpoint) setCloudStatus('ready');
    }, 520);
  }, [selectedSpecimen, designOptions, settings, designStatement, cloudSdEndpoint]);

  const generateImage = useCallback(async () => {
    if (!concept) return;
    if (!cloudSdEndpoint) {
      setCloudStatus('not_configured');
      setCloudError('Cloud SD is not configured. Use prompt output or configure the backend API.');
      return;
    }
    setCloudStatus('generating');
    setCloudError(null);
    try {
      const result = await generateCloudSdImage(cloudSdEndpoint, {
        positivePrompt: concept.positivePrompt,
        negativePrompt: concept.negativePrompt,
        imageSize: settings.imageSize,
        cfgScale: settings.cfgScale,
        steps: settings.steps,
        loraWeight: settings.loraWeight,
      });
      setGeneratedImageUrl(result.imageDataUrl);
      setCloudStatus('generated');
    } catch (error) {
      setCloudStatus('error');
      setCloudError(error instanceof Error ? error.message : 'Generation failed.');
    }
  }, [concept, cloudSdEndpoint, settings]);

  const copyPrompt = useCallback(async () => {
    const promptSource = concept ?? {
      positivePrompt: livePrompt,
      negativePrompt: settings.negativePrompt,
    };
    if (!promptSource.positivePrompt) return;
    try {
      const text = concept
        ? formatPromptForClipboard(concept, settings)
        : `POSITIVE:\n${livePrompt}\n\nNEGATIVE:\n${settings.negativePrompt}`;
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('idle');
    }
  }, [concept, livePrompt, settings]);

  const value = useMemo<DesignStudioContextValue>(
    () => ({
      jewelryType,
      setJewelryType: (v) => {
        setJewelryType(v);
        clearOutputs();
      },
      material,
      setMaterial: (v) => {
        setMaterial(v);
        clearOutputs();
      },
      style,
      setStyle: (v) => {
        setStyle(v);
        clearOutputs();
      },
      colorPalette,
      setColorPalette: (v) => {
        setColorPalette(v);
        clearOutputs();
      },
      culturalEmphasis,
      setCulturalEmphasis: (v) => {
        setCulturalEmphasis(v);
        clearOutputs();
      },
      structurePreservationLevel,
      setStructurePreservationLevel: (v) => {
        setStructurePreservationLevel(v);
        clearOutputs();
      },
      preservationLabel,
      variation,
      setVariation,
      loraWeight,
      setLoraWeight: (v) => {
        setLoraWeight(v);
        clearOutputs();
      },
      triggerWords,
      setTriggerWords: (v) => {
        setTriggerWords(v);
        clearOutputs();
      },
      imageSize,
      setImageSize: (v) => {
        setImageSize(v);
        clearOutputs();
      },
      cfgScale,
      setCfgScale: (v) => {
        setCfgScale(v);
        clearOutputs();
      },
      steps,
      setSteps: (v) => {
        setSteps(v);
        clearOutputs();
      },
      sampler,
      setSampler,
      seed,
      setSeed,
      negativePrompt,
      setNegativePrompt: (v) => {
        setNegativePrompt(v);
        clearOutputs();
      },
      concept,
      isGeneratingConcept,
      generateConcept,
      livePrompt,
      designStatement,
      settings,
      cloudStatus,
      cloudError,
      generatedImageUrl,
      generateImage,
      copyStatus,
      copyPrompt,
      clearOutputs,
    }),
    [
      jewelryType,
      material,
      style,
      colorPalette,
      culturalEmphasis,
      structurePreservationLevel,
      preservationLabel,
      variation,
      setVariation,
      loraWeight,
      triggerWords,
      imageSize,
      cfgScale,
      steps,
      sampler,
      seed,
      negativePrompt,
      concept,
      isGeneratingConcept,
      generateConcept,
      livePrompt,
      designStatement,
      settings,
      cloudStatus,
      cloudError,
      generatedImageUrl,
      generateImage,
      copyStatus,
      copyPrompt,
      clearOutputs,
    ],
  );

  return <DesignStudioContext.Provider value={value}>{children}</DesignStudioContext.Provider>;
}

export function useDesignStudio(): DesignStudioContextValue {
  const ctx = useContext(DesignStudioContext);
  if (!ctx) throw new Error('useDesignStudio must be used within DesignStudioProvider');
  return ctx;
}
