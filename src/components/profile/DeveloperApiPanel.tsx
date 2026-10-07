'use client';

import React, { useState } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Ban, Info, Check } from 'lucide-react';
import { copyText } from '@/lib/clipboard';
import { useApp } from '@/context/AppContext';

export const DeveloperApiPanel: React.FC = () => {
  const { apiKeys, createApiKey, revokeApiKey, addToast } = useApp();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mask = (k: string) => k.slice(0, 8) + '•'.repeat(Math.max(8, k.length - 8));

  const copy = async (id: string, key: string) => {
    if (await copyText(key)) addToast('API key copied', 'Copied to clipboard.', 'success');
    else addToast('Copy not available', 'Select the key and copy it manually.', 'warning');
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> API keys
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Use an API key to connect workflows such as ComfyUI.</p>
          </div>
          <button
            onClick={() => createApiKey()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950 shrink-0"
          >
            <Plus className="w-4 h-4" /> {apiKeys.length === 0 ? 'Create API key' : 'Create new key'}
          </button>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200/90">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-px" />
          <span>Demo only: no real API exists. Keys are generated locally and are not stored or validated anywhere.</span>
        </div>

        {apiKeys.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-800 space-y-2">
            <Key className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-white">No API keys yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((k) => {
              const show = revealed[k.id];
              return (
                <div key={k.id} className={`p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3 transition-opacity ${k.revoked ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{k.name}</p>
                      <p className="text-[10px] text-zinc-500">Created {k.createdAt}</p>
                    </div>
                    {k.revoked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">Revoked</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">Active</span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <code className={`flex-1 min-w-0 truncate bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono text-purple-300 ${k.revoked ? 'line-through' : ''}`}>
                      {show ? k.key : mask(k.key)}
                    </code>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))}
                        className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {show ? 'Hide' : 'Reveal'}
                      </button>
                      <button
                        onClick={() => copy(k.id, k.key)}
                        className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy
                      </button>
                      <button
                        onClick={() => revokeApiKey(k.id)}
                        disabled={k.revoked}
                        className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/50 text-rose-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Ban className="w-3.5 h-3.5" /> Revoke
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
