'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Card, Stat, Table, Tr, Td, Tabs, Modal, Field, inputCls, btnGhost, btnSmall, money, num } from './ui';
import { DollarSign, Cpu, TrendingUp, Percent } from 'lucide-react';
import { DATE_RANGES } from '@/data/adminMock';
import { computeFinance } from '@/lib/finance';
import { estimateCost } from '@/lib/pricing';
import { AIModel, ChatModel } from '@/types';

const usd = (n: number) => '$' + (Math.abs(n) < 0.1 ? n.toFixed(3) : n.toFixed(2));
const secs = (d?: string) => parseInt(d ?? '', 10) || 1;
type Kind = 'all' | 'video' | 'image' | 'audio' | 'chat';

/** One normalised row for an AI model or a chat model */
interface Row {
  id: string; name: string; kind: Exclude<Kind, 'all'>; status: string; chat: boolean;
  /** Credits users spend per second / image / message, per resolution */
  rates: { label: string; credits: number; unit: string }[];
  example: string; exampleCredits: number;
  baseCredits: number; baseProviderCost: number; baseLabel: string;
}

function toRow(m: AIModel | ChatModel, chat: boolean): Row {
  if (chat) {
    const c = m as ChatModel;
    return {
      id: c.id, name: c.name, kind: 'chat', status: c.status, chat: true,
      rates: [{ label: 'Per message', credits: c.creditCost, unit: 'message' }],
      example: '1 message', exampleCredits: c.creditCost,
      baseCredits: c.creditCost, baseProviderCost: c.providerCost, baseLabel: '1 message',
    };
  }
  const a = m as AIModel;
  const kind = a.mediaTypes[0];
  const caps = a.capabilities;
  const baseDur = caps.durations?.[0];
  const baseSecs = secs(baseDur);
  const resFactor = (r: string) => a.costFactors.resolution?.[r] ?? 1;
  const rates =
    kind === 'image'
      ? (caps.resolutions ?? []).map((r) => ({ label: r, credits: Math.round(a.creditCost * resFactor(r)), unit: 'image' }))
      : kind === 'audio'
        ? [{ label: 'Any length', credits: +(a.creditCost / baseSecs).toFixed(1), unit: 'sec' }]
        : (caps.resolutions ?? []).map((r) => ({ label: r, credits: +((a.creditCost * resFactor(r)) / baseSecs).toFixed(1), unit: 'sec' }));
  const exDur = caps.durations ? (caps.durations.includes('10s') ? '10s' : caps.durations.includes('30s') && kind === 'audio' ? '30s' : caps.durations[Math.min(1, caps.durations.length - 1)]) : undefined;
  const exRes = caps.resolutions ? (caps.resolutions.includes('1080p') ? '1080p' : caps.resolutions[Math.min(1, caps.resolutions.length - 1)]) : undefined;
  return {
    id: a.id, name: a.name, kind, status: a.status, chat: false, rates,
    example: [exDur ? exDur.replace('s', ' sec') : '1 image', exRes].filter(Boolean).join(' · '),
    exampleCredits: estimateCost(a, exDur, exRes),
    baseCredits: a.creditCost, baseProviderCost: a.providerCost,
    baseLabel: [baseDur ? baseDur.replace('s', ' sec') : '1 generation', caps.resolutions?.[0]].filter(Boolean).join(' · '),
  };
}

export const AdminAnalytics: React.FC = () => {
  const { creditPackages, models, chatModels, updateModel, updateChatModel } = useApp();
  const [rangeId, setRangeId] = useState('30d');
  const [tab, setTab] = useState<Kind>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const f = DATE_RANGES.find((r) => r.id === rangeId)!.factor;
  const fin = computeFinance(creditPackages, models, chatModels, f);

  const rows = [...models.map((m) => toRow(m, false)), ...chatModels.map((m) => toRow(m, true))];
  const shown = rows.filter((r) => tab === 'all' || r.kind === tab);
  const detail = rows.find((r) => r.id === detailId);

  // Per-credit view of one model: what you pay the provider per credit, what the customer pays per credit
  const calc = (r: Row) => {
    const costPerCredit = r.baseCredits ? r.baseProviderCost / r.baseCredits : 0;
    const customer = r.exampleCredits * fin.pricePerCredit;
    const provider = r.exampleCredits * costPerCredit;
    return { costPerCredit, customer, provider, profit: customer - provider, margin: customer ? ((customer - provider) / customer) * 100 : 0 };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost vs revenue"
        description="What customers pay, what the AI providers cost you, and what you keep."
        actions={
          <select value={rangeId} onChange={(e) => setRangeId(e.target.value)} className={inputCls + ' !w-auto'} aria-label="Period">
            {DATE_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Stat label="Revenue" value={money(fin.revenue)} sub={`${num(fin.creditsSold)} credits sold`} icon={<DollarSign className="w-4 h-4" />} tone="text-emerald-400" />
        <Stat label="Paid to AI providers" value={money(fin.providerCost)} sub={`${num(fin.creditsUsed)} credits used`} icon={<Cpu className="w-4 h-4" />} tone="text-purple-400" />
        <Stat label="Profit" value={money(fin.profit)} icon={<TrendingUp className="w-4 h-4" />} tone="text-emerald-400" />
        <Stat label="Margin" value={`${fin.margin.toFixed(1)}%`} icon={<Percent className="w-4 h-4" />} tone="text-sky-400" />
      </div>

      <Card title="Credit packs" subtitle="What users pay for credits. Edit packs on the Credits page.">
        <Table head={['Pack', 'Credits', 'Customer price']} empty={creditPackages.length === 0}>
          {creditPackages.map((p) => (
            <Tr key={p.id}>
              <Td className="font-bold text-white">{p.name}</Td>
              <Td>{num(p.credits)}</Td>
              <Td>{usd(p.price)}</Td>
            </Tr>
          ))}
        </Table>
        {creditPackages[1] && <p className="mt-3 text-xs text-zinc-500">Example: {num(creditPackages[1].credits)} credits = {usd(creditPackages[1].price)}</p>}
      </Card>

      <section className="space-y-4">
        <Tabs
          tabs={[{ id: 'all', label: 'All models' }, { id: 'video', label: 'Video' }, { id: 'image', label: 'Image' }, { id: 'audio', label: 'Audio' }, { id: 'chat', label: 'Chat' }]}
          value={tab}
          onChange={(id) => setTab(id as Kind)}
        />

        <div>
          <h2 className="text-sm font-extrabold text-white">AI model pricing and profit</h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Credits users spend on each model, and for the example generation: what the customer pays, what the provider costs you, and what you keep.</p>
        </div>
        <Table head={['Model', 'Credits', 'Example', 'Customer pays', 'Provider cost', 'Profit', '']} empty={shown.length === 0}>
          {shown.map((r) => {
            const c = calc(r);
            return (
              <Tr key={r.id}>
                <Td>
                  <div className="font-bold text-white">{r.name}</div>
                  <div className="text-[11px] text-zinc-500 capitalize">{r.kind} · {r.status}</div>
                </Td>
                <Td>
                  {r.rates.map((x) => (
                    <div key={x.label} className="text-xs whitespace-nowrap">
                      <span className="text-zinc-500">{x.label}: </span>
                      <span className="font-semibold text-zinc-200">{x.credits}/{x.unit}</span>
                    </div>
                  ))}
                </Td>
                <Td>
                  <div className="text-zinc-300">{r.example}</div>
                  <div className="text-[11px] text-zinc-500">{r.exampleCredits} credits</div>
                </Td>
                <Td>{usd(c.customer)}</Td>
                <Td className="text-zinc-400">{usd(c.provider)}</Td>
                <Td><span className={`font-bold ${c.profit < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{usd(c.profit)}</span></Td>
                <Td><button className={btnSmall} onClick={() => setDetailId(r.id)}>View details</button></Td>
              </Tr>
            );
          })}
        </Table>
      </section>

      {detail && (() => {
        const c = calc(detail);
        const setProvider = (v: number) => {
          const cost = Math.max(0, v);
          if (detail.chat) updateChatModel(detail.id, { providerCost: cost });
          else updateModel(detail.id, { providerCost: cost });
        };
        return (
          <Modal title={`${detail.name} – cost details`} onClose={() => setDetailId(null)} footer={<button className={btnGhost} onClick={() => setDetailId(null)}>Close</button>}>
            <Field label={`What the provider charges you for ${detail.baseLabel} ($)`} hint="Change this and every figure on this page updates.">
              <input
                type="number" min={0} step="0.001" defaultValue={detail.baseProviderCost} className={inputCls + ' font-mono'}
                onChange={(e) => setProvider(Number(e.target.value) || 0)}
              />
            </Field>
            <dl className="text-xs divide-y divide-zinc-800 border border-zinc-800 rounded-xl">
              {[
                [`Example generation`, `${detail.example} = ${detail.exampleCredits} credits`],
                ['Customer pays (credits × average price per credit)', `${usd(detail.exampleCredits * fin.pricePerCredit)}`],
                ['Provider cost per credit', usd(c.costPerCredit)],
                ['Provider cost for the example', usd(c.provider)],
                ['Your profit', usd(c.profit)],
                ['Margin', `${c.margin.toFixed(0)}%`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 px-3 py-2">
                  <dt className="text-zinc-400">{k}</dt>
                  <dd className="font-bold text-white text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[11px] text-zinc-500">Average price per credit: {usd(fin.pricePerCredit)}, taken from the credit packs sold.</p>
          </Modal>
        );
      })()}
    </div>
  );
};
