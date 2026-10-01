'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Zap, Plus, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck } from 'lucide-react';
import { AI_MODELS } from '@/data/mockData';

export const CreditsView: React.FC = () => {
  const { user, setBuyCreditsModalOpen } = useApp();

  const mockTransactions = [
    { id: 'tx_109', type: 'DEDUCTION', amount: -15, desc: 'Generated Video via Kling AI v1.5 Pro', date: '10 mins ago' },
    { id: 'tx_108', type: 'DEDUCTION', amount: -10, desc: 'Generated Video via Wan 2.1 Video', date: '1 hour ago' },
    { id: 'tx_107', type: 'PURCHASE', amount: +250, desc: 'Purchased Starter Pack ($10.00)', date: 'Yesterday' },
    { id: 'tx_106', type: 'DEDUCTION', amount: -5, desc: 'Generated Image via Flux.1 Pro', date: '2 days ago' },
    { id: 'tx_105', type: 'BONUS', amount: +50, desc: 'Welcome Bonus Credits Added', date: 'Sep 24, 2025' },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Credits & Billing Studio</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your AI generation credit balance, purchase top-up packs, and inspect usage logs.
          </p>
        </div>

        <button
          onClick={() => setBuyCreditsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-purple-950"
        >
          <Plus className="w-4 h-4" />
          Buy Credit Package
        </button>
      </div>

      {/* Credit Gauge Visualizer Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-amber-950/60 border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Current Balance</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-white">{user.credits}</span>
            <span className="text-sm font-bold text-amber-400">⚡ Available Credits</span>
          </div>
          <p className="text-xs text-zinc-300">
            Active plan: <strong className="text-purple-300">{user.plan} Tier</strong> • Credits never expire.
          </p>
        </div>

        <div className="w-full md:w-72 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-zinc-300">Monthly Usage</span>
            <span className="text-amber-400">240 / 1000 Used</span>
          </div>
          <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-purple-500 h-full w-[24%] rounded-full"></div>
          </div>
          <p className="text-[10px] text-zinc-400">
            Resets automatically on 1st of every month.
          </p>
        </div>

      </div>

      {/* Model Credit Rates Table */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Model Credit Rate Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_MODELS.map((model) => (
            <div key={model.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{model.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white">{model.name}</p>
                  <p className="text-[10px] text-zinc-400">{model.provider}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800/60 text-xs font-bold">
                ⚡ {model.creditCost} / render
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Log */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          Recent Credit Activity Log
        </h2>

        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {mockTransactions.map((tx) => {
                const isPositive = tx.amount > 0;
                return (
                  <tr key={tx.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-400">{tx.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{tx.desc}</td>
                    <td className="py-3 px-4 text-zinc-400">{tx.date}</td>
                    <td className={`py-3 px-4 text-right font-bold flex items-center justify-end gap-1 ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{isPositive ? `+${tx.amount}` : tx.amount} Credits</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
