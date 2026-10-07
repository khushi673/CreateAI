'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Zap,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
  Film,
  Image as ImageIcon,
  Music,
  RotateCcw,
  ShoppingCart,
  Gift,
  RefreshCw,
} from 'lucide-react';
import { BILLING_SUMMARY } from '@/data/mockData';
import { CreditTransaction } from '@/types';
import { PricingView } from '@/components/views/PricingView';
import { BillingHistoryModal } from '@/components/billing/BillingHistoryModal';

type Filter = 'all' | 'charges' | 'refunds' | 'purchases';

const iconFor = (tx: CreditTransaction) => {
  if (tx.kind === 'refund') return <RotateCcw className="w-4 h-4 text-emerald-400" />;
  if (tx.kind === 'purchase') return <ShoppingCart className="w-4 h-4 text-amber-400" />;
  if (tx.kind === 'subscription') return <RefreshCw className="w-4 h-4 text-purple-400" />;
  if (tx.kind === 'bonus') return <Gift className="w-4 h-4 text-fuchsia-400" />;
  if (tx.title.startsWith('Video')) return <Film className="w-4 h-4 text-purple-400" />;
  if (tx.title.startsWith('Audio')) return <Music className="w-4 h-4 text-amber-400" />;
  return <ImageIcon className="w-4 h-4 text-emerald-400" />;
};

export const CreditsView: React.FC = () => {
  const { user, transactions, subscriptionPlans, setBuyCreditsModalOpen } = useApp();
  const [tab, setTab] = useState<'credits' | 'plans'>('credits');
  const [filter, setFilter] = useState<Filter>('all');
  const [historyOpen, setHistoryOpen] = useState(false);

  const plan = subscriptionPlans.find((p) => p.name === user.plan);
  const allowance = plan?.monthlyCredits ?? BILLING_SUMMARY.monthlyAllowance;

  const usedPct = Math.min(100, Math.round((BILLING_SUMMARY.creditsUsedThisMonth / allowance) * 100));

  const filtered = transactions.filter((t) => {
    if (filter === 'charges') return t.kind === 'charge';
    if (filter === 'refunds') return t.kind === 'refund';
    if (filter === 'purchases') return t.kind === 'purchase';
    return true;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'charges', label: 'Charges' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'purchases', label: 'Purchases' },
  ];

  const spent = (prefix: string) =>
    transactions.filter((t) => t.kind === 'charge' && t.title.startsWith(prefix)).reduce((n, t) => n + Math.abs(t.amount), 0);
  const usage = [
    { label: 'Image', value: spent('Image'), color: 'bg-emerald-400' },
    { label: 'Video', value: spent('Video'), color: 'bg-purple-400' },
    { label: 'Audio', value: spent('Audio'), color: 'bg-amber-400' },
  ];
  const usageTotal = usage.reduce((n, u) => n + u.value, 0);

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Credits & plans</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Credits are spent each time you generate. Failed generations are refunded.</p>
        </div>
        <button
          onClick={() => setBuyCreditsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950"
        >
          <Plus className="w-4 h-4" /> Buy credits
        </button>
      </div>

      <div className="inline-flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-semibold">
        {([['credits', 'Credits'], ['plans', 'Plans']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-xl transition-all ${tab === id ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'plans' ? (
        <PricingView />
      ) : (
        <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/70 to-amber-950/40 border border-amber-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Balance</span>
          <p className="text-3xl font-black text-white mt-1">{user.credits.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-zinc-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Used this month</span>
          <p className="text-3xl font-black text-white mt-1">{BILLING_SUMMARY.creditsUsedThisMonth.toLocaleString()}</p>
          <p className="text-[11px] text-zinc-500 mt-1">{usedPct}% of {allowance.toLocaleString()} on the {user.plan} plan</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-zinc-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Next renewal</span>
          <p className="text-xl font-black text-white mt-2">{BILLING_SUMMARY.renewalDate}</p>
          <p className="text-[11px] text-zinc-500 mt-1">{plan ? (plan.monthlyPrice === 0 ? 'Free plan' : `$${plan.monthlyPrice} / month`) : user.plan}</p>
        </div>
      </div>

      {/* How credits were used */}
      <div className="p-5 rounded-2xl glass-panel border border-zinc-800 space-y-3">
        <h2 className="text-xs font-bold text-white">How credits were used</h2>
        <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden flex">
          {usage.map((u) => (
            <div key={u.label} className={u.color} style={{ width: `${usageTotal ? (u.value / usageTotal) * 100 : 0}%` }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-zinc-400">
          {usage.map((u) => (
            <span key={u.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${u.color}`} /> {u.label} {u.value.toLocaleString()}
            </span>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" /> Transactions
          </h2>
          <button
            onClick={() => setHistoryOpen(true)}
            className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 sm:ml-auto sm:mr-3"
          >
            <FileText className="w-3.5 h-3.5" /> Billing history
          </button>
          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-semibold self-start overflow-x-auto max-w-full">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${filter === f.id ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden divide-y divide-zinc-800/80">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-xs text-zinc-400">No transactions in this category yet.</div>
          ) : (
            filtered.map((tx) => {
              const positive = tx.amount > 0;
              return (
                <div key={tx.id} className="flex items-center gap-3 p-4 hover:bg-zinc-900/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0">{iconFor(tx)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{tx.title}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{tx.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-bold flex items-center justify-end gap-0.5 ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {positive ? '+' : ''}
                      {tx.amount.toLocaleString()} credits
                    </p>
                    <p className="text-[10px] text-zinc-500">{tx.date}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

        </>
      )}

      <BillingHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
};
