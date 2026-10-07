'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SubscriptionPlan } from '@/types';
import { Pencil, Plus, Trash2, Check } from 'lucide-react';
import { PageHeader, Card, Badge, Modal, Field, Toggle, inputCls, btnPrimary, btnGhost, btnSmall, num } from './ui';
import { AI_MODELS } from '@/data/mockData';

type Draft = Omit<SubscriptionPlan, 'id'> & { id?: string; featuresText: string };

const toDraft = (p?: SubscriptionPlan): Draft =>
  p
    ? { ...p, featuresText: p.features.join('\n') }
    : { name: '', monthlyPrice: 0, yearlyPrice: 0, monthlyCredits: 100, maxConcurrentJobs: 1, monthlyGenerationLimit: 50, allowedModelIds: [], active: true, description: '', features: [], featuresText: '' };

export const AdminSubscriptions: React.FC = () => {
  const { subscriptionPlans, updateSubscriptionPlan, addSubscriptionPlan, deleteSubscriptionPlan, addToast } = useApp();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const delPlan = subscriptionPlans.find((p) => p.id === delId);

  const num_ = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) => setDraft((d) => (d ? { ...d, [k]: Number(e.target.value) } : d));

  const save = () => {
    if (!draft) return;
    if (!draft.name.trim()) return addToast('Plan name is required', undefined, 'warning');
    if (draft.monthlyPrice < 0 || draft.yearlyPrice < 0 || draft.monthlyCredits < 0) return addToast('Invalid values', 'Prices and credits cannot be negative.', 'warning');
    const { id, featuresText, ...rest } = draft;
    const plan = { ...rest, features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean) };
    if (id) updateSubscriptionPlan(id, plan);
    else addSubscriptionPlan(plan);
    setDraft(null);
  };

  const toggleModel = (id: string) =>
    setDraft((d) => (d ? { ...d, allowedModelIds: d.allowedModelIds.includes(id) ? d.allowedModelIds.filter((x) => x !== id) : [...d.allowedModelIds, id] } : d));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription management"
        description="Review each plan's price, credits, limits and model access, and edit them."
        actions={<button className={btnPrimary} onClick={() => setDraft(toDraft())}><Plus className="w-3.5 h-3.5" />New plan</button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {subscriptionPlans.map((p) => (
          <Card key={p.id} className={p.active ? '' : 'opacity-60'}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">{p.name}</h3>
                  {p.isPopular && <Badge tone="purple">Popular</Badge>}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">{p.description}</p>
              </div>
              <Toggle on={p.active} onChange={(v) => updateSubscriptionPlan(p.id, { active: v })} label={`Toggle ${p.name}`} />
            </div>
            <div className="mt-4 text-2xl font-black text-white">${p.monthlyPrice}<span className="text-xs font-semibold text-zinc-500"> /mo</span></div>
            <div className="text-[11px] text-zinc-500">${p.yearlyPrice} /yr</div>
            <dl className="mt-4 space-y-1.5 text-[11px]">
              <div className="flex justify-between"><dt className="text-zinc-500">Monthly credits</dt><dd className="text-zinc-200 font-bold">{num(p.monthlyCredits)}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-500">Generation limit</dt><dd className="text-zinc-200 font-bold">{num(p.monthlyGenerationLimit)}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-500">Concurrent generations</dt><dd className="text-zinc-200 font-bold">{p.maxConcurrentJobs}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-500">Model access</dt><dd className="text-zinc-200 font-bold">{p.allowedModelIds.length}/{AI_MODELS.length}</dd></div>
            </dl>
            <ul className="mt-3 space-y-1">
              {p.features.slice(0, 4).map((f) => (
                <li key={f} className="flex gap-1.5 text-[11px] text-zinc-400"><Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />{f}</li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button className={btnSmall + ' flex-1 justify-center'} onClick={() => setDraft(toDraft(p))}><Pencil className="w-3 h-3" />Edit plan</button>
              <button className={btnSmall + ' !text-rose-300'} aria-label={`Delete ${p.name}`} onClick={() => setDelId(p.id)}><Trash2 className="w-3 h-3" /></button>
            </div>
          </Card>
        ))}
      </div>

      {draft && (
        <Modal title={draft.id ? `Edit ${draft.name} plan` : 'New plan'} wide onClose={() => setDraft(null)} footer={<><button className={btnGhost} onClick={() => setDraft(null)}>Cancel</button><button className={btnPrimary} onClick={save}>Save changes</button></>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Plan name"><input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Badge (optional)" hint="Short label on the pricing card, e.g. Best value."><input className={inputCls} value={draft.badge ?? ''} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} /></Field>
            <Field label="Monthly price ($)"><input type="number" min={0} className={inputCls} value={draft.monthlyPrice} onChange={num_('monthlyPrice')} /></Field>
            <Field label="Yearly price ($)" hint="Total billed for a year."><input type="number" min={0} className={inputCls} value={draft.yearlyPrice} onChange={num_('yearlyPrice')} /></Field>
            <Field label="Monthly credits" hint="Credits added to the user each month."><input type="number" min={0} className={inputCls} value={draft.monthlyCredits} onChange={num_('monthlyCredits')} /></Field>
            <Field label="Monthly generation limit" hint="Most generations a user can run per month."><input type="number" min={0} className={inputCls} value={draft.monthlyGenerationLimit} onChange={num_('monthlyGenerationLimit')} /></Field>
            <Field label="Max concurrent generations" hint="How many generations can run at the same time."><input type="number" min={1} className={inputCls} value={draft.maxConcurrentJobs} onChange={num_('maxConcurrentJobs')} /></Field>
            <Field label="Description"><input className={inputCls} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          </div>
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-0.5">Model access</div>
            <p className="text-[11px] text-zinc-600 mb-2">Tick the models users on this plan can use.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AI_MODELS.map((m) => (
                <label key={m.id} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 cursor-pointer hover:border-zinc-700">
                  <input type="checkbox" className="accent-rose-500" checked={draft.allowedModelIds.includes(m.id)} onChange={() => toggleModel(m.id)} />
                  {m.name}<span className="text-zinc-600 ml-auto">{m.provider}</span>
                </label>
              ))}
            </div>
          </div>
          <Field label="Features" hint="One per line"><textarea rows={4} className={inputCls} value={draft.featuresText} onChange={(e) => setDraft({ ...draft, featuresText: e.target.value })} /></Field>
          <div className="flex items-center justify-between"><span className="text-xs text-zinc-300">Mark as popular</span><Toggle on={!!draft.isPopular} onChange={(v) => setDraft({ ...draft, isPopular: v })} /></div>
          <div className="flex items-center justify-between"><span className="text-xs text-zinc-300">Active</span><Toggle on={draft.active} onChange={(v) => setDraft({ ...draft, active: v })} /></div>
        </Modal>
      )}

      {delPlan && (
        <Modal title="Delete plan?" onClose={() => setDelId(null)} footer={<><button className={btnGhost} onClick={() => setDelId(null)}>Cancel</button><button className={btnPrimary} onClick={() => { deleteSubscriptionPlan(delPlan.id); setDelId(null); }}>Delete plan</button></>}>
          <p className="text-sm text-zinc-300">Deleting <b>{delPlan.name}</b> removes it from the user pricing page. Users already on it are not refunded.</p>
        </Modal>
      )}
    </div>
  );
};
