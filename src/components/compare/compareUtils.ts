import { AIModel, MediaType } from '@/types';
import { estimateCost } from '@/lib/pricing';

type CompareKey = 'duration' | 'resolution' | 'aspectRatio';
export interface CompareSettings {
  duration: string;
  resolution: string;
  aspectRatio: string;
}

const listFor = (m: AIModel, key: CompareKey): string[] | undefined =>
  key === 'duration' ? m.capabilities.durations : key === 'resolution' ? m.capabilities.resolutions : m.capabilities.aspectRatios;

/** Options supported by ALL selected models; falls back to the union when nothing is shared. */
export function sharedOptions(models: AIModel[], key: CompareKey): { options: string[]; fallback: boolean } {
  const lists = models.map((m) => listFor(m, key)).filter((l): l is string[] => Boolean(l));
  if (!lists.length) return { options: [], fallback: false };
  const inter = lists[0].filter((o) => lists.every((l) => l.includes(o)));
  if (inter.length) return { options: inter, fallback: false };
  const union = Array.from(new Set(lists.flat()));
  return { options: union, fallback: true };
}

/** The value a given model will actually use for a shared setting. */
export function effective(model: AIModel, key: CompareKey, value: string): string {
  const list = listFor(model, key);
  if (!list) return '';
  if (list.includes(value)) return value;
  return list[Math.min(1, list.length - 1)];
}

export function modelCost(model: AIModel, s: CompareSettings): number {
  const d = model.capabilities.durations ? effective(model, 'duration', s.duration) : undefined;
  const r = model.capabilities.resolutions ? effective(model, 'resolution', s.resolution) : undefined;
  return estimateCost(model, d, r);
}

export function caption(model: AIModel, s: CompareSettings): string {
  const d = model.capabilities.durations ? effective(model, 'duration', s.duration).replace('s', ' sec') : null;
  const r = model.capabilities.resolutions ? effective(model, 'resolution', s.resolution) : null;
  return [model.name, d, r].filter(Boolean).join(' · ');
}

export const DEFAULT_IDS: Record<MediaType, string[]> = {
  video: ['kling-4', 'seedance-2-5', 'wan-3'],
  image: ['nano-banana', 'flux-2-pro'],
  audio: [],
};

export const SAMPLE_COMPARE_PROMPTS: Record<MediaType, string[]> = {
  video: [
    'Cinematic dolly shot through a neon-lit futuristic city at night, wet streets, shallow depth of field',
    'Aerial drone flight over glowing lava rivers meeting the ocean at dusk, slow motion mist',
    'Electric hypercar on a coastal highway at sunrise, motion blur, golden reflections',
  ],
  image: [
    'Editorial runway portrait, soft studio light, 85mm, high fashion',
    'Huge modular space station orbiting a ringed gas planet, soft sun flares, concept art',
    'Minimal product still of a perfume bottle on wet black stone, rim light',
  ],
  audio: [],
};
