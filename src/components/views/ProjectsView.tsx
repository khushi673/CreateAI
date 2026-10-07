'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { FolderKanban, Plus, Search, Pencil, Trash2, Folder } from 'lucide-react';
import { Project } from '@/types';
import { ConfirmDialog, TextPromptDialog } from '@/components/common/Dialogs';

export const ProjectsView: React.FC = () => {
  const { projects, setNewProjectModalOpen, setSelectedProjectDetail, setCurrentScreen, deleteProject, renameProject } = useApp();
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [toRename, setToRename] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => [p.name, p.description, ...p.tags].join(' ').toLowerCase().includes(q));
  }, [projects, query]);

  const open = (p: Project) => {
    setSelectedProjectDetail(p);
    setCurrentScreen('project-detail');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Projects</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Group your work. Each project can have folders, e.g. Characters, Outfit 1, Scene 1.</p>
        </div>
        <button
          onClick={() => setNewProjectModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-950"
        >
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-zinc-800 space-y-3">
          <Folder className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">{projects.length === 0 ? 'No projects yet' : 'No projects match your search'}</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {projects.length === 0 ? 'Create a project, then add folders such as Characters or Scene 1 to keep your generations tidy.' : 'Try a different keyword or clear the search.'}
          </p>
          <button
            onClick={() => (projects.length === 0 ? setNewProjectModalOpen(true) : setQuery(''))}
            className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
          >
            {projects.length === 0 ? 'Create your first project' : 'Clear search'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => open(proj)}
              className="rounded-3xl glass-card border border-zinc-800/80 hover:border-purple-500/50 cursor-pointer transition-all group overflow-hidden flex flex-col shadow-xl"
            >
              <div className="relative h-40 bg-black overflow-hidden">
                <img src={proj.coverImage} alt={proj.name} className="w-full h-full object-cover " />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    aria-label="Rename project"
                    onClick={(e) => {
                      e.stopPropagation();
                      setToRename(proj);
                    }}
                    className="p-2 rounded-lg bg-black/70 backdrop-blur-md text-zinc-200 hover:text-white hover:bg-purple-600 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    aria-label="Delete project"
                    onClick={(e) => {
                      e.stopPropagation();
                      setToDelete(proj);
                    }}
                    className="p-2 rounded-lg bg-black/70 backdrop-blur-md text-zinc-200 hover:text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-extrabold text-purple-300 border border-purple-500/30">
                    {proj.itemCount} generations
                  </span>
                  <span className="text-[10px] text-zinc-400">Updated {proj.updatedAt}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-1">{proj.name}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">{proj.description}</p>
                  <p className="flex items-center gap-1 text-[11px] text-zinc-500 mb-3"><Folder className="w-3 h-3" /> {proj.folders.length} {proj.folders.length === 1 ? 'folder' : 'folders'}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-300 font-mono border border-zinc-800">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete project?"
          message={`"${toDelete.name}" and its folders will be removed. Your generations stay in History.`}
          confirmLabel="Delete project"
          onConfirm={() => deleteProject(toDelete.id)}
          onClose={() => setToDelete(null)}
        />
      )}
      {toRename && (
        <TextPromptDialog
          title="Rename project"
          label="Project name"
          initial={toRename.name}
          onSubmit={(v) => renameProject(toRename.id, v)}
          onClose={() => setToRename(null)}
        />
      )}
    </div>
  );
};
