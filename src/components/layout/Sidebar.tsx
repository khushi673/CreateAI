'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ViewScreen } from '@/types';
import {
  LayoutDashboard,
  Wand2,
  History,
  FolderKanban,
  Zap,
  Settings,
  Columns3,
  MessageSquare,
  Library,
  Users,
  X,
} from 'lucide-react';

interface NavItem {
  id: ViewScreen;
  label: string;
  icon: React.ElementType;
  color?: string;
  /** Opens the Studio in Image-to-Video mode */
  i2v?: boolean;
}

const GROUPS: { title: string; hint?: string; items: NavItem[] }[] = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'create', label: 'Create', icon: Wand2 },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
      { id: 'compare', label: 'Compare models', icon: Columns3 },
      { id: 'history', label: 'History', icon: History },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'references', label: 'References', icon: Library },
      { id: 'collaboration', label: 'Collaboration', icon: Users },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'credits', label: 'Credits & plans', icon: Zap, color: 'text-amber-400' },
      { id: 'profile', label: 'Settings', icon: Settings },
    ],
  },
];

const SidebarContent: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { currentScreen, setCurrentScreen, imageToVideo, setImageToVideo } = useApp();

  const go = (item: NavItem) => {
    if (item.id === 'create') setImageToVideo(Boolean(item.i2v));
    setCurrentScreen(item.id);
    onNavigate?.();
  };

  const isActive = (item: NavItem) => {
    if (item.id === 'create') return currentScreen === 'create' && imageToVideo === Boolean(item.i2v);
    if (item.id === 'projects') return currentScreen === 'projects' || currentScreen === 'project-detail';
    return currentScreen === item.id || (item.id === 'history' && currentScreen === 'result');
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <nav className="space-y-5 overflow-y-auto pr-1 -mr-1">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase mb-1.5">
              {group.title}
              {group.hint && <span className="ml-1.5 normal-case font-medium tracking-normal text-zinc-600">{group.hint}</span>}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <button
                    key={item.label}
                    onClick={() => go(item)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-purple-600/20 text-white border border-purple-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : item.color || 'text-zinc-500'}`} />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { mobileNavOpen, setMobileNavOpen } = useApp();

  return (
    <>
      <aside className="hidden md:block w-60 border-r border-zinc-800/80 bg-zinc-950/90 h-[calc(100vh-65px)] sticky top-[65px] shrink-0 p-4">
        <SidebarContent />
      </aside>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-zinc-950 border-r border-zinc-800 p-4 h-full">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="pt-8 h-full">
              <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
