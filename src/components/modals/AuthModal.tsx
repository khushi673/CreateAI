'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    setUser,
    addToast,
    setCurrentScreen,
    loginAsUser,
    loginAsAdmin,
  } = useApp();
  const [email, setEmail] = useState('alex.rivera@creative.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Rivera');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'login') {
      if (selectedRole === 'admin') {
        loginAsAdmin();
        setCurrentScreen('admin');
        setAuthModalOpen(false);
        router.push('/admin');
        addToast('Admin Authenticated', 'Welcome to AetherGen Central Control Panel', 'info');
        return;
      }

      loginAsUser();
      setCurrentScreen('dashboard');
      setAuthModalOpen(false);
      router.push('/');
      addToast('Signed In', 'Welcome back to your Creator Workspace!', 'success');
      return;
    }

    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
      name: name || prev.name,
    }));
    addToast('Authentication Success', 'Account created successfully!', 'success');
    setAuthModalOpen(false);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-zinc-800 p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 rounded-b-full blur-xs"></div>

        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-900/40">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {authMode === 'login' ? 'Welcome Back to AetherGen' : 'Create Your Creator Account'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {authMode === 'login'
              ? 'Enter your credentials to access your AI studio'
              : 'Join over 48,000+ creators generating 4K AI video & graphics'}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'login' ? 'bg-purple-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'signup' ? 'bg-purple-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {authMode === 'login' && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('user')}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                selectedRole === 'user'
                  ? 'border-purple-500 bg-purple-600/10 text-purple-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              User Sign In
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'border-rose-500 bg-rose-600/10 text-rose-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              Admin Sign In
            </button>
          </div>
        )}

        {/* Social Quick Login */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.39 7.37 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.61 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            Google
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-zinc-800 w-full"></div>
          <span className="bg-zinc-950 px-3 text-[10px] text-zinc-400 font-bold uppercase tracking-wider absolute">
            Or with email
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@aethergen.ai"
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-lg shadow-purple-950 flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {authMode === 'login'
                ? selectedRole === 'admin'
                  ? 'Sign In as Admin'
                  : 'Sign In as User'
                : 'Create Free Account (+50 Bonus Credits)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-zinc-400 text-center mt-6">
          By continuing, you agree to AetherGen's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
