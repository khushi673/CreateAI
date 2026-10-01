'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CreditPackage } from '@/types';
import { 
  Zap, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Sparkles, 
  Gift, 
  SlidersHorizontal,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const AdminCreditManagement: React.FC = () => {
  const { 
    creditPackages, 
    addCreditPackage, 
    updateCreditPackage, 
    deleteCreditPackage,
    freePlanCredits,
    setFreePlanCredits,
    models,
    updateModelCreditCost,
    addToast
  } = useApp();

  // Free Credits Form
  const [tempFreeCredits, setTempFreeCredits] = useState<number>(freePlanCredits);

  // Model Cost Form State
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [tempModelCost, setTempModelCost] = useState<number>(15);

  // Package Modal State
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState(10);
  const [pkgCredits, setPkgCredits] = useState(250);
  const [pkgBonusText, setPkgBonusText] = useState('');
  const [pkgIsPopular, setPkgIsPopular] = useState(false);

  const handleSaveFreeCredits = (e: React.FormEvent) => {
    e.preventDefault();
    setFreePlanCredits(tempFreeCredits);
    addToast('Free Credits Updated', `Default sign up bonus set to ${tempFreeCredits} credits`, 'success');
  };

  const handleOpenNewPackage = () => {
    setEditingPackage(null);
    setPkgName('');
    setPkgPrice(25);
    setPkgCredits(750);
    setPkgBonusText('+100 Bonus');
    setPkgIsPopular(false);
    setPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg: CreditPackage) => {
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgPrice(pkg.price);
    setPkgCredits(pkg.credits);
    setPkgBonusText(pkg.bonusText || '');
    setPkgIsPopular(!!pkg.isPopular);
    setPackageModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) return;

    if (editingPackage) {
      updateCreditPackage(editingPackage.id, {
        name: pkgName,
        price: pkgPrice,
        credits: pkgCredits,
        bonusText: pkgBonusText,
        isPopular: pkgIsPopular,
      });
    } else {
      addCreditPackage({
        name: pkgName,
        price: pkgPrice,
        credits: pkgCredits,
        bonusText: pkgBonusText,
        isPopular: pkgIsPopular,
        active: true,
      });
    }
    setPackageModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            <h2 className="text-xl font-black text-white">Credit & Pricing Administration</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Customize top-up credit packages, set free signup bonus credits, and adjust per-model credit rates.
          </p>
        </div>

        <button
          onClick={handleOpenNewPackage}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950"
        >
          <Plus className="w-4 h-4" />
          Create Credit Package
        </button>
      </div>

      {/* Section 1: Free Plan Sign-up Bonus Credits */}
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Gift className="w-5 h-5" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Free Plan Default Signup Bonus Credits
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          Number of bonus credits granted automatically to new user accounts upon registration.
        </p>

        <form onSubmit={handleSaveFreeCredits} className="flex items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min="0"
              value={tempFreeCredits}
              onChange={(e) => setTempFreeCredits(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white font-bold font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-extrabold transition-all shadow-md shadow-amber-950 flex items-center gap-1 shrink-0"
          >
            <Save className="w-4 h-4" /> Save Default
          </button>
        </form>
      </div>

      {/* Section 2: AI Model Credit Rates Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            AI Model Render Credit Costs
          </h3>
          <span className="text-xs text-zinc-400">Updates costs across Create Studio in real-time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m) => {
            const isEditing = editingModelId === m.id;
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">{m.provider}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{m.name}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{m.description}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="number"
                        min="1"
                        value={tempModelCost}
                        onChange={(e) => setTempModelCost(Number(e.target.value))}
                        className="w-20 bg-zinc-950 border border-purple-500 rounded-lg p-1 text-xs text-white text-center font-bold"
                      />
                      <button
                        onClick={() => {
                          updateModelCreditCost(m.id, tempModelCost);
                          setEditingModelId(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingModelId(null)}
                        className="text-zinc-400 hover:text-white p-1 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-extrabold text-amber-400">⚡ {m.creditCost} Credits</span>
                      <button
                        onClick={() => {
                          setEditingModelId(m.id);
                          setTempModelCost(m.creditCost);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Rate
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Credit Top-up Packages Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Credit Top-Up Packages Store
          </h3>
          <button
            onClick={handleOpenNewPackage}
            className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
          >
            + Add New Package
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between relative transition-all ${
                pkg.isPopular ? 'bg-purple-950/40 border-purple-500 shadow-xl' : 'bg-zinc-900/80 border-zinc-800'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 right-4 px-2 py-0.5 rounded text-[9px] font-extrabold bg-purple-600 text-white uppercase">
                  POPULAR
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase">{pkg.name}</span>
                  {pkg.bonusText && (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded">
                      {pkg.bonusText}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-2xl font-black text-white">${pkg.price}</span>
                  <span className="text-xs text-zinc-400">USD</span>
                </div>

                <p className="text-xs font-bold text-amber-400">⚡ {pkg.credits} Credits</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-1">
                <button
                  onClick={() => updateCreditPackage(pkg.id, { active: !pkg.active })}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    pkg.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {pkg.active ? 'ACTIVE' : 'INACTIVE'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditPackage(pkg)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                    title="Edit Package"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCreditPackage(pkg.id)}
                    className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800"
                    title="Delete Package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Add / Edit Credit Package */}
      {packageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl">
            <button
              onClick={() => setPackageModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">
              {editingPackage ? 'Edit Credit Package' : 'Create New Credit Package'}
            </h3>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="e.g. Pro Creator Pack"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Credits Included</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={pkgCredits}
                    onChange={(e) => setPkgCredits(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Bonus Tag (Optional)</label>
                <input
                  type="text"
                  value={pkgBonusText}
                  onChange={(e) => setPkgBonusText(e.target.value)}
                  placeholder="e.g. +200 Bonus Credits"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={pkgIsPopular}
                  onChange={(e) => setPkgIsPopular(e.target.checked)}
                  className="accent-purple-500 w-4 h-4 rounded"
                />
                <span>Highlight with "MOST POPULAR" badge</span>
              </label>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPackageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Save Package
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
