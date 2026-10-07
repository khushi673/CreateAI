'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, FolderPlus, Folder, Plus, Check, CornerDownRight } from 'lucide-react';
import { ProjectFolder } from '@/types';

const flatten = (folders: ProjectFolder[], parentId: string | null = null, depth = 0): { folder: ProjectFolder; depth: number }[] =>
  folders.filter((f) => f.parentId === parentId).flatMap((f) => [{ folder: f, depth }, ...flatten(folders, f.id, depth + 1)]);

export const SaveToProjectModal: React.FC = () => {
  const { saveToProjectModalOpen, setSaveToProjectModalOpen, targetAssetForProject, projects, saveToProject, setNewProjectModalOpen } = useApp();
  const [projectId, setProjectId] = useState<string>('');
  const [folderId, setFolderId] = useState<string | null>(null);

  if (!saveToProjectModalOpen || !targetAssetForProject) return null;

  const selectedId = projects.some((p) => p.id === projectId) ? projectId : projects[0]?.id ?? '';
  const selected = projects.find((p) => p.id === selectedId);
  const tree = selected ? flatten(selected.folders) : [];
  const activeFolder = folderId && selected?.folders.some((f) => f.id === folderId) ? folderId : null;
  const close = () => setSaveToProjectModalOpen(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={close}>
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} aria-label="Close" className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div className="min-w-0 pr-6">
            <h3 className="text-base font-bold text-white">Save to project</h3>
            <p className="text-xs text-zinc-400">Choose a project, then a folder inside it.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 mb-5">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-black">
            <img src={targetAssetForProject.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="text-xs min-w-0">
            <p className="font-semibold text-white truncate">{targetAssetForProject.title}</p>
            <p className="text-[11px] text-purple-400 font-mono mt-0.5">{targetAssetForProject.modelName}</p>
          </div>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">1. Project</p>
        {projects.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-zinc-700 text-center text-xs text-zinc-400 mb-5">
            No projects yet. Click New project below to create one.
          </div>
        ) : (
          <div className="space-y-2 mb-5 max-h-40 overflow-y-auto pr-1">
            {projects.map((proj) => {
              const isSel = selectedId === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    setProjectId(proj.id);
                    setFolderId(null);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${isSel ? 'bg-purple-950/40 border-purple-500 text-white' : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Folder className={`w-4 h-4 shrink-0 ${isSel ? 'text-purple-400' : 'text-zinc-400'}`} />
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{proj.name}</p>
                      <p className="text-[10px] text-zinc-400">{proj.itemCount} generations · {proj.folders.length} folders</p>
                    </div>
                  </div>
                  {isSel && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {selected && (
          <>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">2. Folder (optional)</p>
            <div className="space-y-1 mb-5 max-h-40 overflow-y-auto pr-1">
              {[{ id: null as string | null, name: 'Project (no folder)', depth: 0 }, ...tree.map((t) => ({ id: t.folder.id as string | null, name: t.folder.name, depth: t.depth + 1 }))].map((o) => {
                const isSel = activeFolder === o.id;
                return (
                  <button
                    key={o.id ?? 'root'}
                    onClick={() => setFolderId(o.id)}
                    style={{ paddingLeft: 12 + o.depth * 14 }}
                    className={`w-full flex items-center justify-between pr-3 py-2 rounded-lg border text-xs text-left transition-colors ${isSel ? 'bg-purple-950/40 border-purple-500 text-white' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}
                  >
                    <span className="flex items-center gap-2">
                      {o.depth > 0 ? <CornerDownRight className="w-3 h-3 text-zinc-500" /> : <Folder className="w-3.5 h-3.5 text-zinc-400" />}
                      {o.name}
                    </span>
                    {isSel && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                );
              })}
              {tree.length === 0 && <p className="text-[10px] text-zinc-500 px-1">No folders in this project. It will be saved in the project itself.</p>}
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={() => {
              setSaveToProjectModalOpen(false);
              setNewProjectModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 transition-colors"
          >
            <Plus className="w-4 h-4" /> New project
          </button>
          <button
            onClick={() => saveToProject(targetAssetForProject.id, selectedId, activeFolder)}
            disabled={!selectedId}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-950 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
