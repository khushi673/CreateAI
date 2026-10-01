'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, 
  Folder, 
  Film, 
  Image as ImageIcon, 
  Music, 
  Download, 
  Sparkles, 
  Plus,
  Share2,
  Trash2
} from 'lucide-react';

export const ProjectDetailView: React.FC = () => {
  const { 
    selectedProjectDetail, 
    setCurrentScreen, 
    useAsReference, 
    setAssetDetailModalItem,
    addToast
  } = useApp();

  if (!selectedProjectDetail) {
    return (
      <div className="p-12 text-center">
        <p className="text-zinc-400">No project selected.</p>
        <button
          onClick={() => setCurrentScreen('projects')}
          className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const proj = selectedProjectDetail;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentScreen('projects')}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Projects Library
      </button>

      {/* Project Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-indigo-950/80 border border-purple-800/40 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-purple-500/50 bg-black shadow-lg">
            <img src={proj.coverImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Folder className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono text-purple-300">Project Bin #{proj.id}</span>
            </div>
            <h1 className="text-2xl font-black text-white">{proj.name}</h1>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl">{proj.description}</p>
            <div className="flex items-center gap-2 mt-3">
              {proj.tags.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 font-mono border border-purple-800/60">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Project Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => addToast('Export Started', `Downloading full zip archive for "${proj.name}"`, 'success')}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" /> Export ZIP
          </button>

          <button
            onClick={() => setCurrentScreen('create')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-purple-950"
          >
            <Plus className="w-4 h-4" /> Add Assets
          </button>
        </div>

      </div>

      {/* Project Assets Grid */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Assets inside this Project ({proj.items.length})</h2>

        {proj.items.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl border border-zinc-800 space-y-3">
            <Folder className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">This Project Bin is Empty</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Generate new videos or images in the Create Studio and click "Save to Project".
            </p>
            <button
              onClick={() => setCurrentScreen('create')}
              className="mt-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
            >
              Generate New Asset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proj.items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-xl"
              >
                {/* Media Preview Box */}
                <div 
                  onClick={() => setAssetDetailModalItem(item)}
                  className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                    {item.mediaType === 'video' && <Film className="w-3 h-3 text-purple-400" />}
                    {item.mediaType === 'audio' && <Music className="w-3 h-3 text-amber-400" />}
                    {item.mediaType === 'image' && <ImageIcon className="w-3 h-3 text-emerald-400" />}
                    <span className="capitalize">{item.mediaType}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white truncate mb-1">{item.title}</h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{item.prompt}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-1 text-xs">
                    <button
                      onClick={() => useAsReference(item)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-[11px] font-bold transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Reference
                    </button>
                    <button
                      onClick={() => setAssetDetailModalItem(item)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition-colors"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
