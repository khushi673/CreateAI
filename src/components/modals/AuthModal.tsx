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
        addToast('Signed in as admin', 'Welcome to the admin panel', 'info');
        return;
      }

      loginAsUser();
      setCurrentScreen('dashboard');
      setAuthModalOpen(false);
      router.push('/');
      addToast('Signed in', 'Welcome back', 'success');
      return;
    }

    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
      name: name || prev.name,
    }));
    addToast('Account created', 'Your account is ready', 'success');
    setAuthModalOpen(false);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-zinc-800 p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        
        {/* Top accent */}
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
            {authMode === 'login' ? 'Sign in to AetherGen' : 'Create your account'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {authMode === 'login'
              ? 'Enter your email and password.'
              : 'Get 50 free credits when you sign up.'}
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
            Sign in
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'signup' ? 'bg-purple-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create account
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
              User
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
              Admin
            </button>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full name</label>
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
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email address</label>
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
                  ? 'Sign in as admin'
                  : 'Sign in as user'
                : 'Create account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-zinc-400 text-center mt-6">
          Demo only: no password is checked.
        </p>
      </div>
    </div>
  );
};
