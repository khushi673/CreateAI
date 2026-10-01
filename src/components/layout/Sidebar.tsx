'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ViewScreen } from '@/types';
import { 
  LayoutDashboard, 
  Wand2, 
  History, 
  FolderKanban, 
  CreditCard, 
  Zap, 
  Settings, 
  Crown,
  Sparkles,
  LogOut
} from 'lucide-react';

interface SidebarItemProps {
  id: ViewScreen;
  label: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, setUpgradeModalOpen, logout } = useApp();

  const navItems: SidebarItemProps[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'AI Create Studio', icon: Wand2, badge: 'HOT', color: 'text-fuchsia-400' },
    { id: 'history', label: 'Generation History', icon: History },
    { id: 'projects', label: 'Projects & Library', icon: FolderKanban },
    { id: 'pricing', label: 'Subscription Plans', icon: CreditCard },
    { id: 'credits', label: 'Credits & Billing', icon: Zap, color: 'text-amber-400' },
    { id: 'profile', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800/80 bg-zinc-950/90 h-[calc(100vh-65px)] sticky top-[65px] shrink-0 p-4 justify-between transition-all">
      <div className="space-y-6">
        
        {/* Quick Launch CTA Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/80 via-zinc-900 to-indigo-950/80 border border-purple-800/40 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-purple-600/20 rounded-full blur-xl group-hover:bg-purple-600/30 transition-all"></div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <span className="text-xs font-bold text-purple-200">Kling & Wan 2.1 Live</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug mb-3">
            Generate 4K cinematic video with high motion fidelity.
          </p>
          <button
            onClick={() => setCurrentScreen('create')}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-950 flex items-center justify-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Start Generating
          </button>
        </div>

        {/* Navigation List */}
        <div>
          <h3 className="px-3 text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-2">
            User Workspace Menu
          </h3>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id || (item.id === 'projects' && currentScreen === 'project-detail');

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-white border border-purple-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : item.color || 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700/50">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Pro Upgrade & Logout Card */}
      <div className="space-y-2">
        <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="text-xs font-bold text-white mb-0.5">Need Unlimited Render?</h4>
          <p className="text-[11px] text-zinc-400 mb-2">Unlock priority GPU slots & 4K video exporting.</p>
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-extrabold transition-all shadow-md shadow-amber-950"
          >
            Upgrade Plan
          </button>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-900/80 hover:bg-rose-950/30 border border-zinc-800 text-zinc-400 hover:text-rose-300 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};
