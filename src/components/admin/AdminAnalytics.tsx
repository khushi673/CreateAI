'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Card, Stat, Badge, Table, Tr, Td, inputCls, money, num } from './ui';
import { RevenueCostChart } from './charts';
import { DollarSign, Cpu, TrendingUp, Percent } from 'lucide-react';
import { BASE_TOTALS, DATE_RANGES, MONTHLY_SERIES, PACK_UNITS_SOLD, MODEL_USAGE, CHAT_USAGE } from '@/data/adminMock';

const usd = (n: number) => '$' + n.toFixed(2);
const marginTone = (m: number) => (m >= 50 ? 'green' : m >= 25 ? 'amber' : 'red');

export const AdminAnalytics: React.FC = () => {
  const { creditPackages, models, chatModels, updateModel, updateChatModel } = useApp();
  const [rangeId, setRangeId] = useState('30d');
  const f = DATE_RANGES.find((r) => r.id === rangeId)!.factor;

  // Average provider cost per credit, derived from each model's cost and how much it is used
  const usageRows = [
    ...models.map((m) => ({ cost: m.providerCost, credits: m.creditCost, uses: MODEL_USAGE.find((u) => u.modelId === m.id)?.count ?? 0 })),
    ...chatModels.map((m) => ({ cost: m.providerCost, credits: m.creditCost, uses: CHAT_USAGE[m.id] ?? 0 })),
  ];
  const usedCredits = usageRows.reduce((t, r) => t + r.credits * r.uses, 0);
  const costPerCredit = usedCredits ? usageRows.reduce((t, r) => t + r.cost * r.uses, 0) / usedCredits : 0;

  const revenue = BASE_TOTALS.revenue * f;
  const cost = BASE_TOTALS.cost * f;
  const profit = revenue - cost;
  const margin = (profit / revenue) * 100;
  const series = MONTHLY_SERIES.map((d) => ({ ...d, revenue: d.revenue * (0.9 + f * 0.04), cost: d.cost * (0.9 + f * 0.04) }));

  // Profit per credit pack = sale price - credits x provider cost per credit
  const packRows = creditPackages.map((p) => {
    const packCost = p.credits * costPerCredit;
    const packProfit = p.price - packCost;
    const sold = (PACK_UNITS_SOLD[p.id] ?? 0) * f;
    return { pack: p, packCost, packProfit, marginPct: p.price ? (packProfit / p.price) * 100 : 0, sold };
  });
  const packTotals = packRows.reduce((t, r) => ({ revenue: t.revenue + r.pack.price * r.sold, cost: t.cost + r.packCost * r.sold }), { revenue: 0, cost: 0 });

  // Profit per generation = credits charged x average sale price per credit - provider cost
  const soldCredits = packRows.reduce((s, r) => s + r.pack.credits * r.sold, 0);
  const avgPricePerCredit = soldCredits ? packTotals.revenue / soldCredits : 0;
  const modelRows = [
    ...models.map((m) => ({ id: m.id, name: m.name, per: 'per generation', creditCost: m.creditCost, providerCost: m.providerCost, chat: false })),
    ...chatModels.map((m) => ({ id: m.id, name: m.name, per: 'per message', creditCost: m.creditCost, providerCost: m.providerCost, chat: true })),
  ].map((m) => {
    const revenuePerGen = m.creditCost * avgPricePerCredit;
    const p = revenuePerGen - m.providerCost;
    return { ...m, revenuePerGen, profit: p, marginPct: revenuePerGen ? (p / revenuePerGen) * 100 : 0 };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost vs revenue"
        description="What you earn from credit sales, what you pay AI providers, and what is left."
        actions={
          <select value={rangeId} onChange={(e) => setRangeId(e.target.value)} className={inputCls + ' !w-auto'} aria-label="Date range">
            {DATE_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Stat label="Revenue" value={money(revenue)} sub={`${num(BASE_TOTALS.creditsSold * f)} credits sold`} icon={<DollarSign className="w-4 h-4" />} tone="text-emerald-400" />
        <Stat label="Paid to AI providers" value={money(cost)} sub={`${num(BASE_TOTALS.creditsUsed * f)} credits used`} icon={<Cpu className="w-4 h-4" />} tone="text-purple-400" />
        <Stat label="Profit" value={money(profit)} icon={<TrendingUp className="w-4 h-4" />} tone="text-emerald-400" />
        <Stat label="Margin" value={`${margin.toFixed(1)}%`} icon={<Percent className="w-4 h-4" />} tone="text-sky-400" />
      </div>

      <Card
        title="Profit per credit pack"
        subtitle={`Profit = sale price − your cost. Your cost uses the average provider cost of ${usd(costPerCredit * 1000)} per 1,000 credits, taken from the model costs below.`}
      >
        <Table head={['Credit pack', 'Sale price', 'Your cost', 'Profit']} empty={packRows.length === 0}>
          {packRows.map((r) => (
            <Tr key={r.pack.id}>
              <Td>
                <div className="font-bold text-white">{r.pack.name}</div>
                <div className="text-[11px] text-zinc-500">{num(r.pack.credits)} credits</div>
              </Td>
              <Td>{usd(r.pack.price)}</Td>
              <Td className="text-zinc-400">{usd(r.packCost)}</Td>
              <Td>
                <span className={`font-bold ${r.packProfit < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{usd(r.packProfit)}</span>{' '}
                <Badge tone={marginTone(r.marginPct)}>{r.marginPct.toFixed(0)}%</Badge>
              </Td>
            </Tr>
          ))}
        </Table>
        <p className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
          Total profit from pack sales in this period: <strong className="text-emerald-300">{money(packTotals.revenue - packTotals.cost)}</strong>
        </p>
      </Card>

      <Card title="Profit per model" subtitle="Change what you pay the provider and everything on this page updates.">
        <Table head={['Model', 'You earn', 'You pay the provider (USD)', 'Profit']} empty={modelRows.length === 0}>
          {modelRows.map((r) => (
            <Tr key={r.id}>
              <Td>
                <div className="font-bold text-white">{r.name}</div>
                <div className="text-[11px] text-zinc-500">{r.per}</div>
              </Td>
              <Td>{usd(r.revenuePerGen)}</Td>
              <Td>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                  <input
                    type="number"
                    min={0}
                    step="0.001"
                    defaultValue={r.providerCost}
                    onChange={(e) => {
                      const v = Math.max(0, Number(e.target.value) || 0);
                      if (r.chat) updateChatModel(r.id, { providerCost: v });
                      else updateModel(r.id, { providerCost: v });
                    }}
                    aria-label={`Provider cost for ${r.name}`}
                    className={inputCls + ' !pl-6 !py-1.5 font-mono'}
                  />
                </div>
              </Td>
              <Td>
                <span className={`font-bold ${r.profit < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{usd(r.profit)}</span>{' '}
                <Badge tone={marginTone(r.marginPct)}>{r.marginPct.toFixed(0)}%</Badge>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <Card title="Revenue vs cost" subtitle="Last 6 months">
        <RevenueCostChart data={series} />
      </Card>
    </div>
  );
};
