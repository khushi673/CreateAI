'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AIModel } from '@/types';
import { ChevronDown, Check } from 'lucide-react';

interface ModelSelectProps {
  models: AIModel[];
  value: AIModel;
  onChange: (m: AIModel) => void;
}

/** Dropdown model picker — models are never listed inline on the page. */
export const ModelSelect: React.FC<ModelSelectProps> = ({ models, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/60 transition-colors text-left"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-lg shrink-0">{value.icon}</span>
          <span className="min-w-0">
            <span className="block text-sm font-extrabold text-white truncate">{value.name}</span>
            <span className="block text-[11px] text-zinc-400 truncate">{value.provider} · {value.supports.join(' · ')}</span>
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul role="listbox" className="absolute z-30 mt-2 w-full max-h-80 overflow-y-auto rounded-2xl bg-zinc-950 border border-zinc-700 shadow-2xl p-1.5 animate-fade-in-up">
          {models.map((m) => {
            const selected = m.id === value.id;
            return (
              <li key={m.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(m);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${selected ? 'bg-purple-600/20' : 'hover:bg-zinc-900'}`}
                >
                  <span className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-base shrink-0">{m.icon}</span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{m.name}</span>
                      {m.status === 'Beta' && <span className="text-[9px] font-bold px-1.5 rounded bg-amber-900/60 text-amber-200">BETA</span>}
                    </span>
                    <span className="block text-[11px] text-zinc-400 truncate">{m.provider} · from {m.creditCost} credits</span>
                  </span>
                  {selected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                </button>
              </li>
            );
          })}
          {models.length === 0 && <li className="p-3 text-xs text-zinc-400">No models available for this type.</li>}
        </ul>
      )}
    </div>
  );
};
