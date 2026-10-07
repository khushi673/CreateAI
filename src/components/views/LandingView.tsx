'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Wand2, Check } from 'lucide-react';

const POINTS = [
  'Create images, video and audio from a text prompt',
  'Compare models side by side on the same prompt',
  'Keep your work organised in projects and history',
];

export const LandingView: React.FC = () => {
  const { setCurrentScreen } = useApp();

  return (
    <div className="min-h-[calc(100vh-65px)] bg-zinc-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-10 max-w-xl text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
          Create images, video and audio <span className="gradient-text">from a text prompt</span>
        </h1>
        <ul className="space-y-2 text-sm text-zinc-300 inline-block text-left">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
        <div>
          <button
            onClick={() => setCurrentScreen('create')}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-purple-950/60 inline-flex items-center gap-2"
          >
            <Wand2 className="w-5 h-5" /> Start creating
          </button>
        </div>
      </div>
    </div>
  );
};
