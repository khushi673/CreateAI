'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Settings, User, Key, Bell, Shield, Save, Copy, Check } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, setUser, addToast } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [apiKey, setApiKey] = useState('ag_live_99418294102948102948019');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      role,
    }));
    addToast('Profile Updated', 'Saved user profile changes to local account', 'success');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    addToast('API Key Copied', 'Copied secret key to clipboard', 'info');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white">Profile & Preferences</h1>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Manage creator profile information, API developer keys, and notification settings.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* User Account Details Card */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" /> Creator Profile Info
          </h2>

          <div className="flex items-center gap-4 py-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-purple-500/50 shrink-0">
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => addToast('Avatar Updated', 'Loaded new avatar image', 'info')}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white"
              >
                Change Avatar Photo
              </button>
              <p className="text-[10px] text-zinc-400 mt-1">JPG, PNG up to 5MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Role / Specialization</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Developer API Keys Card */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" /> Developer API Secret Key
          </h2>
          <p className="text-xs text-zinc-400">
            Use this key to programmatically trigger Kling & Wan 2.1 renders via REST API.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="password"
              readOnly
              value={apiKey}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-purple-300 font-mono"
            />
            <button
              type="button"
              onClick={handleCopyKey}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5"
            >
              {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedKey ? 'Copied' : 'Copy Key'}
            </button>
          </div>
        </div>

        {/* Preferences & Notifications */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" /> Notification Preferences
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4 rounded" />
              <span>Email notification when 4K Video render completes</span>
            </label>
            <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4 rounded" />
              <span>Alert when credit balance drops below 20 credits</span>
            </label>
            <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4 rounded" />
              <span>Weekly digest of new model releases (Kling, Wan 2.1 updates)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-950"
        >
          <Save className="w-4 h-4" /> Save Profile Settings
        </button>

      </form>

    </div>
  );
};
