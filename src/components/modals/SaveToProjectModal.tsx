'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, FolderPlus, Folder, Plus, Check } from 'lucide-react';

export const SaveToProjectModal: React.FC = () => {
  const { 
    saveToProjectModalOpen, 
    setSaveToProjectModalOpen, 
    targetAssetForProject, 
    projects, 
    saveToProject,
    setNewProjectModalOpen
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');

  if (!saveToProjectModalOpen || !targetAssetForProject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setSaveToProjectModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Save Generation to Project</h3>
            <p className="text-xs text-zinc-400 line-clamp-1">{targetAssetForProject.title}</p>
          </div>
        </div>

        {/* Asset Thumbnail Preview */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 mb-5">
          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-black">
            <img src={targetAssetForProject.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="text-xs min-w-0">
            <p className="font-semibold text-white truncate">{targetAssetForProject.title}</p>
            <p className="text-[11px] text-purple-400 font-mono mt-0.5">{targetAssetForProject.modelName}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{targetAssetForProject.aspectRatio} • {targetAssetForProject.resolution || 'Standard'}</p>
          </div>
        </div>

        {/* Select Project List */}
        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
          {projects.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 text-white'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-purple-400' : 'text-zinc-400'}`} />
                  <div className="truncate">
                    <p className="text-xs font-bold truncate">{proj.name}</p>
                    <p className="text-[10px] text-zinc-400">{proj.itemCount} items</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={() => {
              setSaveToProjectModalOpen(false);
              setNewProjectModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>

          <button
            onClick={() => saveToProject(targetAssetForProject.id, selectedProjectId)}
            disabled={!selectedProjectId}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-950 disabled:opacity-50"
          >
            Save Asset
          </button>
        </div>

      </div>
    </div>
  );
};
