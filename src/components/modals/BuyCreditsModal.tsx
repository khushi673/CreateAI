'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Zap, Check, Sparkles, ShieldCheck } from 'lucide-react';

export const BuyCreditsModal: React.FC = () => {
  const { buyCreditsModalOpen, setBuyCreditsModalOpen, buyCredits } = useApp();

  if (!buyCreditsModalOpen) return null;

  const packages = [
    { credits: 250, price: '$10', tag: 'Starter Pack', popular: false },
    { credits: 750, price: '$25', tag: 'Creator Pack', popular: true, bonus: '+100 Bonus' },
    { credits: 2000, price: '$50', tag: 'Studio Pack', popular: false, bonus: '+350 Bonus' },
    { credits: 5000, price: '$100', tag: 'Production Pack', popular: false, bonus: '+1000 Bonus' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-zinc-800 p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setBuyCreditsModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6 fill-amber-400 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Top Up Generation Credits</h2>
            <p className="text-xs text-zinc-400">Credits never expire. Use across Kling, Wan 2.1, Seedance & Flux.1.</p>
          </div>
        </div>

        {/* Credit Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                pkg.popular
                  ? 'bg-purple-950/40 border-purple-500 shadow-xl shadow-purple-950/40'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white uppercase tracking-wider shadow">
                  Most Popular
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{pkg.tag}</span>
                  {pkg.bonus && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                      {pkg.bonus}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-black text-white">{pkg.credits}</span>
                  <span className="text-xs text-amber-400 font-bold">⚡ Credits</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Approx. {Math.floor(pkg.credits / 15)} Kling Videos or {Math.floor(pkg.credits / 5)} Flux Images
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-lg font-bold text-white">{pkg.price}</span>
                <button
                  onClick={() => buyCredits(pkg.credits)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    pkg.popular
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security / Guarantee Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure 256-Bit SSL Mock Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-purple-400" />
            <span>Instant Balance Refresh</span>
          </div>
        </div>

      </div>
    </div>
  );
};
