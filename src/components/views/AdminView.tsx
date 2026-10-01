'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  Film, 
  Cpu, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Power
} from 'lucide-react';
import { MOCK_ADMIN_STATS, AI_MODELS } from '@/data/mockData';

export const AdminView: React.FC = () => {
  const { addToast } = useApp();

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Platform Admin Dashboard</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-950 text-rose-300 border border-rose-800">
              SUPERADMIN MODE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            GPU cluster telemetry, active render queue, platform telemetry, and revenue monitoring.
          </p>
        </div>

        <button
          onClick={() => addToast('Cluster Refreshed', 'Synced latest GPU cluster telemetry', 'info')}
          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
          Refresh Stats
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase">Total Registered</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{MOCK_ADMIN_STATS.totalUsers}</div>
          <p className="text-[10px] text-emerald-400 font-semibold">+1,240 this week</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase">Total Renders</span>
            <Film className="w-4 h-4 text-fuchsia-400" />
          </div>
          <div className="text-2xl font-black text-white">{MOCK_ADMIN_STATS.totalGenerations}</div>
          <p className="text-[10px] text-purple-400 font-semibold">142k this month</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase">GPU Load</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{MOCK_ADMIN_STATS.gpuUsagePercent}%</div>
          <p className="text-[10px] text-zinc-400 font-mono">{MOCK_ADMIN_STATS.gpuNodesOnline}</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase">Active Queue</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{MOCK_ADMIN_STATS.activeQueueLength} Jobs</div>
          <p className="text-[10px] text-emerald-400 font-semibold">Avg wait: 4.2s</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase">MRR Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{MOCK_ADMIN_STATS.monthlyRevenue}</div>
          <p className="text-[10px] text-emerald-400 font-semibold">+18.4% vs last mo</p>
        </div>
      </div>

      {/* AI Model Management Table */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Deployed Neural Model Engines</h2>
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Model Engine</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Credit Cost</th>
                <th className="py-3 px-4">Cluster Health</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {AI_MODELS.map((model) => (
                <tr key={model.id} className="hover:bg-zinc-900/40">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span>{model.icon}</span>
                    <span>{model.name}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-mono">{model.provider}</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">⚡ {model.creditCost}</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => addToast('Status Toggled', `Engine ${model.name} status updated`, 'info')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-extrabold uppercase"
                    >
                      ONLINE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Logs */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Cluster Logs & Event Trace</h2>
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs space-y-2 text-zinc-300">
          {MOCK_ADMIN_STATS.recentLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-zinc-500">{log.time}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                log.type === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400' :
                log.type === 'WARNING' ? 'bg-amber-950 text-amber-400' : 'bg-purple-950 text-purple-400'
              }`}>
                [{log.type}]
              </span>
              <span>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
