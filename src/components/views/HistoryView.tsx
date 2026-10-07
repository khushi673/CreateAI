'use client';

import React, { useMemo, useState } from 'react';
import { GenerationActions } from '@/components/common/GenerationActions';
import { useApp } from '@/context/AppContext';
import {
  History,
  Search,
  Film,
  Image as ImageIcon,
  Music,
  Eye,
  FolderKanban,
  MoreHorizontal,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { GenerationItem } from '@/types';

type Tab = 'all' | 'image' | 'video' | 'audio' | 'projects';

export const HistoryView: React.FC = () => {
  const {
    generations,
    projects,
    openResult,
    setCurrentScreen,
  } = useApp();

  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [openMore, setOpenMore] = useState<string | null>(null);

  const projectName = (id?: string) => projects.find((p) => p.id === id)?.name;

  const counts = useMemo(
    () => ({
      all: generations.length,
      image: generations.filter((g) => g.mediaType === 'image').length,
      video: generations.filter((g) => g.mediaType === 'video').length,
      audio: generations.filter((g) => g.mediaType === 'audio').length,
      projects: generations.filter((g) => g.projectId && projectName(g.projectId)).length,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generations, projects]
  );

  const q = query.trim().toLowerCase();
  const filtered = generations.filter((g) => {
    const pName = projectName(g.projectId);
    if (tab === 'projects' && !pName) return false;
    if ((tab === 'image' || tab === 'video' || tab === 'audio') && g.mediaType !== tab) return false;
    if (!q) return true;
    return [g.title, g.prompt, g.modelName, pName ?? ''].some((s) => s.toLowerCase().includes(q));
  });

  const tabs: { id: Tab; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All' },
    { id: 'image', label: 'Images', icon: <ImageIcon className="w-3.5 h-3.5 text-emerald-300" /> },
    { id: 'video', label: 'Videos', icon: <Film className="w-3.5 h-3.5 text-purple-300" /> },
    { id: 'audio', label: 'Audio', icon: <Music className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-3.5 h-3.5 text-fuchsia-300" /> },
  ];

  // In the Projects tab, group by project
  const groups: { key: string; name: string | null; items: GenerationItem[] }[] =
    tab === 'projects'
      ? projects
          .map((p) => ({ key: p.id, name: p.name, items: filtered.filter((g) => g.projectId === p.id) }))
          .filter((g) => g.items.length > 0)
      : [{ key: 'all', name: null, items: filtered }];

  const renderCard = (item: GenerationItem) => {
    const failed = item.status === 'Failed';
    const blocked = item.status === 'Blocked';
    const bad = failed || blocked;
    const pName = projectName(item.projectId);
    return (
      <div
        key={item.id}
        className={`rounded-2xl bg-zinc-900/80 border overflow-hidden group transition-all flex flex-col shadow-xl ${
          failed ? 'border-rose-900/70' : blocked ? 'border-amber-900/60' : 'border-zinc-800 hover:border-purple-500/40'
        }`}
      >
        <div onClick={() => openResult(item)} className="relative aspect-video bg-black cursor-pointer overflow-hidden">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${bad ? 'grayscale opacity-40' : ''}`}
          />
          {bad && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center px-3">
              {failed ? <AlertTriangle className="w-6 h-6 text-rose-400" /> : <ShieldAlert className="w-6 h-6 text-amber-400" />}
              <span className={`text-xs font-bold ${failed ? 'text-rose-300' : 'text-amber-300'}`}>
                {failed ? 'Generation failed' : 'Blocked by content rules'}
              </span>
            </div>
          )}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
            {item.mediaType === 'video' && <Film className="w-3 h-3 text-purple-400" />}
            {item.mediaType === 'audio' && <Music className="w-3 h-3 text-amber-400" />}
            {item.mediaType === 'image' && <ImageIcon className="w-3 h-3 text-emerald-400" />}
            <span className="capitalize">{item.mediaType}</span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mt-1">{item.prompt}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[10px] text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-bold">{item.modelName}</span>
              <span>{item.date}</span>
              {pName && (
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-fuchsia-300 flex items-center gap-1">
                  <FolderKanban className="w-3 h-3" /> {pName}
                </span>
              )}
            </div>
            <div className="mt-2 text-[11px] font-mono">
              {failed ? (
                <span className="text-emerald-400 font-bold">Refunded{item.creditsUsed > 0 ? ` · +${item.creditsUsed} credits` : ''}</span>
              ) : blocked ? (
                <span className="text-zinc-400">No credits charged</span>
              ) : (
                <span className="text-amber-400">{item.creditsUsed} credits</span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 space-y-2">
            <div className="flex gap-2">
              <button onClick={() => openResult(item)} className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"><Eye className="w-3.5 h-3.5" /> Open</button>
              <button
                title="More actions"
                aria-label="More actions"
                aria-expanded={openMore === item.id}
                onClick={() => setOpenMore(openMore === item.id ? null : item.id)}
                className="px-3 rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              ><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            {openMore === item.id && (
              <div className="grid grid-cols-4 gap-1.5">
                <GenerationActions item={item} variant="icon" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">History</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Everything you have generated. Open an item to download it, re-run it or save it to a project.</p>
        </div>

        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-semibold overflow-x-auto max-w-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                tab === t.id ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.icon}
              {t.label}
              <span className="text-[10px] opacity-70">{counts[t.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, prompt, model or project"
          className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-zinc-800 space-y-3">
          <History className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">{generations.length === 0 ? 'Nothing here yet' : 'No results found'}</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {generations.length === 0
              ? 'Create your first image, video or audio and it will show up here.'
              : 'Try a different search or filter.'}
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {(q || tab !== 'all') && (
              <button
                onClick={() => {
                  setQuery('');
                  setTab('all');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold"
              >
                Clear filters
              </button>
            )}
            <button onClick={() => setCurrentScreen('create')} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">
              Create your first generation
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.key} className="space-y-3">
              {g.name && (
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-fuchsia-400" /> {g.name}
                  <span className="text-[10px] font-normal text-zinc-500">{g.items.length} generations</span>
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{g.items.map(renderCard)}</div>
            </section>
          ))}
        </div>
      )}

    </div>
  );
};

