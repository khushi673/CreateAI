'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert, LayoutDashboard, Users, Coins, Layers, Cpu, Activity, TrendingUp, Megaphone, LogOut, Menu, X,
} from 'lucide-react';

export type AdminPageId = 'dashboard' | 'users' | 'credits' | 'subscriptions' | 'models' | 'monitoring' | 'analytics' | 'announcements';

const ADMIN_NAV: { id: AdminPageId; label: string; icon: React.ElementType; group: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Summary' },
  { id: 'users', label: 'Users', icon: Users, group: 'Manage' },
  { id: 'credits', label: 'Credits', icon: Coins, group: 'Manage' },
  { id: 'subscriptions', label: 'Subscriptions', icon: Layers, group: 'Manage' },
  { id: 'models', label: 'Models', icon: Cpu, group: 'Manage' },
  { id: 'monitoring', label: 'Generations', icon: Activity, group: 'Activity' },
  { id: 'analytics', label: 'Cost vs revenue', icon: TrendingUp, group: 'Operations' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, group: 'Messages' },
];

interface Props {
  page: AdminPageId;
  onNavigate: (p: AdminPageId) => void;
  children: React.ReactNode;
}

export const AdminShell: React.FC<Props> = ({ page, onNavigate, children }) => {
  const { logout } = useApp();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const current = ADMIN_NAV.find((n) => n.id === page);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const go = (id: AdminPageId) => {
    onNavigate(id);
    setDrawer(false);
    window.scrollTo({ top: 0 });
  };

  const groups = Array.from(new Set(ADMIN_NAV.map((n) => n.group)));

  const nav = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 h-16 border-b border-zinc-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-950">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-extrabold text-sm text-white leading-tight">AetherGen Admin</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Superadmin</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((g) => (
          <div key={g}>
            <div className="px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-zinc-600">{g}</div>
            {ADMIN_NAV.filter((n) => n.group === g).map((n) => {
              const Icon = n.icon;
              const active = n.id === page;
              return (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    active ? 'bg-rose-600/15 text-rose-300 border border-rose-800/60' : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {n.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-zinc-800 shrink-0">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-950/50 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
        <p className="px-3 pt-2 text-[10px] text-zinc-600">Prototype with mock data</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-600 selection:text-white">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800 z-30">{nav}</aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <aside className="relative w-72 max-w-[85%] bg-zinc-950 border-r border-zinc-800">
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute top-4 right-3 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
              <X className="w-4 h-4" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="lg:hidden sticky top-0 z-20 h-14 flex items-center gap-3 px-4 sm:px-6 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
          <button onClick={() => setDrawer(true)} aria-label="Open menu" className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Menu className="w-4 h-4" />
          </button>
          <div className="text-sm font-extrabold text-white truncate">{current?.label}</div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full">{children}</main>
      </div>
    </div>
  );
};
