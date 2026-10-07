'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MediaType, ReferenceItem } from '@/types';
import { Image as ImageIcon, Film, Music, Upload, Check, Trash2, Plus, Loader2, Library, ArrowRight, ChevronDown } from 'lucide-react';
import { ConfirmDialog } from '@/components/common/Dialogs';

type Filter = 'all' | 'image' | 'video' | 'audio' | 'uploaded' | 'generated';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
  { id: 'uploaded', label: 'Uploaded by me' },
  { id: 'generated', label: 'From generations' },
];

const TypeIcon: React.FC<{ type: MediaType; className?: string }> = ({ type, className = 'w-3 h-3' }) =>
  type === 'video' ? <Film className={className} /> : type === 'audio' ? <Music className={className} /> : <ImageIcon className={className} />;

export const ReferenceLibraryView: React.FC = () => {
  const {
    references, selectedReferenceIds, toggleReference, removeReference, simulateUpload, clearSelectedReferences,
    generations, addReference, setCurrentScreen, addToast,
  } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [uploading, setUploading] = useState<MediaType | null>(null);
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const [toRemove, setToRemove] = useState<ReferenceItem | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const upload = (type: MediaType) => {
    if (uploading) return;
    setUploading(type);
    setProgress(0);
    let p = 0;
    timer.current = setInterval(() => {
      p += 20;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        simulateUpload(type);
        setUploading(null);
      }
    }, 250);
  };

  const shown = references.filter((r) =>
    filter === 'all' ? true : filter === 'uploaded' || filter === 'generated' ? r.source === filter : r.type === filter
  );
  const selectedCount = selectedReferenceIds.filter((id) => references.some((r) => r.id === id)).length;

  const libraryUrls = new Set(references.map((r) => r.url));
  const candidates = generations.filter((g) => g.status === 'Completed' && !libraryUrls.has(g.mediaUrl));

  const addGenerated = (g: (typeof generations)[number]) => {
    const name = g.title.replace(/[^A-Za-z0-9 ]/g, '').split(' ').slice(0, 2).join('') || 'Generated';
    addReference({ name, type: g.mediaType, url: g.mediaUrl, thumbnailUrl: g.thumbnailUrl, source: 'generated', tag: 'generated' }, false);
    addToast('Added to References', `Use it in prompts with @${name}`, 'success');
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Library className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">References</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/40 text-[11px] font-bold text-purple-200">{selectedCount} selected</span>
            {selectedCount > 0 && (
              <button onClick={clearSelectedReferences} className="text-[11px] text-zinc-400 hover:text-white underline underline-offset-2">Clear</button>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">Images, videos and audio you reuse so people and outfits stay consistent. Type @ in a prompt to use one (e.g. "@Mara wearing @Outfit01").</p>
        </div>
        <div className="relative">
          <button
            disabled={!!uploading}
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload a file <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {menu && (
            <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl z-20 overflow-hidden text-xs font-semibold">
              {([['image', 'Image'], ['video', 'Video'], ['audio', 'Audio']] as [MediaType, string][]).map(([t, label]) => (
                <button key={t} onClick={() => { setMenu(false); upload(t); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-zinc-200 hover:bg-zinc-800 text-left">
                  <TypeIcon type={t} className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {uploading && (
        <div className="p-4 rounded-2xl glass-panel border border-purple-500/30">
          <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
            <span>Uploading {uploading}…</span><span className="font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${filter === f.id ? 'bg-purple-600 border-purple-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-zinc-800 space-y-3">
          <Library className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">{references.length === 0 ? 'No references yet' : 'No references in this filter'}</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">Click Upload a file (top right) to add an image, video or audio clip.</p>
          <button onClick={() => (references.length === 0 ? upload('image') : setFilter('all'))} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">
            {references.length === 0 ? 'Upload an image' : 'Show all'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {shown.map((r) => {
            const sel = selectedReferenceIds.includes(r.id);
            return (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => toggleReference(r.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleReference(r.id))}
                className={`relative rounded-2xl overflow-hidden bg-zinc-900/80 cursor-pointer group transition-all border ${sel ? 'border-purple-500 ring-2 ring-purple-500 shadow-lg shadow-purple-950' : 'border-zinc-800 hover:border-zinc-600'}`}
              >
                <div className="relative aspect-square bg-black overflow-hidden">
                  <img src={r.thumbnailUrl} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 px-1.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white"><TypeIcon type={r.type} /></span>
                  {sel && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-md"><Check className="w-3.5 h-3.5 text-white" /></span>
                  )}
                  <button
                    aria-label={`Remove ${r.name}`}
                    onClick={(e) => { e.stopPropagation(); setToRemove(r); }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 text-zinc-300 hover:bg-red-600 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-2.5 space-y-1.5">
                  <p className="text-xs font-bold text-white truncate">@{r.name}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {r.tag && <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-mono">{r.tag}</span>}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.source === 'uploaded' ? 'bg-sky-500/10 text-sky-300' : 'bg-fuchsia-500/10 text-fuchsia-300'}`}>{r.source === 'uploaded' ? 'Uploaded' : 'Generated'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generated content */}
      <div>
        <h2 className="text-sm font-bold text-white">Add a generation as a reference</h2>
        <p className="text-[11px] text-zinc-400 mb-3">Pick one of your finished generations to reuse it.</p>
        {candidates.length === 0 ? (
          <div className="p-6 text-center rounded-2xl border border-dashed border-zinc-700 text-xs text-zinc-400">
            All your finished generations are already in References.{' '}
            <button onClick={() => setCurrentScreen('create')} className="text-purple-400 hover:text-purple-300 font-bold">Create something new</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {candidates.slice(0, 9).map((g) => (
              <div key={g.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <img src={g.thumbnailUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 bg-black" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{g.title}</p>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1 capitalize"><TypeIcon type={g.mediaType} className="w-2.5 h-2.5" />{g.mediaType} · {g.modelName}</p>
                </div>
                <button onClick={() => addGenerated(g)} className="shrink-0 px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-xl">
        <div className="flex items-center justify-between gap-3 p-3 pl-4 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl">
          <span className="text-xs text-zinc-300">{selectedCount > 0 ? `${selectedCount} reference${selectedCount === 1 ? '' : 's'} ready` : 'Click references above to select them'}</span>
          <button
            onClick={() => setCurrentScreen('create')}
            disabled={selectedCount === 0}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            Use {selectedCount} in Create <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {toRemove && (
        <ConfirmDialog
          title="Remove reference?"
          message={`"@${toRemove.name}" will be removed from your library. Existing generations are not affected.`}
          confirmLabel="Remove"
          onConfirm={() => { removeReference(toRemove.id); addToast('Reference removed', `@${toRemove.name}`, 'info'); }}
          onClose={() => setToRemove(null)}
        />
      )}
    </div>
  );
};
