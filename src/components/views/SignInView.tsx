'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Sparkles, User, ShieldAlert, ArrowRight, Wand2, Key, Crown, Film } from 'lucide-react';

export const SignInView: React.FC = () => {
  const { loginAsUser, loginAsAdmin } = useApp();
  const router = useRouter();

  const handleUserSignIn = () => {
    loginAsUser();
    router.push('/');
  };

  const handleAdminSignIn = () => {
    loginAsAdmin();
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-purple-600 selection:text-white">
      
      {/* Background Glowing Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl glass-panel rounded-3xl border border-zinc-800 p-8 sm:p-10 relative z-10 shadow-2xl space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-purple-950">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              SaaS Identity Portal V1
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sign In to AetherGen AI Studio
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
              Select an account role below to enter the platform experience.
            </p>
          </div>
        </div>

        {/* Two Role Gateway Cards */}
        <div className="grid grid-cols-1 gap-4">
          
          {/* OPTION 1: Continue as User */}
          <button
            onClick={handleUserSignIn}
            className="p-6 rounded-2xl bg-zinc-900/80 hover:bg-purple-950/40 border border-zinc-800 hover:border-purple-500/60 text-left transition-all group relative overflow-hidden flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    Continue as User
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-900 text-purple-200 border border-purple-700">
                    CREATOR ROLE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Log in as <strong>Alex Rivera</strong> (Pro Creator • 240 Credits)
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Access Kling v1.5, Wan 2.1, Create Studio, History & Projects Library.
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1.5 transition-transform shrink-0 ml-2" />
          </button>

          {/* OPTION 2: Continue as Admin */}
          <button
            onClick={handleAdminSignIn}
            className="p-6 rounded-2xl bg-zinc-900/80 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/60 text-left transition-all group relative overflow-hidden flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                    Continue as Admin
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-950 text-rose-300 border border-rose-800">
                    SUPERADMIN ROLE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Log in to Central Control Panel (<code>/admin</code>)
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Manage users, customize credit packages, set tier prices & edit model costs.
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1.5 transition-transform shrink-0 ml-2" />
          </button>

        </div>

        {/* Footer Note */}
        <div className="text-center pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
          Mock Authentication System • No Password Required for Prototype Demo
        </div>

      </div>
    </div>
  );
};
