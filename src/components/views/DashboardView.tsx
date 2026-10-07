'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Wand2,
  Film,
  Image as ImageIcon,
  Music,
  Megaphone,
  FolderKanban,
  AlertTriangle,
} from 'lucide-react';

const TAG_STYLES: Record<string, string> = {
  'New Model': 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800/60',
  Update: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
  Announcement: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
  Tip: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
};

export const DashboardView: React.FC = () => {
  const {
    user,
    setCurrentScreen,
    generations,
    projects,
    newsItems,
    setSelectedProjectDetail,
    openResult,
  } = useApp();

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome back, {user.name}</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">News, recent generations and your projects.</p>
      </div>

      {/* Get started */}
      <div className="rounded-2xl glass-panel border border-zinc-800 p-4 space-y-3">
        <h2 className="text-sm font-bold text-white">Get started</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-300">
          {[
            ['Create', 'pick a model and describe what you want'],
            ['Check the cost', 'shown before you generate'],
            ['Find it in History', 'download, re-run or save to a project'],
          ].map(([title, text], i) => (
            <li key={title} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span><b className="text-white">{title}</b> — {text}</span>
            </li>
          ))}
        </ol>
        <button
          onClick={() => setCurrentScreen('create')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
        >
          <Wand2 className="w-4 h-4" /> Open Create
        </button>
      </div>

      {/* News board */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Megaphone className="w-4 h-4 text-purple-400" /> News & updates
        </h2>
        {newsItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl glass-panel border border-zinc-800 text-xs text-zinc-400">
            No news yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.map((n) => (
              <article key={n.id} className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden hover:border-purple-500/40 transition-all flex flex-col">
                <div className="relative h-24 bg-black">
                  <img src={n.image} alt="" className="w-full h-full object-cover opacity-90" />
                  <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${TAG_STYLES[n.tag] ?? TAG_STYLES.Update}`}>
                    {n.tag}
                  </span>
                </div>
                <div className="p-3 flex-1">
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-zinc-500 mt-2">{n.date}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Recent generations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recent generations</h2>
          </div>
        </div>

        {generations.length === 0 ? (
          <div className="p-10 text-center rounded-2xl glass-panel border border-zinc-800 space-y-3">
            <Wand2 className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">You have not generated anything yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {generations.slice(0, 4).map((item) => {
              const bad = item.status !== 'Completed';
              return (
                <button
                  key={item.id}
                  onClick={() => openResult(item)}
                  className="text-left rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden group hover:border-purple-500/40 transition-all"
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${bad ? 'grayscale opacity-40' : ''}`}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-[10px] font-bold text-white flex items-center gap-1">
                      {item.mediaType === 'video' && <Film className="w-3 h-3 text-purple-400" />}
                      {item.mediaType === 'audio' && <Music className="w-3 h-3 text-amber-400" />}
                      {item.mediaType === 'image' && <ImageIcon className="w-3 h-3 text-emerald-400" />}
                      <span className="capitalize">{item.mediaType}</span>
                    </div>
                    {bad && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="px-2 py-1 rounded-lg bg-rose-950/90 border border-rose-700/60 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {item.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                      {item.modelName} · {item.date}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Projects */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Projects</h2>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-10 text-center rounded-2xl glass-panel border border-zinc-800 space-y-3">
            <FolderKanban className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No projects yet. Create one to organize your work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => {
                  setSelectedProjectDetail(proj);
                  setCurrentScreen('project-detail');
                }}
                className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-purple-500/40 text-left transition-all flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-black">
                  <img src={proj.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-white group-hover:text-purple-300 truncate">{proj.name}</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{proj.itemCount} assets · updated {proj.updatedAt}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {proj.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
