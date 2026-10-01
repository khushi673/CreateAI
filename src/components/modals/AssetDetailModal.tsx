'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Download, 
  Sparkles, 
  FolderPlus, 
  Copy, 
  RotateCcw, 
  Heart, 
  Film, 
  Image as ImageIcon, 
  Music,
  Share2
} from 'lucide-react';

export const AssetDetailModal: React.FC = () => {
  const { 
    assetDetailModalItem, 
    setAssetDetailModalItem, 
    useAsReference, 
    setSaveToProjectModalOpen,
    setTargetAssetForProject,
    addToast
  } = useApp();

  if (!assetDetailModalItem) return null;

  const item = assetDetailModalItem;
  const isVideo = item.mediaType === 'video';
  const isAudio = item.mediaType === 'audio';

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    addToast('Prompt Copied', 'Copied full prompt text to clipboard', 'success');
  };

  const handleDownload = () => {
    addToast('Download Started', `Downloading ${item.title} (${item.resolution || 'HD'})...`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row gap-6">
        
        {/* Close Button */}
        <button
          onClick={() => setAssetDetailModalItem(null)}
          className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900/80 border border-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Player Column */}
        <div className="md:w-1/2 flex flex-col items-center justify-center bg-black/60 rounded-2xl border border-zinc-800/80 p-4 relative overflow-hidden min-h-[300px]">
          {isVideo ? (
            <video
              src={item.mediaUrl}
              poster={item.thumbnailUrl}
              controls
              autoPlay
              loop
              playsInline
              className="max-h-[70vh] w-full object-contain rounded-xl shadow-2xl"
            />
          ) : isAudio ? (
            <div className="w-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl animate-pulse">
                <Music className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm font-bold text-white">{item.title}</p>
              <audio src={item.mediaUrl} controls className="w-full mt-2" />
            </div>
          ) : (
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="max-h-[70vh] w-full object-contain rounded-xl shadow-2xl"
            />
          )}

          {/* Media Type Tag */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 backdrop-blur-md text-[11px] font-semibold text-zinc-200 flex items-center gap-1.5">
            {isVideo && <Film className="w-3.5 h-3.5 text-purple-400" />}
            {isAudio && <Music className="w-3.5 h-3.5 text-amber-400" />}
            {!isVideo && !isAudio && <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="capitalize">{item.mediaType}</span>
          </div>
        </div>

        {/* Detail Meta & Actions Column */}
        <div className="md:w-1/2 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            
            {/* Title & Model */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-800/60">
                  {item.modelName}
                </span>
                <span className="text-[11px] text-zinc-400">{item.createdAt}</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-snug">{item.title}</h2>
            </div>

            {/* Prompt Box */}
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Generation Prompt</span>
                <button
                  onClick={handleCopyPrompt}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans select-all">{item.prompt}</p>
              {item.negativePrompt && (
                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Negative Prompt: </span>
                  <span className="text-[11px] text-zinc-400">{item.negativePrompt}</span>
                </div>
              )}
            </div>

            {/* Metadata Parameters Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Aspect Ratio</span>
                <span className="font-semibold text-white">{item.aspectRatio}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Resolution / Quality</span>
                <span className="font-semibold text-white">{item.resolution || '1080p HD'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Seed Number</span>
                <span className="font-mono text-purple-300 font-semibold">{item.seed || 'Auto'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Credits Spent</span>
                <span className="font-bold text-amber-400">⚡ {item.creditsUsed} Credits</span>
              </div>
            </div>

          </div>

          {/* Core Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setAssetDetailModalItem(null);
                  useAsReference(item);
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-950"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Use as Reference
              </button>

              <button
                onClick={() => {
                  setTargetAssetForProject(item);
                  setAssetDetailModalItem(null);
                  setSaveToProjectModalOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <FolderPlus className="w-3.5 h-3.5 text-purple-400" />
                Save to Project
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleDownload}
                className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                onClick={() => {
                  setAssetDetailModalItem(null);
                  useAsReference(item);
                }}
                className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Re-generate
              </button>
              <button
                onClick={() => addToast('Link Copied', 'Public link copied to clipboard', 'info')}
                className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
