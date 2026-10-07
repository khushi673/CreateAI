'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Card, Stat, Badge, Table, Tr, Td, inputCls, money, num } from './ui';
import { RevenueCostChart } from './charts';
import { DollarSign, Cpu, Coins, Flame, TrendingUp, Percent } from 'lucide-react';
import { BASE_TOTALS, DATE_RANGES, MODEL_COST_SHARE, MONTHLY_SERIES, PACK_UNITS_SOLD, PROVIDER_COST_PER_GENERATION } from '@/data/adminMock';
import { getModel } from '@/data/mockData';

const usd = (n: number) => '$' + n.toFixed(2);
const marginTone = (m: number) => (m >= 50 ? 'green' : m >= 25 ? 'amber' : 'red');

export const AdminAnalytics: React.FC = () => {
  const { creditPackages, models } = useApp();
  const [rangeId, setRangeId] = useState('30d');
  /** What the admin pays the AI provider for 1,000 credits' worth of generations */
  const [costPer1000, setCostPer1000] = useState('12');
  const f = DATE_RANGES.find((r) => r.id === rangeId)!.factor;
  const costPerCredit = (Number(costPer1000) || 0) / 1000;

  const revenue = BASE_TOTALS.revenue * f;
  const cost = BASE_TOTALS.cost * f;
  const profit = revenue - cost;
  const margin = (profit / revenue) * 100;
  const maxCost = Math.max(...MODEL_COST_SHARE.map((m) => m.cost));
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
  const modelRows = models.map((m) => {
    const revenuePerGen = m.creditCost * avgPricePerCredit;
    const providerCost = PROVIDER_COST_PER_GENERATION[m.id] ?? 0;
    const p = revenuePerGen - providerCost;
    return { m, revenuePerGen, providerCost, profit: p, marginPct: revenuePerGen ? (p / revenuePerGen) * 100 : 0 };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost vs revenue"
        description="See how much you earn from credit sales versus what you pay AI providers."
        actions={
          <select value={rangeId} onChange={(e) => setRangeId(e.target.value)} className={inputCls + ' !w-auto'} aria-label="Date range">
            {DATE_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <Stat label="Revenue" value={money(revenue)} icon={<DollarSign className="w-4 h-4" />} tone="text-emerald-400" />
        <Stat label="Paid to AI providers" value={money(cost)} icon={<Cpu className="w-4 h-4" />} tone="text-purple-400" />
        <Stat label="Profit" value={money(profit)} icon={<TrendingUp className="w-4 h-4" />} tone="text-emerald-400" />
        <Stat label="Margin" value={`${margin.toFixed(1)}%`} icon={<Percent className="w-4 h-4" />} tone="text-sky-400" />
        <Stat label="Credits sold" value={num(BASE_TOTALS.creditsSold * f)} icon={<Coins className="w-4 h-4" />} />
        <Stat label="Credits used" value={num(BASE_TOTALS.creditsUsed * f)} icon={<Flame className="w-4 h-4" />} tone="text-amber-400" />
      </div>

      <Card
        title="Profit per credit pack"
        subtitle="Profit = sale price − your cost. Your cost = credits × what the provider charges per credit."
        right={
          <label className="flex items-center gap-2 text-[11px] text-zinc-400">
            Provider cost per 1,000 credits
            <span className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
              <input
                type="number"
                min={0}
                step="0.5"
                value={costPer1000}
                onChange={(e) => setCostPer1000(e.target.value)}
                className={inputCls + ' !w-24 !pl-6'}
                aria-label="Provider cost per 1,000 credits"
              />
            </span>
          </label>
        }
      >
        <Table head={['Credit pack', 'Credits', 'Sale price', 'Your cost', 'Profit', 'Margin', 'Sold', 'Total profit']} empty={packRows.length === 0}>
          {packRows.map((r) => (
            <Tr key={r.pack.id}>
              <Td className="font-bold text-white">{r.pack.name}</Td>
              <Td>{num(r.pack.credits)}</Td>
              <Td>{usd(r.pack.price)}</Td>
              <Td className="text-zinc-400">{usd(r.packCost)}</Td>
              <Td className={r.packProfit < 0 ? 'text-rose-300 font-bold' : 'text-emerald-300 font-bold'}>{usd(r.packProfit)}</Td>
              <Td><Badge tone={marginTone(r.marginPct)}>{r.marginPct.toFixed(0)}%</Badge></Td>
              <Td>{num(r.sold)}</Td>
              <Td className={r.packProfit < 0 ? 'text-rose-300' : 'text-emerald-300'}>{money(r.packProfit * r.sold)}</Td>
            </Tr>
          ))}
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-zinc-800 text-xs">
          <span className="text-zinc-400">Credit pack sales in this period</span>
          <span className="text-zinc-300">
            Revenue <strong className="text-white">{money(packTotals.revenue)}</strong>
            <span className="mx-2 text-zinc-600">·</span>
            Provider cost <strong className="text-white">{money(packTotals.cost)}</strong>
            <span className="mx-2 text-zinc-600">·</span>
            Profit <strong className="text-emerald-300">{money(packTotals.revenue - packTotals.cost)}</strong>
          </span>
        </div>
      </Card>

      <Card title="Profit per generation" subtitle={`Per generation. You earn the credits charged at an average ${usd(avgPricePerCredit * 1000)} per 1,000 credits, and pay the provider the cost shown.`}>
        <Table head={['Model', 'Credits charged', 'You earn', 'You pay the provider', 'Profit', 'Margin']} empty={modelRows.length === 0}>
          {modelRows.map((r) => (
            <Tr key={r.m.id}>
              <Td className="font-bold text-white">{r.m.name}</Td>
              <Td>{r.m.creditCost}</Td>
              <Td>{usd(r.revenuePerGen)}</Td>
              <Td className="text-zinc-400">{usd(r.providerCost)}</Td>
              <Td className={r.profit < 0 ? 'text-rose-300 font-bold' : 'text-emerald-300 font-bold'}>{usd(r.profit)}</Td>
              <Td><Badge tone={marginTone(r.marginPct)}>{r.marginPct.toFixed(0)}%</Badge></Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="Revenue vs cost" subtitle="Last 6 months">
          <RevenueCostChart data={series} />
        </Card>
        <Card title="Cost by model" subtitle={DATE_RANGES.find((r) => r.id === rangeId)!.label}>
          <ul className="space-y-3">
            {MODEL_COST_SHARE.map((m) => (
              <li key={m.modelId}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-zinc-200">{getModel(m.modelId).name}</span>
                  <span className="text-zinc-400">{money(m.cost * f)}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-purple-500" style={{ width: `${(m.cost / maxCost) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
