'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Zap, Sparkles } from 'lucide-react';

export const BuyCreditsModal: React.FC = () => {
  const { buyCreditsModalOpen, setBuyCreditsModalOpen, buyCredits, creditPackages } = useApp();

  if (!buyCreditsModalOpen) return null;

  const packages = creditPackages.filter((p) => p.active);

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
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Buy credits</h2>
            <p className="text-xs text-zinc-400">Credits do not expire and work on every model.</p>
          </div>
        </div>

        {/* Credit Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {packages.length === 0 && (
            <div className="sm:col-span-2 p-8 text-center text-xs text-zinc-400 rounded-2xl border border-zinc-800">No credit packs are available right now.</div>
          )}
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                pkg.isPopular
                  ? 'bg-purple-950/40 border-purple-500 shadow-xl shadow-purple-950/40'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white uppercase tracking-wider shadow">
                  Most popular
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{pkg.name}</span>
                  {pkg.bonusText && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                      {pkg.bonusText}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-black text-white">{pkg.credits}</span>
                  <span className="text-xs text-amber-400 font-bold">credits</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  About {Math.floor(pkg.credits / 120)} Kling 4.0 videos or {Math.floor(pkg.credits / 20)} Nano Banana images
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-lg font-bold text-white">${pkg.price}</span>
                <button
                  onClick={() => buyCredits(pkg.credits, pkg.name)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    pkg.isPopular
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
