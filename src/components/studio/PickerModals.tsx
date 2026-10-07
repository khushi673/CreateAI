'use client';

import React, { useState } from 'react';
import { Check, Film, Image as ImageIcon, Loader2, Music, Upload } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MediaType } from '@/types';
import { ModalShell } from '@/components/common/ModalShell';
import { mentionOf } from './helpers';

const TYPE_TABS: { id: MediaType; label: string; icon: React.ElementType }[] = [
  { id: 'image', label: 'Images', icon: ImageIcon },
  { id: 'video', label: 'Videos', icon: Film },
  { id: 'audio', label: 'Audio', icon: Music },
];

/** References picker: select / upload (simulated) references for the current generation. */
export const ReferencePickerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { references, selectedReferenceIds, toggleReference, simulateUpload, selectedModel, setCurrentScreen, removeReference } = useApp();
  const [tab, setTab] = useState<MediaType>(selectedModel.mediaTypes.includes('audio') ? 'audio' : 'image');
  const [uploading, setUploading] = useState(false);
  const caps = selectedModel.capabilities;

  const supported = (t: MediaType) => (t === 'image' ? caps.maxReferenceImages > 0 : t === 'audio' ? Boolean(caps.referenceAudio) : false);
  const list = references.filter((r) => r.type === tab);

  const upload = () => {
    setUploading(true);
    setTimeout(() => {
      simulateUpload(tab);
      setUploading(false);
    }, 900);
  };

  return (
    <ModalShell
      title="References"
      subtitle={`${selectedModel.name} accepts ${caps.maxReferenceImages > 0 ? `up to ${caps.maxReferenceImages} reference images` : 'no reference images'}${caps.referenceAudio ? ' and a reference audio track' : ''}.`}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              setCurrentScreen('references');
            }}
            className="text-xs font-semibold text-purple-300 hover:text-white"
          >
            Open References →
          </button>
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">
            Done · {selectedReferenceIds.length} selected
          </button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          {TYPE_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${tab === t.id ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={upload}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-purple-400" />}
          {uploading ? 'Uploading…' : `Upload ${tab}`}
        </button>
      </div>

      {!supported(tab) && (
        <div className="mb-3 p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
          {selectedModel.name} doesn’t use {tab} references. You can still keep them in your library.
        </div>
      )}

      {list.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-800 rounded-2xl">
          No {tab} references yet. Use “Upload {tab}” to add one.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {list.map((r) => {
            const selected = selectedReferenceIds.includes(r.id);
            return (
              <div key={r.id} className="relative group">
                <button
                  onClick={() => toggleReference(r.id)}
                  className={`w-full rounded-2xl overflow-hidden border text-left transition-all ${selected ? 'border-purple-500 ring-2 ring-purple-500/60' : 'border-zinc-800 hover:border-zinc-600'}`}
                >
                  <div className="aspect-square bg-zinc-900 relative">
                    {r.type === 'audio' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-950/60 to-zinc-900">
                        <Music className="w-8 h-8 text-amber-400" />
                      </div>
                    ) : (
                      <img src={r.thumbnailUrl} alt={r.name} className="w-full h-full object-cover" />
                    )}
                    {selected && (
                      <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </span>
                    )}
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-zinc-200 capitalize">{r.source}</span>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-bold text-white truncate">@{mentionOf(r.name)}</p>
                    <p className="text-[10px] text-zinc-400 capitalize">{r.tag ?? r.type}</p>
                  </div>
                </button>
                <button
                  onClick={() => removeReference(r.id)}
                  className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-rose-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ModalShell>
  );
};

/** Start/End frame picker: choose from the library, past generations, or a simulated upload. */
export const FramePickerModal: React.FC<{ title: string; onPick: (url: string) => void; onClose: () => void }> = ({ title, onPick, onClose }) => {
  const { references, generations, addReference, addToast } = useApp();
  const [uploading, setUploading] = useState(false);

  const libraryImages = references.filter((r) => r.type === 'image');
  const generated = generations.filter((g) => g.status === 'Completed' && g.mediaType !== 'audio');

  const upload = () => {
    setUploading(true);
    setTimeout(() => {
      const samples = generated.filter((g) => g.mediaType === 'image');
      const url = (samples[Math.floor(Math.random() * samples.length)] ?? libraryImages[0])?.thumbnailUrl;
      if (url) {
        addReference({ name: `Frame${Date.now() % 1000}`, type: 'image', url, thumbnailUrl: url, source: 'uploaded', tag: 'frame' }, false);
        addToast('Upload complete', 'Image added to References', 'success');
        onPick(url);
      }
      setUploading(false);
    }, 900);
  };

  return (
    <ModalShell title={title} subtitle="Choose an image or upload a new one." onClose={onClose} size="lg">
      <div className="flex justify-end mb-4">
        <button onClick={upload} disabled={uploading} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white disabled:opacity-60">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
      </div>

      <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">References</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
        {libraryImages.map((r) => (
          <button key={r.id} onClick={() => onPick(r.url)} className="rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500 transition-colors text-left">
            <img src={r.thumbnailUrl} alt={r.name} className="aspect-square w-full object-cover" />
            <span className="block px-2 py-1 text-[10px] font-bold text-zinc-300 truncate">@{mentionOf(r.name)}</span>
          </button>
        ))}
      </div>

      <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Generations</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {generated.map((g) => (
          <button key={g.id} onClick={() => onPick(g.thumbnailUrl)} className="rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500 transition-colors text-left">
            <div className="aspect-square relative">
              <img src={g.thumbnailUrl} alt={g.title} className="w-full h-full object-cover" />
              {g.mediaType === 'video' && <span className="absolute top-1 right-1 px-1 rounded bg-black/70 text-[9px] font-bold text-white">frame</span>}
            </div>
            <span className="block px-2 py-1 text-[10px] text-zinc-400 truncate">{g.title}</span>
          </button>
        ))}
      </div>
    </ModalShell>
  );
};
