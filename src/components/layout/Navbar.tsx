'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles,   
  LogOut, 
  ChevronDown, 
  Menu
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    setCurrentScreen, 
    user, 
    logout,
    setMobileNavOpen
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80  py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 lg:gap-6">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
                AetherGen
              </span>
              <p className="hidden sm:block text-[11px] text-zinc-400 font-medium">Image · Video · Audio Studio</p>
            </div>
          </button>

        </div>

        {/* Action Controls & User Status */}
          <div className="flex items-center gap-3">
            
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
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

      </div>
    </header>
  );
};
