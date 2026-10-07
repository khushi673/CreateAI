'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PlanCard } from '@/components/billing/PlanCard';

/** Plans panel, shown as the "Plans" tab of Credits & plans. */
export const PricingView: React.FC = () => {
  const { user, upgradePlan, subscriptionPlans } = useApp();
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('yearly');
  const plans = subscriptionPlans.filter((p) => p.active);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-zinc-400">Every plan includes monthly credits. Plan changes are simulated in this demo.</p>
        <div className="inline-flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold self-start">
          <button
            onClick={() => setCycle('monthly')}
            className={`px-4 py-2 rounded-lg transition-all ${cycle === 'monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setCycle('yearly')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${cycle === 'yearly' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            Yearly
            <span className="px-1.5 py-0.5 text-[9px] bg-amber-400 text-black font-extrabold rounded">Save 20%</span>
          </button>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="p-10 text-center rounded-2xl glass-panel border border-zinc-800 text-xs text-zinc-400">No plans are available right now.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pt-2">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} cycle={cycle} currentPlan={user.plan} onSelect={upgradePlan} compact />
            ))}
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-zinc-400 border-b border-zinc-800">
                  <th className="p-3 font-bold">Compare</th>
                  {plans.map((p) => (
                    <th key={p.id} className="p-3 font-bold text-white">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                <tr>
                  <td className="p-3 text-zinc-400">Price per month</td>
                  {plans.map((p) => {
                    const price = cycle === 'yearly' ? p.yearlyPrice : p.monthlyPrice;
                    return <td key={p.id} className="p-3">{price === 0 ? 'Free' : `$${price}`}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-3 text-zinc-400">Credits per month</td>
                  {plans.map((p) => <td key={p.id} className="p-3">{p.monthlyCredits.toLocaleString()}</td>)}
                </tr>
                <tr>
                  <td className="p-3 text-zinc-400">Generations per month</td>
                  {plans.map((p) => <td key={p.id} className="p-3">{p.monthlyGenerationLimit.toLocaleString()}</td>)}
                </tr>
                <tr>
                  <td className="p-3 text-zinc-400">Models included</td>
                  {plans.map((p) => <td key={p.id} className="p-3">{p.allowedModelIds.length}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
