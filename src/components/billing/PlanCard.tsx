'use client';

import React from 'react';
import { Check, Sparkles, Crown } from 'lucide-react';
import { AI_MODELS } from '@/data/mockData';
import { SubscriptionPlan, PlanName } from '@/types';

export const PlanCard: React.FC<{
  plan: SubscriptionPlan;
  cycle: 'monthly' | 'yearly';
  currentPlan: PlanName;
  onSelect: (name: Exclude<PlanName, 'Free'>) => void;
  compact?: boolean;
}> = ({ plan, cycle, currentPlan, onSelect, compact }) => {
  const isCurrent = plan.name === currentPlan;
  const isFree = plan.name === 'Free';
  const price = cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const models = plan.allowedModelIds.map((id) => AI_MODELS.find((m) => m.id === id)?.name).filter(Boolean) as string[];

  return (
    <div
      className={`p-5 rounded-3xl border relative flex flex-col justify-between ${
        plan.isPopular ? 'bg-purple-950/40 border-purple-500 shadow-2xl shadow-purple-950/50' : 'bg-zinc-900/60 border-zinc-800'
      } ${isCurrent ? 'ring-1 ring-emerald-500/60' : ''}`}
    >
      {plan.isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white uppercase tracking-wider shadow whitespace-nowrap">
          Most popular
        </span>
      )}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-white">{plan.name}</h3>
          {isCurrent && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">Current</span>}
        </div>
        <p className="text-[11px] text-zinc-400 min-h-[2rem]"><span className="text-zinc-500">For:</span> {plan.description}</p>
        <div className="flex items-baseline gap-1 my-3">
          <span className="text-3xl font-black text-white">${price}</span>
          <span className="text-[11px] text-zinc-400">{isFree ? '/ forever' : '/ month'}</span>
        </div>
        <p className="text-[11px] text-amber-400 font-bold">
          {plan.monthlyCredits.toLocaleString()} credits / month · {plan.monthlyGenerationLimit.toLocaleString()} generations
        </p>

        <ul className="space-y-2 text-xs text-zinc-300 my-4">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {!compact && (
          <div className="pt-3 border-t border-zinc-800/80">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Unlocks {models.length} models</p>
            <div className="flex flex-wrap gap-1">
              {models.map((m) => (
                <span key={m} className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        disabled={isCurrent || isFree}
        onClick={() => !isFree && onSelect(plan.name as Exclude<PlanName, 'Free'>)}
        className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
          plan.isPopular && !isCurrent ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
        }`}
      >
        {isCurrent ? (
          'Current plan'
        ) : isFree ? (
          'Included'
        ) : (
          <>
            {plan.isPopular ? <Sparkles className="w-4 h-4" /> : <Crown className="w-4 h-4 text-amber-400" />}
            Upgrade to {plan.name}
          </>
        )}
      </button>
    </div>
  );
};
