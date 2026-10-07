'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Settings, User, Bell, Save } from 'lucide-react';
import { DeveloperApiPanel } from '@/components/profile/DeveloperApiPanel';

export const ProfileView: React.FC = () => {
  const { user, setUser, addToast } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [tab, setTab] = useState<'profile' | 'api-keys'>('profile');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      role,
    }));
    addToast('Profile saved', 'Your profile changes were saved', 'success');
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white">Settings</h1>
        </div>
      </div>

      <div className="inline-flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-semibold">
        {([['profile', 'Profile'], ['api-keys', 'API keys']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-xl transition-all ${tab === id ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'api-keys' ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">Use an API key to connect tools such as ComfyUI. Demo keys only.</p>
          <DeveloperApiPanel />
        </div>
      ) : (
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" /> Profile
          </h2>

          <div className="flex items-center gap-4 py-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-purple-500/50 shrink-0">
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => addToast('Avatar updated', 'New avatar image loaded', 'info')}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white"
              >
                Change avatar
              </button>
              <p className="text-[10px] text-zinc-400 mt-1">JPG or PNG, up to 5 MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" /> Notifications
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4 rounded" />
              <span>Email me when a video generation completes</span>
            </label>
            <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4 rounded" />
              <span>Alert me when credits drop below 20</span>
            </label>
            <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4 rounded" />
              <span>Weekly digest of new model releases</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-950"
        >
          <Save className="w-4 h-4" /> Save changes
        </button>

      </form>
      )}

    </div>
  );
};
