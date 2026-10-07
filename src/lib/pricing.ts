import { AIModel } from '@/types';

/** Frontend-only mock pricing: base cost x duration factor x resolution factor. */
export function estimateCost(model: AIModel, duration?: string, resolution?: string): number {
  const d = duration ? model.costFactors.duration?.[duration] ?? 1 : 1;
  const r = resolution ? model.costFactors.resolution?.[resolution] ?? 1 : 1;
  return Math.round(model.creditCost * d * r);
}

export function costSummary(model: AIModel, duration?: string, resolution?: string): string {
  return [model.name, model.capabilities.durations ? duration : null, model.capabilities.resolutions ? resolution : null]
    .filter(Boolean)
    .join(' · ');
}
