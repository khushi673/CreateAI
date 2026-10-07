'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RotateCcw, Undo2 } from 'lucide-react';
import { PageHeader, Table, Tr, Td, Badge, statusTone, Toggle, btnSmall } from './ui';
import { INITIAL_JOBS, NEW_JOB_POOL, AdminJob, JobStatus } from '@/data/adminMock';
import { getModel } from '@/data/mockData';

const TABS: ('All' | JobStatus)[] = ['All', 'Queued', 'Processing', 'Completed', 'Failed'];

export const AdminMonitoring: React.FC = () => {
  const { addToast, adjustUserCredits } = useApp();
  const [jobs, setJobs] = useState<AdminJob[]>(INITIAL_JOBS);
  const [tab, setTab] = useState<'All' | JobStatus>('All');
  const [auto, setAuto] = useState(true);
  const counter = useRef(70422);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      setJobs((prev) => {
        let next = prev.map((j) => ({ ...j }));
        const proc = next.find((j) => j.status === 'Processing');
        if (proc) proc.status = Math.random() < 0.12 ? 'Failed' : 'Completed';
        if (proc && proc.status === 'Failed') proc.error = 'Provider error (502)';
        const queued = next.find((j) => j.status === 'Queued');
        if (queued) queued.status = 'Processing';
        if (next.filter((j) => j.status === 'Queued').length < 2) {
          const tpl = NEW_JOB_POOL[Math.floor(Math.random() * NEW_JOB_POOL.length)];
          counter.current += 1;
          next = [{ ...tpl, id: 'job_' + counter.current, status: 'Queued', time: 'Just now' }, ...next];
        }
        return next.slice(0, 40);
      });
    }, 3500);
    return () => clearInterval(t);
  }, [auto]);

  const count = (s: 'All' | JobStatus) => (s === 'All' ? jobs.length : jobs.filter((j) => j.status === s).length);
  const shown = jobs.filter((j) => tab === 'All' || j.status === tab);

  const retry = (id: string) => {
    setJobs((p) => p.map((j) => (j.id === id ? { ...j, status: 'Queued', error: undefined, time: 'Just now' } : j)));
    addToast('Generation re-queued', `${id} will be retried.`, 'info');
  };
  const refund = (j: AdminJob) => {
    adjustUserCredits(j.userId, j.cost, `Refund for ${j.id}`);
    setJobs((p) => p.map((x) => (x.id === j.id ? { ...x, refunded: true } : x)));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Generation monitoring"
        description="Watch generations as they run and retry or refund the ones that failed."
        actions={
          <label className="flex items-center gap-2 text-xs font-bold text-zinc-300">
            Live updates
            <Toggle on={auto} onChange={setAuto} label="Auto-refresh" />
          </label>
        }
      />
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${tab === t ? 'bg-rose-600/20 border-rose-700 text-rose-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}>
            {t} <span className="ml-1 text-[10px] opacity-70">{count(t)}</span>
          </button>
        ))}
      </div>
      <Table head={['Generation', 'User', 'Model', 'Type', 'Credits', 'Status', 'Time', 'Actions']} empty={shown.length === 0} emptyText="No generations with this status">
        {shown.map((j) => (
          <Tr key={j.id}>
            <Td className="font-mono text-zinc-400">{j.id}</Td>
            <Td className="font-bold text-white">{j.user}</Td>
            <Td>{getModel(j.modelId).name}</Td>
            <Td>{j.type}</Td>
            <Td className="font-mono">{j.cost}</Td>
            <Td>
              <Badge tone={statusTone(j.status)}>{j.status}</Badge>
              {j.status === 'Failed' && j.error && <div className="text-[10px] text-rose-400/80 mt-1">{j.error}</div>}
            </Td>
            <Td className="text-zinc-500 whitespace-nowrap">{j.time}</Td>
            <Td>
              {j.status === 'Failed' ? (
                <div className="flex gap-1.5">
                  <button className={btnSmall} onClick={() => retry(j.id)}><RotateCcw className="w-3 h-3" />Retry generation</button>
                  {j.refunded ? <Badge tone="green">Refunded</Badge> : <button className={btnSmall} onClick={() => refund(j)}><Undo2 className="w-3 h-3" />Refund credits</button>}
                </div>
              ) : <span className="text-zinc-700">-</span>}
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
};
