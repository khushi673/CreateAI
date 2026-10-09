import { AIModel, MediaType } from '@/types';

interface PromptRequest {
  idea: string;
  mediaType: MediaType;
  model: AIModel;
  /** The last prompt in this conversation, used for follow-up edits */
  previous?: { text: string; negative?: string };
}

interface PromptReply {
  text: string;
  prompt?: { text: string; negative?: string };
}

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w));
const clean = (s: string) => s.trim().replace(/[.\s]+$/, '');

function refine(prev: string, ask: string): string {
  const t = ask.toLowerCase();
  if (has(t, 'shorter', 'shorten', 'simpler')) {
    const first = prev.split(/[.]\s/)[0];
    return first.split(' ').slice(0, 22).join(' ');
  }
  if (has(t, 'cinematic')) return `${clean(prev)}, cinematic lighting, anamorphic lens, film grain`;
  if (has(t, 'detail', 'longer')) return `${clean(prev)}, highly detailed textures, sharp focus, rich atmosphere`;
  const remove = /^(remove|without|no)\s+(.+)/i.exec(ask.trim());
  if (remove) return clean(prev.replace(new RegExp(remove[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), '')).replace(/\s{2,}/g, ' ');
  const add = /^(add|with|plus)\s+(.+)/i.exec(ask.trim());
  if (add) return `${clean(prev)}, ${clean(add[2])}`;
  return `${clean(prev)}, ${clean(ask)}`;
}

function build(idea: string, type: MediaType, model: AIModel): { text: string; negative?: string } {
  const base = clean(idea).replace(/^(please\s+)?(can you\s+)?(write|give|create|make|generate)(\s+me)?(\s+a)?(n)?\s+(prompt\s+(for|of|about)\s+)?/i, '') || clean(idea);
  const caps = model.capabilities;
  const extras = (caps.extras ?? []).map((e) => `${e.label}: ${e.default}`).join('. ');
  const negative = caps.negativePrompt ? 'blurry, low quality, distorted anatomy, watermark, text artifacts' : undefined;

  if (type === 'video') {
    const length = caps.durations?.[1] ?? caps.durations?.[0];
    return {
      text: `${base}. Camera: slow tracking shot with smooth, natural motion. Lighting: cinematic, soft contrast. Style: realistic, high detail${extras ? '. ' + extras : ''}${length ? `. Length ${length}` : ''}.`,
      negative,
    };
  }
  if (type === 'audio') {
    const style = caps.audioStyles?.[0];
    return {
      text: `${base}. ${style ? `Style: ${style}. ` : ''}Mood: atmospheric and emotional. Tempo about 90 BPM. Instruments: warm synth pads, soft percussion, light bass. No vocals${caps.durations ? `. Length ${caps.durations[1] ?? caps.durations[0]}` : ''}.`,
    };
  }
  return {
    text: `${base}, shot on an 85mm lens, shallow depth of field, soft natural light, highly detailed, sharp focus${extras ? ', ' + extras.toLowerCase().replace(/\. /g, ', ') : ''}${caps.aspectRatios?.[0] ? `, ${caps.aspectRatios[0]} composition` : ''}`,
    negative,
  };
}

/** Simulated prompt writer: builds a prompt from keywords. No AI runs. */
export function promptReply(req: PromptRequest): PromptReply {
  const idea = req.idea.trim();
  const t = idea.toLowerCase();

  if (/^(hi|hello|hey|help|thanks|thank you)\b/.test(t) || idea.length < 4) {
    return { text: 'I write prompts for the Create page. Describe what you want to make, for example “a golden retriever running on a beach at sunset”, then press “Use this prompt” to send it to Create.' };
  }

  const followUp = req.previous && /^(make it|more|less|shorter|shorten|simpler|longer|add|remove|without|with|plus|change|no)\b/i.test(idea);
  if (followUp && req.previous) {
    return { text: 'Updated the prompt.', prompt: { text: refine(req.previous.text, idea), negative: req.previous.negative } };
  }

  const out = build(idea, req.mediaType, req.model);
  return {
    text: `Here is a ${req.mediaType} prompt written for ${req.model.name}. You can ask me to change it, for example “make it more cinematic” or “add rain”.`,
    prompt: out,
  };
}
