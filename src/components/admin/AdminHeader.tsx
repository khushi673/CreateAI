'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Users, 
  CreditCard, 
  Zap, 
  SlidersHorizontal,
  LayoutDashboard,
  LogOut,
  Bot
} from 'lucide-react';

interface AdminHeaderProps {
  activeTab: 'overview' | 'users' | 'credits' | 'subscriptions' | 'models' | 'llm';
  setActiveTab: (tab: 'overview' | 'users' | 'credits' | 'subscriptions' | 'models' | 'llm') => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, setActiveTab }) => {
  const { adminUsers, logout } = useApp();
  const router = useRouter();

  const handleAdminLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-900/40 px-4 lg:px-8 py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-950">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  AetherGen Admin
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-rose-300 bg-rose-950 border border-rose-800 rounded-md uppercase">
                  SUPERADMIN
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">Isolated Admin Panel (/admin)</p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-rose-950/50 border border-zinc-800 text-xs font-bold text-rose-300 hover:text-white transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs font-bold overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Users ({adminUsers.length})
          </button>

          <button
            onClick={() => setActiveTab('credits')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'credits'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Credit Management
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'subscriptions'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            Subscriptions
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'models'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            Model Rates
          </button>

          <button
            onClick={() => setActiveTab('llm')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'llm'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            LLM Config
          </button>
        </nav>

      </div>
    </header>
  );
};
