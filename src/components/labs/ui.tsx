'use client';

import React from 'react';
import { FlaskConical } from 'lucide-react';

export const DemoBadge: React.FC<{ label?: string; className?: string }> = ({ label = 'Demo feature', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] font-bold uppercase tracking-wider ${className}`}
  >
    <FlaskConical className="w-3 h-3" />
    {label}
  </span>
);

export const PageHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ icon, title, subtitle, badge, actions }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        {icon}
        <h1 className="text-xl sm:text-2xl font-black text-white">{title}</h1>
        {badge}
      </div>
      <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{subtitle}</p>
    </div>
    {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
  </div>
);

export const chip = (active: boolean) =>
  `px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
    active
      ? 'bg-purple-600/20 border-purple-500/60 text-purple-200'
      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
  }`;

export const inputCls =
  'w-full bg-zinc-950/70 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/60';

export const primaryBtn =
  'px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-950/60 disabled:opacity-50 disabled:cursor-not-allowed';

export const ghostBtn =
  'px-3 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed';

