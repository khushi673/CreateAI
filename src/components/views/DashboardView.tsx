'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  Wand2, 
  Zap, 
  Plus, 
  FolderKanban, 
  History, 
  Crown, 
  Play, 
  ArrowRight,
  Star,
  Download,
  FolderPlus,
  RotateCcw,
  Film,
  Image as ImageIcon,
  Music
} from 'lucide-react';
import { AI_MODELS } from '@/data/mockData';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    setCurrentScreen, 
    generations, 
    projects, 
    setSelectedModel, 
    setMediaType,
    setPrompt,
    useAsReference,
    setTargetAssetForProject,
    setSaveToProjectModalOpen,
    setAssetDetailModalItem,
    setBuyCreditsModalOpen,
    setNewProjectModalOpen
  } = useApp();

  const handleLaunchModel = (modelId: string) => {
    const model = AI_MODELS.find((m) => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setMediaType(model.mediaTypes[0]);
    }
    setCurrentScreen('create');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-indigo-950/80 border border-purple-800/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-900/90 text-purple-300 border border-purple-700/50 uppercase tracking-wider">
                <Crown className="w-3 h-3 text-amber-400 inline mr-1" /> {user.plan} Account Active
              </span>
              <span className="text-xs text-zinc-400">• Member since {user.memberSince}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
              You have <strong className="text-amber-400">{user.credits} credits</strong> remaining. Ready to synthesize next-gen Kling AI v1.5 video?
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setBuyCreditsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>Buy Credits</span>
            </button>
            <button
              onClick={() => setCurrentScreen('create')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-950"
            >
              <Wand2 className="w-4 h-4" />
              Open Create Studio
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white">Quick Prompt Launcher</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Type your prompt here (e.g., Cyberpunk rain walk, 4k ultra realistic Kling video)..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPrompt(e.currentTarget.value);
                setCurrentScreen('create');
              }
            }}
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => setCurrentScreen('create')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 transition-all shadow-md shadow-purple-950 flex items-center justify-center gap-1.5"
          >
            <Wand2 className="w-4 h-4" />
            Generate Now
          </button>
        </div>
      </div>

      {/* AI Models Roster */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Choose AI Generation Engine</h2>
            <p className="text-xs text-zinc-400">Available models for video synthesis, photo rendering & sound stem generation.</p>
          </div>
          <button
            onClick={() => setCurrentScreen('create')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            Explore Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_MODELS.map((model) => (
            <div
              key={model.id}
              onClick={() => handleLaunchModel(model.id)}
              className="p-5 rounded-2xl glass-card border border-zinc-800/80 hover:border-purple-500/50 cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{model.icon}</span>
                  <div className="flex items-center gap-2">
                    {model.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-800">
                        {model.badge}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-amber-400">
                      ⚡ {model.creditCost} Credits
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {model.name}
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono mb-2">{model.provider} • {model.version}</p>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {model.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Rating {model.rating}★</span>
                <span className="text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                  Launch →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Generations Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Your Recent Generations</h2>
            <p className="text-xs text-zinc-400">Access your rendered videos, photos, and soundtrack stems.</p>
          </div>
          <button
            onClick={() => setCurrentScreen('history')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            View Full History ({generations.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generations.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div 
                onClick={() => setAssetDetailModalItem(item)}
                className="relative aspect-video bg-black cursor-pointer overflow-hidden"
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Media Type Icon Badge */}
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

              {/* Asset Info & Quick Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white truncate mb-1">{item.title}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{item.prompt}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-1 text-xs">
                  <button
                    onClick={() => useAsReference(item)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-purple-900/50 text-zinc-300 hover:text-purple-300 transition-colors"
                    title="Use as Reference"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setTargetAssetForProject(item);
                      setSaveToProjectModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-purple-900/50 text-zinc-300 hover:text-purple-300 transition-colors"
                    title="Save to Project"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setAssetDetailModalItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white text-[11px] font-bold transition-colors"
                  >
                    Inspect Asset
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Active Projects & Libraries</h2>
            <p className="text-xs text-zinc-400">Organized campaign folders and commercial film assets.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNewProjectModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-purple-400 font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New Project
            </button>
            <button
              onClick={() => setCurrentScreen('projects')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 ml-2"
            >
              All Projects ({projects.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                useApp().setSelectedProjectDetail(proj);
                setCurrentScreen('project-detail');
              }}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-purple-500/40 cursor-pointer transition-all flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-black">
                <img src={proj.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-white group-hover:text-purple-300 truncate">{proj.name}</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">{proj.itemCount} Media Assets</p>
                <div className="flex items-center gap-1 mt-2">
                  {proj.tags.slice(0, 2).map((t, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
