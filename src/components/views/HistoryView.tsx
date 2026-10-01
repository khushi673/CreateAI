'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  History, 
  Search, 
  Film, 
  Image as ImageIcon, 
  Music, 
  Download, 
  FolderPlus, 
  RotateCcw, 
  Filter, 
  Trash2,
  Eye
} from 'lucide-react';
import { MediaType } from '@/types';

export const HistoryView: React.FC = () => {
  const { 
    generations, 
    useAsReference, 
    setTargetAssetForProject, 
    setSaveToProjectModalOpen, 
    setAssetDetailModalItem,
    addToast
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | MediaType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGenerations = generations.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.mediaType === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.modelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Generation History</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Browse, inspect, reuse, or download your past generated videos, images, and audio assets.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'all' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({generations.length})
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              activeFilter === 'video' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-purple-300" />
            Videos
          </button>
          <button
            onClick={() => setActiveFilter('image')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              activeFilter === 'image' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
            Images
          </button>
          <button
            onClick={() => setActiveFilter('audio')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              activeFilter === 'audio' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-amber-300" />
            Audio
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history by prompt, model name, or tag..."
          className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* History Grid */}
      {filteredGenerations.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-zinc-800 space-y-3">
          <History className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Generations Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search query or media filter tab above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGenerations.map((item) => (
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

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-800 text-[10px] font-bold">
                  {item.modelName}
                </div>
              </div>

              {/* Asset Info & Action Bar */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                    <span>{item.createdAt}</span>
                    <span className="font-mono text-purple-400">⚡ {item.creditsUsed} Credits</span>
                  </div>
                  <h3 className="text-xs font-bold text-white truncate mb-1">{item.title}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{item.prompt}</p>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-1 text-xs">
                  <button
                    onClick={() => useAsReference(item)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reference
                  </button>

                  <button
                    onClick={() => {
                      setTargetAssetForProject(item);
                      setSaveToProjectModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Save to Project"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setAssetDetailModalItem(item)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Inspect Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => addToast('Download Started', `Downloading ${item.title}`, 'info')}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
