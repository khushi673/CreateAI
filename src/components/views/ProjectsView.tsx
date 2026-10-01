'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { FolderKanban, Plus, Folder, Tag, ArrowRight } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, setNewProjectModalOpen, setSelectedProjectDetail, setCurrentScreen } = useApp();

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Projects & Libraries</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Organize assets into custom bins, campaign folders, and commercial production projects.
          </p>
        </div>

        <button
          onClick={() => setNewProjectModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-950"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => {
              setSelectedProjectDetail(proj);
              setCurrentScreen('project-detail');
            }}
            className="rounded-3xl glass-card border border-zinc-800/80 hover:border-purple-500/50 cursor-pointer transition-all group overflow-hidden flex flex-col justify-between shadow-xl"
          >
            {/* Cover Image Banner */}
            <div className="relative h-40 bg-black overflow-hidden">
              <img
                src={proj.coverImage}
                alt={proj.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-extrabold text-purple-300 border border-purple-500/30">
                  {proj.itemCount} Media Assets
                </span>
                <span className="text-[10px] text-zinc-400">Updated {proj.updatedAt}</span>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                  {proj.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-300 font-mono border border-zinc-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>View Project Bin</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
