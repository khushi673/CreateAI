'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  Zap, 
  Plus, 
  User, 
  LogOut, 
  Crown, 
  ChevronDown, 
  Wand2,
  FolderKanban,
  History,
  LayoutDashboard,
  Settings
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    user, 
    setAuthModalOpen, 
    setAuthMode,
    setBuyCreditsModalOpen,
    setUpgradeModalOpen,
    logout
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isLanding = currentScreen === 'landing';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  AetherGen
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-purple-300 bg-purple-950/80 border border-purple-800/60 rounded-md uppercase">
                  V1 AI
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Next-Gen Video & Image Studio</p>
            </div>
          </button>

          {!isLanding && (
            <>
              {/* Navigation Links for App */}
              <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 text-xs font-medium">
                <button
                  onClick={() => setCurrentScreen('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    currentScreen === 'dashboard' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentScreen('create')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    currentScreen === 'create' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Create Studio
                </button>
                <button
                  onClick={() => setCurrentScreen('history')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    currentScreen === 'history' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  History
                </button>
                <button
                  onClick={() => setCurrentScreen('projects')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    currentScreen === 'projects' || currentScreen === 'project-detail' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  Projects
                </button>
              </nav>
            </>
          )}
        </div>

        {/* Action Controls & User Status */}
        {isLanding ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-900/80 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-purple-950/60 hover:brightness-110 transition-all"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            
            {/* Credit Counter Pill */}
            <div className="flex items-center bg-zinc-900/90 border border-purple-500/30 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setCurrentScreen('credits')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-purple-200 hover:text-white transition-colors"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                <span>{user.credits}</span>
                <span className="hidden sm:inline text-[10px] text-zinc-400 font-normal uppercase">Credits</span>
              </button>
              <button
                onClick={() => setBuyCreditsModalOpen(true)}
                className="bg-purple-600/90 hover:bg-purple-500 text-white p-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-md shadow-purple-900/50"
                title="Buy More Credits"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] pr-1">Add</span>
              </button>
            </div>

            {/* Upgrade Plan Button */}
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:brightness-110 transition-all shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.plan === 'Pro' ? 'Pro Plan' : 'Upgrade'}</span>
            </button>


            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors"
              >
                {/* Avatar Image */}
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-purple-500/40 shrink-0">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="hidden md:block text-left pr-1">
                  <div className="text-xs font-semibold text-white leading-none">{user.name}</div>
                  <div className="text-[10px] text-purple-400 font-medium leading-tight mt-0.5">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-1" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl border border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-zinc-800/80">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800/50">
                      <Crown className="w-3 h-3 text-amber-400" /> {user.plan} Member ({user.credits} Credits)
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { setCurrentScreen('profile'); setUserDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-purple-950/40 flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-purple-400" />
                      Profile & Settings
                    </button>
                    <button
                      onClick={() => { setCurrentScreen('credits'); setUserDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-purple-950/40 flex items-center gap-2 transition-colors"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      Billing & Credits
                    </button>
                    <button
                      onClick={() => { setCurrentScreen('pricing'); setUserDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-purple-950/40 flex items-center gap-2 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-emerald-400" />
                      Subscription Plans
                    </button>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out to Gateway
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </header>
  );
};
