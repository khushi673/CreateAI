'use client';

import React, { useEffect, useState } from 'react';
import { Palette, Check, X } from 'lucide-react';

/** Colour themes defined in globals.css (html[data-theme="..."]). '' = original purple. */
const THEMES = [
  { id: 'gennook', name: 'GenNook Fresh', note: 'Light · matches the logo', colors: ['#F1F7F6', '#06515A', '#F9B51B'] },
  { id: 'sunset', name: 'Cozy Sunset', note: 'Warm light · playful', colors: ['#FFF6EE', '#F04B37', '#FB910B'] },
  { id: 'ocean', name: 'Ocean Glass', note: 'Dark · glowing glass', colors: ['#070C1A', '#3559F0', '#22D3EE'] },
  { id: 'lavender', name: 'Lavender Cloud', note: 'Pastel light · dreamy', colors: ['#F4F0FF', '#8B6CF6', '#6EE4C3'] },
  { id: '', name: 'Original', note: 'Current prototype', colors: ['#09090B', '#9333EA', '#D946EF'] },
];

const STORAGE_KEY = 'prototype-theme';

function applyTheme(id: string) {
  if (id) document.documentElement.dataset.theme = id;
  else delete document.documentElement.dataset.theme;
}

function readInitialTheme(): string {
  if (typeof window === 'undefined') return '';
  const fromUrl = new URLSearchParams(window.location.search).get('theme');
  let saved: string | null = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch {}
  return [fromUrl, saved].find((t) => t !== null && THEMES.some((x) => x.id === t)) ?? '';
}

/** Floating picker so the client can compare colour palettes on the real screens. Also accepts ?theme=<id>. */
export const ThemeSwitcher: React.FC = () => {
  const [open, setOpen] = useState(false);
  // Safe to read on first render: the list that shows the selection only renders after a click.
  const [theme, setTheme] = useState(readInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const choose = (id: string) => {
    setTheme(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
  };

  return (
    <div className="fixed bottom-5 left-20 z-50">
      {open && (
        <div className="mb-3 w-64 rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl p-3 shadow-2xl animate-fade-in-up">
          <div className="flex items-center justify-between px-1 pb-2">
            <p className="text-sm font-semibold text-white">Colour theme</p>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {THEMES.map((t) => (
              <button
                key={t.id || 'original'}
                onClick={() => choose(t.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                  theme === t.id ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'
                }`}
              >
                <span className="flex -space-x-1.5">
                  {t.colors.map((c) => (
                    <span key={c} className="w-5 h-5 rounded-full border-2 border-zinc-900" style={{ background: c }} />
                  ))}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-medium text-white">{t.name}</span>
                  <span className="block text-[11px] text-zinc-500">{t.note}</span>
                </span>
                {theme === t.id && <Check className="w-4 h-4 text-purple-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 backdrop-blur px-3.5 py-2 text-xs font-medium text-zinc-200 shadow-lg hover:border-purple-500/60 hover:text-white"
      >
        <Palette className="w-4 h-4 text-purple-400" /> Colour theme
      </button>
    </div>
  );
};
