'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SubscriptionPlan } from '@/types';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Crown, 
  ShieldCheck, 
  Cpu, 
  SlidersHorizontal,
  CheckSquare,
  Square
} from 'lucide-react';

export const AdminSubscriptionManagement: React.FC = () => {
  const { 
    subscriptionPlans, 
    addSubscriptionPlan, 
    updateSubscriptionPlan, 
    deleteSubscriptionPlan,
    models,
    addToast
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form State
  const [planName, setPlanName] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState(29);
  const [yearlyPrice, setYearlyPrice] = useState(24);
  const [monthlyCredits, setMonthlyCredits] = useState(1000);
  const [maxConcurrentJobs, setMaxConcurrentJobs] = useState(3);
  const [badge, setBadge] = useState('PRO');
  const [description, setDescription] = useState('');
  const [allowedModelIds, setAllowedModelIds] = useState<string[]>(['kling-v1-5', 'wan-v2-1', 'flux-1-pro']);
  const [featuresInput, setFeaturesInput] = useState('1,000 Monthly Credits, Priority GPU Queue, 4K Video Export');

  const handleOpenNewPlan = () => {
    setEditingPlan(null);
    setPlanName('');
    setMonthlyPrice(29);
    setYearlyPrice(24);
    setMonthlyCredits(1000);
    setMaxConcurrentJobs(3);
    setBadge('NEW TIER');
    setDescription('Custom plan tailored for video agencies and creators.');
    setAllowedModelIds(models.map((m) => m.id));
    setFeaturesInput('Priority GPU Queue, 4K Video Render, Commercial License');
    setModalOpen(true);
  };

  const handleOpenEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setMonthlyPrice(plan.monthlyPrice);
    setYearlyPrice(plan.yearlyPrice);
    setMonthlyCredits(plan.monthlyCredits);
    setMaxConcurrentJobs(plan.maxConcurrentJobs);
    setBadge(plan.badge || '');
    setDescription(plan.description);
    setAllowedModelIds(plan.allowedModelIds);
    setFeaturesInput(plan.features.join(', '));
    setModalOpen(true);
  };

  const toggleModelAllowed = (modelId: string) => {
    setAllowedModelIds((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim()) return;

    const features = featuresInput.split(',').map((f) => f.trim()).filter(Boolean);

    if (editingPlan) {
      updateSubscriptionPlan(editingPlan.id, {
        name: planName,
        monthlyPrice,
        yearlyPrice,
        monthlyCredits,
        maxConcurrentJobs,
        badge,
        description,
        allowedModelIds,
        features,
      });
    } else {
      addSubscriptionPlan({
        name: planName,
        monthlyPrice,
        yearlyPrice,
        monthlyCredits,
        maxConcurrentJobs,
        badge,
        isPopular: false,
        active: true,
        description,
        allowedModelIds,
        features,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-black text-white">Subscription Tier Administration</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Configure subscription tiers, set pricing & included credits, set concurrent job limits, and toggle model availability per tier.
          </p>
        </div>

        <button
          onClick={handleOpenNewPlan}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950"
        >
          <Plus className="w-4 h-4" />
          Create New Subscription Plan
        </button>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-3xl border flex flex-col justify-between relative shadow-xl ${
              plan.isPopular ? 'bg-purple-950/40 border-purple-500' : 'bg-zinc-900/80 border-zinc-800'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white uppercase tracking-wider">
                {plan.badge}
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <button
                  onClick={() => updateSubscriptionPlan(plan.id, { active: !plan.active })}
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    plan.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {plan.active ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>

              <p className="text-xs text-zinc-400 mb-4">{plan.description}</p>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 my-3">
                <span className="text-3xl font-black text-white">${plan.monthlyPrice}</span>
                <span className="text-xs text-zinc-400">/ mo (${plan.yearlyPrice}/mo yr)</span>
              </div>

              <div className="space-y-2 text-xs py-3 border-y border-zinc-800/80 my-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Monthly Credits:</span>
                  <span className="font-bold text-amber-400">⚡ {plan.monthlyCredits} Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Concurrent Jobs Limit:</span>
                  <span className="font-bold text-white">{plan.maxConcurrentJobs} Parallel Jobs</span>
                </div>
              </div>

              {/* Enabled Models List */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">
                  Enabled Models ({plan.allowedModelIds.length}/{models.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {models.map((m) => {
                    const isEnabled = plan.allowedModelIds.includes(m.id);
                    return (
                      <span
                        key={m.id}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                          isEnabled
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-zinc-950 text-zinc-600 line-through'
                        }`}
                      >
                        {m.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenEditPlan(plan)}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Plan
              </button>

              <button
                onClick={() => deleteSubscriptionPlan(plan.id)}
                className="p-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800"
                title="Delete Plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* MODAL: Add / Edit Subscription Plan */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">
              {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
            </h3>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g. Pro Creator"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Monthly Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Yearly Price ($ USD / mo)</label>
                  <input
                    type="number"
                    required
                    value={yearlyPrice}
                    onChange={(e) => setYearlyPrice(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Included Monthly Credits</label>
                  <input
                    type="number"
                    required
                    value={monthlyCredits}
                    onChange={(e) => setMonthlyCredits(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Max Concurrent Render Jobs</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={maxConcurrentJobs}
                    onChange={(e) => setMaxConcurrentJobs(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Badge Text (Optional)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. RECOMMENDED or TEAMS"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white resize-none"
                />
              </div>

              {/* Allowed AI Models Checklist */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Available AI Models for this Plan</label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  {models.map((m) => {
                    const isChecked = allowedModelIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleModelAllowed(m.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors ${
                          isChecked ? 'bg-purple-950/80 text-white border border-purple-700' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {isChecked ? <CheckSquare className="w-4 h-4 text-purple-400 shrink-0" /> : <Square className="w-4 h-4 text-zinc-600 shrink-0" />}
                        <span className="truncate">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Save Subscription Plan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
