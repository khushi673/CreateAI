'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Crown, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const PricingView: React.FC = () => {
  const { user, upgradePlan, setBuyCreditsModalOpen } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      
      {/* Pricing Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold">
          <Crown className="w-4 h-4 text-amber-400" /> Flexible Creator & Enterprise Plans
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Choose the Perfect AI Studio Tier
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Scale video generations with priority GPU rendering, 4K export quality, and commercial commercial licensing rights.
        </p>

        {/* Monthly / Yearly Switcher */}
        <div className="inline-flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl mt-4 text-xs font-semibold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg transition-all ${
              billingCycle === 'monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Yearly Billing
            <span className="px-1.5 py-0.5 text-[9px] bg-amber-400 text-black font-extrabold rounded">SAVE 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Free Plan */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Starter Free</h3>
            <p className="text-xs text-zinc-400 mb-4">Ideal for quick trials and testing AI prompts.</p>
            
            <div className="flex items-baseline gap-1 my-4">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-xs text-zinc-400">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 my-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>50 Free Bonus Credits</strong> on sign up</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Access to Kling v1.5 & Nano Banana</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Standard render queue speed</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>720p HD Video resolution</span>
              </li>
            </ul>
          </div>

          <button
            disabled={user.plan === 'Free'}
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-xs font-bold transition-all"
          >
            {user.plan === 'Free' ? 'Current Active Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-6 rounded-3xl bg-purple-950/40 border border-purple-500 relative flex flex-col justify-between shadow-2xl shadow-purple-950/50">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white uppercase tracking-wider shadow">
            MOST POPULAR CREATOR CHOICE
          </span>

          <div>
            <h3 className="text-lg font-bold text-white mb-1">Pro Creator</h3>
            <p className="text-xs text-purple-200 mb-4">For professional video creators, VFX artists & marketing teams.</p>
            
            <div className="flex items-baseline gap-1 my-4">
              <span className="text-4xl font-black text-white">
                {billingCycle === 'yearly' ? '$29' : '$36'}
              </span>
              <span className="text-xs text-purple-300">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-zinc-200 my-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>1,000 Monthly Credits</strong> (Refreshed monthly)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>All Models: <strong>Kling v1.5, Wan 2.1, Seedance & Flux.1</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Priority GPU Queue</strong> (2x Faster renders)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>4K Resolution Export</strong> & Watermark Free</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Full Commercial License</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => upgradePlan('Pro')}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-purple-950 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {user.plan === 'Pro' ? 'Manage Pro Subscription' : 'Upgrade to Pro Plan'}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Studio Enterprise</h3>
            <p className="text-xs text-zinc-400 mb-4">Dedicated GPU clusters, API access & custom fine-tuning.</p>
            
            <div className="flex items-baseline gap-1 my-4">
              <span className="text-4xl font-black text-white">
                {billingCycle === 'yearly' ? '$89' : '$99'}
              </span>
              <span className="text-xs text-zinc-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 my-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>5,000 Monthly Credits</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dedicated GPU Node allocation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Custom Model Fine-tuning API</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Multi-seat Team Workspaces</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>24/7 Priority VIP Support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => upgradePlan('Enterprise')}
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Upgrade to Enterprise
          </button>
        </div>

      </div>

    </div>
  );
};
