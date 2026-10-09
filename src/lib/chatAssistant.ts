import { ChatAction, MediaType } from '@/types';

export interface ChatContextInfo {
  credits: number;
  generationCount: number;
  projectNames: string[];
  /** Cheapest active model of a type and what one default generation costs */
  estimate: (type: MediaType) => { modelName: string; cost: number } | null;
}

export interface ChatReply {
  text: string;
  actions?: ChatAction[];
}

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w));

/** Simulated assistant: picks a canned answer by keyword. No AI runs. */
export function chatReply(input: string, info: ChatContextInfo): ChatReply {
  const t = input.toLowerCase();

  const type: MediaType | null = has(t, 'video', 'clip', 'animate', 'movie') ? 'video' : has(t, 'song', 'music', 'audio', 'sound', 'beat') ? 'audio' : has(t, 'image', 'picture', 'photo', 'portrait', 'draw', 'illustration', 'logo') ? 'image' : null;
  const wantsCreate = has(t, 'generate', 'create', 'make', 'draw', 'design', 'produce', 'render');

  if (type && wantsCreate) {
    const e = info.estimate(type);
    const prompt = input.replace(/^(please\s+)?(can you\s+)?(generate|create|make|draw|design|produce|render)\s+(me\s+)?(an?\s+)?/i, '').trim() || input;
    return {
      text: e
        ? `I can make that ${type}. With ${e.modelName} it would cost about ${e.cost} credits. You can generate it now, or open Create to change the model and settings first.`
        : `I can make that ${type}, but no model is available for it right now.`,
      actions: e
        ? [
            { kind: 'generate', label: `Generate now · ${e.cost} credits`, mediaType: type, prompt },
            { kind: 'create', label: 'Open in Create', mediaType: type, prompt },
          ]
        : undefined,
    };
  }

  if (has(t, 'credit', 'balance', 'cost', 'price', 'pricing', 'how much')) {
    return {
      text: `You have ${info.credits.toLocaleString()} credits. Each generation shows its cost before you start. Failed generations are refunded automatically.`,
      actions: [{ kind: 'open', label: 'Open Credits & plans', screen: 'credits' }],
    };
  }

  if (has(t, 'history', 'last', 'previous', 'recent', 'my generation')) {
    return {
      text: info.generationCount ? `You have ${info.generationCount} generations. Open History to download, re-run or save any of them.` : 'You have not generated anything yet. Try asking me to make an image.',
      actions: [{ kind: 'open', label: 'Open History', screen: 'history' }],
    };
  }

  if (has(t, 'project', 'folder')) {
    return {
      text: info.projectNames.length ? `Your projects: ${info.projectNames.join(', ')}. Each project can have folders, for example one per outfit or scene.` : 'You have no projects yet. A project groups your work into folders.',
      actions: [{ kind: 'open', label: 'Open Projects', screen: 'projects' }],
    };
  }

  if (has(t, 'compare', 'which model', 'best model', 'difference')) {
    return {
      text: 'Compare runs one prompt on two or three models side by side, so you can pick the best result and see what each one costs.',
      actions: [{ kind: 'open', label: 'Open Compare models', screen: 'compare' }],
    };
  }

  if (has(t, 'reference', 'consistent', 'character', 'outfit', 'face')) {
    return {
      text: 'To keep a person or outfit consistent, add them as references and type @ in your prompt to use them. Models that accept several references work best.',
      actions: [{ kind: 'open', label: 'Open References', screen: 'references' }],
    };
  }

  if (has(t, 'prompt', 'tip', 'improve', 'better')) {
    return {
      text: 'A good prompt names the subject, the setting, the camera and the lighting. For example: "A woman in a red coat walking through a neon-lit street at night, slow tracking shot, shallow depth of field."',
    };
  }

  if (has(t, 'hello', 'hi', 'hey', 'help', 'what can you')) {
    return {
      text: 'I can answer questions, help write prompts, and make images, video or audio for you. Try: "Generate an image of a golden retriever on a beach".',
    };
  }

  return {
    text: 'Here is a short answer based on what you asked. In this demo the replies are simulated, but you can ask me to generate an image, video or audio and I will set it up for you.',
  };
}
