'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Users, Sparkles, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { PageHeader, Card, Stat, money, num } from './ui';
import { INITIAL_JOBS, INITIAL_FAILED, INITIAL_REFUNDS, DAILY_GENERATIONS, MODEL_USAGE } from '@/data/adminMock';
import { getModel } from '@/data/mockData';
import { computeFinance } from '@/lib/finance';

const STATUSES = [
  { status: 'Completed', bar: 'bg-emerald-500' },
  { status: 'Processing', bar: 'bg-sky-500' },
  { status: 'Queued', bar: 'bg-amber-500' },
  { status: 'Failed', bar: 'bg-rose-500' },
] as const;

export const AdminDashboard: React.FC = () => {
  const { adminUsers, creditPackages, models, chatModels } = useApp();
  const totalGens = adminUsers.reduce((s, u) => s + u.totalGenerations, 0);
  const active = INITIAL_JOBS.filter((j) => j.status === 'Queued' || j.status === 'Processing').length;
  const failed = INITIAL_JOBS.filter((j) => j.status === 'Failed').length;
  const failRate = ((failed / INITIAL_JOBS.length) * 100).toFixed(1);
  const fin = computeFinance(creditPackages, models, chatModels);

  const dailyMax = Math.max(...DAILY_GENERATIONS.map((d) => d.count));
  const usageMax = Math.max(...MODEL_USAGE.map((m) => m.count));

  const attention = [
    { label: 'Failed generations not refunded', value: INITIAL_FAILED.filter((f) => !f.refunded).length },
    { label: 'Refund requests pending', value: INITIAL_REFUNDS.filter((r) => r.status === 'Pending').length },
    { label: 'Suspended users', value: adminUsers.filter((u) => u.status === 'Suspended').length },
    { label: 'Users with 0 credits', value: adminUsers.filter((u) => u.credits === 0).length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="See how the platform is doing today and what needs your attention." />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <Stat label="Users" value={num(adminUsers.length)} sub={`${adminUsers.filter((u) => u.status === 'Active').length} active`} icon={<Users className="w-4 h-4" />} />
        <Stat label="Generations" value={num(totalGens)} icon={<Sparkles className="w-4 h-4" />} />
        <Stat label="Revenue (30 days)" value={money(fin.revenue)} sub={`Paid to providers ${money(fin.providerCost)}`} icon={<DollarSign className="w-4 h-4" />} tone="text-emerald-400" />
        <Stat label="Active generations" value={String(active)} sub="Queued and processing" icon={<Activity className="w-4 h-4" />} tone="text-sky-400" />
        <Stat label="Failure rate" value={`${failRate}%`} sub={`${failed} of ${INITIAL_JOBS.length} recent generations`} icon={<AlertTriangle className="w-4 h-4" />} tone="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="Generations per day" subtitle="Last 7 days" className="xl:col-span-2">
          <div className="flex items-end gap-3 h-44">
            {DAILY_GENERATIONS.map((d) => (
              <div key={d.day} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400">{d.count}</span>
                <div className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-rose-700 to-rose-500" style={{ height: `${(d.count / dailyMax) * 80}%` }} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2 pt-2 border-t border-zinc-800">
            {DAILY_GENERATIONS.map((d) => (
              <div key={d.day} className="flex-1 text-center text-[10px] font-bold text-zinc-500">{d.day}</div>
            ))}
          </div>
        </Card>

        <Card title="Generations by status" subtitle="Recent generations">
          <div className="flex h-3 rounded-full overflow-hidden bg-zinc-800 mb-4">
            {STATUSES.map((s) => {
              const n = INITIAL_JOBS.filter((j) => j.status === s.status).length;
              return <div key={s.status} className={s.bar} style={{ width: `${(n / INITIAL_JOBS.length) * 100}%` }} />;
            })}
          </div>
          <ul className="space-y-2.5">
            {STATUSES.map((s) => (
              <li key={s.status} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-zinc-300">
                  <i className={`w-2.5 h-2.5 rounded-sm ${s.bar}`} />
                  {s.status}
                </span>
                <span className="font-bold text-white">{INITIAL_JOBS.filter((j) => j.status === s.status).length}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="Top models by usage" subtitle="Generations this month" className="xl:col-span-2">
          <ul className="space-y-3">
            {MODEL_USAGE.map((m) => (
              <li key={m.modelId} className="flex items-center gap-3 text-xs">
                <span className="w-28 shrink-0 font-semibold text-zinc-200 truncate">{getModel(m.modelId).name}</span>
                <div className="flex-1 h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-rose-500" style={{ width: `${(m.count / usageMax) * 100}%` }} />
                </div>
                <span className="w-10 text-right font-bold text-white">{m.count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Needs attention">
          <ul className="divide-y divide-zinc-800">
            {attention.map((a) => (
              <li key={a.label} className="flex items-center justify-between py-2.5 text-xs">
                <span className="text-zinc-300">{a.label}</span>
                <span className={`min-w-7 text-center px-2 py-0.5 rounded-full font-extrabold ${a.value > 0 ? 'bg-amber-500/15 text-amber-300' : 'bg-zinc-800 text-zinc-500'}`}>{a.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
