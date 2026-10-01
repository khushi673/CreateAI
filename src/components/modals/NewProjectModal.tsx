'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, FolderPlus, Tag } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { newProjectModalOpen, setNewProjectModalOpen, createProject, setCurrentScreen, setSelectedProjectDetail } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('Cinematic, 4K, AI Video');

  if (!newProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    const newProj = createProject(name, description, tags);
    setNewProjectModalOpen(false);
    setSelectedProjectDetail(newProj);
    setCurrentScreen('project-detail');
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setNewProjectModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Create New Project Folder</h3>
            <p className="text-xs text-zinc-400">Organize assets by movie, brand campaign, or asset type.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cyberpunk Sci-Fi Short"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the scope, mood board, or target distribution platform..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Tags (comma separated)</label>
            <div className="relative">
              <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Video, 4K, Cyberpunk, Audio Stems"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewProjectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-950"
            >
              Create Project
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
