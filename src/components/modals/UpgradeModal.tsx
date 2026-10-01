'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Crown, Check, Sparkles } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { upgradeModalOpen, setUpgradeModalOpen, upgradePlan } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!upgradeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl glass-panel rounded-3xl border border-zinc-800 p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        
        {/* Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500"></div>

        {/* Close Button */}
        <button
          onClick={() => setUpgradeModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
            <Crown className="w-4 h-4" /> Pro & Enterprise Creator Plans
          </div>
          <h2 className="text-2xl font-black text-white">Unlock Priority GPU Render & Unlimited Storage</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg mx-auto">
            Get 1,000+ monthly credits, parallel video generation, and commercial commercial licensing rights.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl mt-4 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Yearly Billing
              <span className="px-1.5 py-0.5 text-[9px] bg-amber-400 text-black font-extrabold rounded">SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          
          {/* Pro Plan */}
          <div className="p-6 rounded-2xl bg-purple-950/30 border border-purple-500/50 relative flex flex-col justify-between shadow-xl shadow-purple-950/40">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Pro Creator</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-900 text-purple-200 border border-purple-700">
                  RECOMMENDED
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-black text-white">
                  {billingCycle === 'yearly' ? '$29' : '$36'}
                </span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 my-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>1,000 Credits</strong> per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Access to <strong>Kling v1.5, Wan 2.1 & Seedance</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Priority GPU queue (2x faster generation)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>4K Resolution video & image download</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Commercial usage rights</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => upgradePlan('Pro')}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-950 flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Studio Enterprise</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-zinc-800 text-zinc-300">
                  TEAMS & AGENCIES
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-black text-white">
                  {billingCycle === 'yearly' ? '$89' : '$99'}
                </span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 my-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>5,000 Credits</strong> per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Dedicated GPU Node allocation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Custom AI Model Fine-tuning API</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Multi-seat Team Collaboration & Admin</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>24/7 VIP Studio Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => upgradePlan('Enterprise')}
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              Upgrade to Enterprise
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
