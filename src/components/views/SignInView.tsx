'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Sparkles, User, ShieldAlert, ArrowRight } from 'lucide-react';

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
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sign in to AetherGen
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
              Choose an account to continue.
            </p>
          </div>
        </div>

        {/* Two Role Gateway Cards */}
        <div className="grid grid-cols-1 gap-4">
          
          {/* OPTION 1: Continue as user */}
          <button
            onClick={handleUserSignIn}
            className="p-6 rounded-2xl bg-zinc-900/80 hover:bg-purple-950/40 border border-zinc-800 hover:border-purple-500/60 text-left transition-all group relative overflow-hidden flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Continue as user
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Create images, video and audio
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1.5 transition-transform shrink-0 ml-2" />
          </button>

          {/* OPTION 2: Continue as admin */}
          <button
            onClick={handleAdminSignIn}
            className="p-6 rounded-2xl bg-zinc-900/80 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/60 text-left transition-all group relative overflow-hidden flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                  Continue as admin
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage users, credits and models
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1.5 transition-transform shrink-0 ml-2" />
          </button>

        </div>

        {/* Footer Note */}
        <div className="text-center pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
          Demo only: no password required.
        </div>

      </div>
    </div>
  );
};
