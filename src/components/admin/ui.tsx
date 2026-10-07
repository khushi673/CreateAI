'use client';

import React from 'react';
import { X, Inbox } from 'lucide-react';

export const inputCls =
  'w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors';
export const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
export const btnGhost =
  'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
export const btnSmall =
  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-bold text-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

export const PageHeader: React.FC<{ title: string; description: string; actions?: React.ReactNode }> = ({ title, description, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-zinc-800">
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h1>
      <p className="text-xs sm:text-sm text-zinc-400 mt-1">{description}</p>
    </div>
    {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
  </div>
);

export const Card: React.FC<{ title?: string; subtitle?: string; right?: React.ReactNode; className?: string; children: React.ReactNode }> = ({ title, subtitle, right, className = '', children }) => (
  <section className={`bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 ${className}`}>
    {(title || right) && (
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          {title && <h2 className="text-sm font-extrabold text-white">{title}</h2>}
          {subtitle && <p className="text-[11px] text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
    )}
    {children}
  </section>
);

const TONES: Record<string, string> = {
  green: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  red: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
  amber: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
  blue: 'bg-sky-950/60 text-sky-300 border-sky-800/60',
  purple: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
  zinc: 'bg-zinc-900 text-zinc-300 border-zinc-700',
};

export const Badge: React.FC<{ tone?: keyof typeof TONES; children: React.ReactNode }> = ({ tone = 'zinc', children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase tracking-wide whitespace-nowrap ${TONES[tone]}`}>{children}</span>
);

export const statusTone = (s: string): keyof typeof TONES => {
  switch (s) {
    case 'Active':
    case 'Completed':
    case 'Approved':
      return 'green';
    case 'Suspended':
    case 'Disabled':
    case 'Failed':
    case 'Rejected':
    case 'Blocked':
      return 'red';
    case 'Beta':
    case 'Pending':
    case 'Queued':
    case 'Under review':
      return 'amber';
    case 'Processing':
      return 'blue';
    default:
      return 'zinc';
  }
};

export const Table: React.FC<{ head: string[]; children: React.ReactNode; empty?: boolean; emptyText?: string }> = ({ head, children, empty, emptyText = 'Nothing to show' }) => (
  <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40">
    <table className="w-full text-left text-xs min-w-[720px]">
      <thead className="bg-zinc-900 text-zinc-500 uppercase text-[10px] tracking-wider">
        <tr>
          {head.map((h) => (
            <th key={h} className="px-4 py-3 font-extrabold whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800/80">{children}</tbody>
    </table>
    {empty && (
      <div className="flex flex-col items-center gap-2 py-12 text-zinc-500">
        <Inbox className="w-7 h-7" />
        <p className="text-xs font-semibold">{emptyText}</p>
      </div>
    )}
  </div>
);

export const Tr: React.FC<{ children: React.ReactNode }> = ({ children }) => <tr className="hover:bg-zinc-800/40 transition-colors">{children}</tr>;
export const Td: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;

export const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }> = ({ title, onClose, children, footer, wide }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
    <div
      role="dialog"
      aria-modal="true"
      className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <h3 className="text-sm font-extrabold text-white">{title}</h3>
        <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5 overflow-y-auto space-y-4">{children}</div>
      {footer && <div className="flex justify-end gap-2 px-5 py-4 border-t border-zinc-800">{footer}</div>}
    </div>
  </div>
);

export const Field: React.FC<{ label: string; hint?: string; error?: string; children: React.ReactNode }> = ({ label, hint, error, children }) => (
  <label className="block space-y-1.5">
    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">{label}</span>
    {children}
    {hint && !error && <span className="block text-[11px] text-zinc-600">{hint}</span>}
    {error && <span className="block text-[11px] text-rose-400 font-semibold">{error}</span>}
  </label>
);

export const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; label?: string }> = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => onChange(!on)}
    className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${on ? 'bg-rose-600' : 'bg-zinc-700'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? 'translate-x-4' : ''}`} />
  </button>
);

export const Stat: React.FC<{ label: string; value: string; sub?: string; icon: React.ReactNode; tone?: string }> = ({ label, value, sub, icon, tone = 'text-rose-400' }) => (
  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
    <div className="flex items-center justify-between text-zinc-500">
      <span className="text-[11px] font-bold uppercase tracking-wide">{label}</span>
      <span className={tone}>{icon}</span>
    </div>
    <div className="text-2xl font-black text-white mt-2">{value}</div>
    {sub && <div className="text-[11px] text-zinc-500 mt-0.5">{sub}</div>}
  </div>
);

export const Avatar: React.FC<{ src: string; name: string; size?: number }> = ({ src, name, size = 32 }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={name} width={size} height={size} style={{ width: size, height: size }} className="rounded-full object-cover bg-zinc-800 shrink-0" />
);

export const money = (n: number) => '$' + Math.round(n).toLocaleString();
export const num = (n: number) => Math.round(n).toLocaleString();

export const Tabs: React.FC<{ tabs: { id: string; label: string; badge?: number }[]; value: string; onChange: (id: string) => void }> = ({ tabs, value, onChange }) => (
  <div role="tablist" className="flex gap-1 flex-wrap border-b border-zinc-800">
    {tabs.map((t) => (
      <button
        key={t.id}
        role="tab"
        aria-selected={value === t.id}
        onClick={() => onChange(t.id)}
        className={`px-3.5 py-2 -mb-px text-xs font-bold border-b-2 transition-colors ${value === t.id ? 'border-rose-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-200'}`}
      >
        {t.label}
        {t.badge ? <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px]">{t.badge}</span> : null}
      </button>
    ))}
  </div>
);
