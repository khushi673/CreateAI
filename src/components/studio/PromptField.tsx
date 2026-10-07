'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AtSign, Music, Film } from 'lucide-react';
import { ReferenceItem } from '@/types';
import { mentionOf } from './helpers';

interface PromptFieldProps {
  value: string;
  onChange: (v: string) => void;
  references: ReferenceItem[];
  /** Called when a reference is chosen from the @ selector so it can be auto-selected */
  onMention: (ref: ReferenceItem) => void;
  rows?: number;
  placeholder?: string;
  autoFocus?: boolean;
}

/** Textarea with an "@" reference selector (mock) — type @ to pick an uploaded reference. */
export const PromptField: React.FC<PromptFieldProps> = ({ value, onChange, references, onMention, rows = 5, placeholder, autoFocus }) => {
  const ta = useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const matches = useMemo(() => {
    if (query === null) return [];
    const q = query.toLowerCase();
    return references.filter((r) => mentionOf(r.name).toLowerCase().includes(q)).slice(0, 6);
  }, [query, references]);

  const detect = (text: string, caret: number) => {
    const before = text.slice(0, caret);
    const m = /(?:^|\s)@(\w*)$/.exec(before);
    setQuery(m ? m[1] : null);
    setActive(0);
  };

  const insert = (ref: ReferenceItem) => {
    const el = ta.current;
    const caret = el?.selectionStart ?? value.length;
    const before = value.slice(0, caret).replace(/@\w*$/, '');
    const after = value.slice(caret);
    const token = `@${mentionOf(ref.name)} `;
    const next = before + token + after;
    onChange(next);
    onMention(ref);
    setQuery(null);
    requestAnimationFrame(() => {
      el?.focus();
      const pos = (before + token).length;
      el?.setSelectionRange(pos, pos);
    });
  };

  const openSelector = () => {
    const el = ta.current;
    if (!el) return;
    const caret = el.selectionStart ?? value.length;
    const needsSpace = caret > 0 && !/\s$/.test(value.slice(0, caret));
    const next = value.slice(0, caret) + (needsSpace ? ' @' : '@') + value.slice(caret);
    onChange(next);
    setQuery('');
    setActive(0);
    requestAnimationFrame(() => {
      el.focus();
      const pos = caret + (needsSpace ? 2 : 1);
      el.setSelectionRange(pos, pos);
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (query === null || matches.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      insert(matches[active]);
    } else if (e.key === 'Escape') {
      setQuery(null);
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={ta}
        rows={rows}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          detect(e.target.value, e.target.selectionStart);
        }}
        onKeyDown={onKeyDown}
        onClick={(e) => detect(value, (e.target as HTMLTextAreaElement).selectionStart)}
        onBlur={() => setTimeout(() => setQuery(null), 150)}
        placeholder={placeholder ?? 'Type what you want to see, e.g. A golden retriever running on a beach at sunset'}
        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 pb-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
      />
      <button
        type="button"
        onClick={openSelector}
        className="absolute left-3 bottom-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-[11px] font-bold text-purple-200 transition-colors"
        title="Insert a reference with @"
      >
        <AtSign className="w-3 h-3" /> Use reference
      </button>
      <span className="absolute right-4 bottom-3 text-[10px] text-zinc-500 font-mono">{value.length} chars</span>

      {query !== null && (
        <div className="absolute left-3 bottom-12 z-30 w-72 max-w-[calc(100%-1.5rem)] rounded-2xl bg-zinc-950 border border-purple-500/40 shadow-2xl p-1.5 animate-fade-in-up" role="listbox">
          <div className="px-2 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Your references</div>
          {matches.length === 0 && <div className="px-2 py-2 text-xs text-zinc-400">No reference matches “@{query}”. Upload one from the References.</div>}
          {matches.map((r, i) => (
            <button
              key={r.id}
              type="button"
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                insert(r);
              }}
              onMouseEnter={() => setActive(i)}
              className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl text-left ${i === active ? 'bg-purple-600/25' : 'hover:bg-zinc-900'}`}
            >
              <span className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0">
                {r.type === 'audio' ? <Music className="w-4 h-4 text-amber-400" /> : r.type === 'video' && !r.thumbnailUrl ? <Film className="w-4 h-4" /> : <img src={r.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-white truncate">@{mentionOf(r.name)}</span>
                <span className="block text-[10px] text-zinc-400 capitalize">{r.type} · {r.tag ?? r.source}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
