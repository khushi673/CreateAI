'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminUserItem } from '@/types';
import { Search, Eye, Coins, Ban, CheckCircle2 } from 'lucide-react';
import { PageHeader, Table, Tr, Td, Badge, statusTone, Modal, Field, inputCls, btnPrimary, btnGhost, btnSmall, Avatar, num } from './ui';
import { USER_EXTRAS } from '@/data/adminMock';

export const AdminUsers: React.FC = () => {
  const { adminUsers, toggleUserStatus, adjustUserCredits, subscriptionPlans, updateUserPlan } = useApp();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [plan, setPlan] = useState('All');
  const [viewId, setViewId] = useState<string | null>(null);
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [suspendId, setSuspendId] = useState<string | null>(null);

  const [delta, setDelta] = useState('');
  const [sign, setSign] = useState<1 | -1>(1);
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');

  const rows = useMemo(
    () =>
      adminUsers.filter(
        (u) =>
          (status === 'All' || u.status === status) &&
          (plan === 'All' || u.plan === plan) &&
          (u.name + u.email).toLowerCase().includes(q.toLowerCase())
      ),
    [adminUsers, q, status, plan]
  );

  const byId = (id: string | null): AdminUserItem | undefined => adminUsers.find((u) => u.id === id);
  const viewUser = byId(viewId);
  const adjustUser = byId(adjustId);
  const suspendUser = byId(suspendId);

  const openAdjust = (id: string) => {
    setAdjustId(id);
    setDelta('');
    setReason('');
    setSign(1);
    setErr('');
  };

  const submitAdjust = () => {
    const n = parseInt(delta, 10);
    if (!n || n <= 0) return setErr('Enter a positive amount.');
    if (!reason.trim()) return setErr('A reason is required.');
    adjustUserCredits(adjustId!, sign * n, reason.trim());
    setAdjustId(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="User management" description="Find a user, then add or remove their credits or suspend their account." />

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" className={inputCls + ' pl-9'} />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls + ' lg:!w-40'} aria-label="Status filter">
          {['All', 'Active', 'Suspended'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputCls + ' lg:!w-40'} aria-label="Plan filter">
          {['All', 'Free', 'Basic', 'Pro', 'Enterprise'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <Table head={['User', 'Status', 'Plan', 'Credit balance', 'Credits used', 'Actions']} empty={rows.length === 0} emptyText="No users match your filters">
        {rows.map((u) => (
          <Tr key={u.id}>
            <Td>
              <div className="flex items-center gap-3">
                <Avatar src={u.avatar} name={u.name} />
                <div className="min-w-0">
                  <div className="font-bold text-white">{u.name}</div>
                  <div className="text-[11px] text-zinc-500">{u.email}</div>
                </div>
              </div>
            </Td>
            <Td><Badge tone={statusTone(u.status)}>{u.status}</Badge></Td>
            <Td><Badge tone="purple">{u.plan}</Badge></Td>
            <Td className="font-mono text-zinc-200">{num(u.credits)}</Td>
            <Td className="font-mono text-zinc-400">{num(USER_EXTRAS[u.id]?.creditsUsed ?? 0)}</Td>
            <Td>
              <div className="flex gap-1.5">
                <button className={btnSmall} onClick={() => setViewId(u.id)}><Eye className="w-3 h-3" />View user</button>
                <button className={btnSmall} onClick={() => openAdjust(u.id)}><Coins className="w-3 h-3" />Adjust credits</button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {viewUser && (
        <Modal title="User details" onClose={() => setViewId(null)} wide footer={<button className={btnGhost} onClick={() => setViewId(null)}>Close</button>}>
          <div className="flex items-center gap-4">
            <Avatar src={viewUser.avatar} name={viewUser.name} size={56} />
            <div>
              <div className="text-base font-black text-white">{viewUser.name}</div>
              <div className="text-xs text-zinc-400">{viewUser.email} · {viewUser.role}</div>
              <div className="mt-1.5 flex gap-1.5"><Badge tone={statusTone(viewUser.status)}>{viewUser.status}</Badge><Badge tone="purple">{viewUser.plan}</Badge></div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              ['Credit balance', num(viewUser.credits)],
              ['Credits used', num(USER_EXTRAS[viewUser.id]?.creditsUsed ?? 0)],
              ['Generations', num(viewUser.totalGenerations)],
              ['Joined', viewUser.joinedAt],
            ].map(([l, v]) => (
              <div key={l} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <div className="text-[10px] uppercase font-bold text-zinc-500">{l}</div>
                <div className="text-sm font-black text-white mt-1">{v}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
            <p className="text-xs text-zinc-400">{viewUser.status === 'Active' ? 'Suspending blocks this user from signing in and generating.' : 'This account is suspended. Activating restores access.'}</p>
            {viewUser.status === 'Active' ? (
              <button className={btnSmall + ' !text-rose-300 shrink-0'} onClick={() => { setViewId(null); setSuspendId(viewUser.id); }}><Ban className="w-3 h-3" />Suspend user</button>
            ) : (
              <button className={btnSmall + ' !text-emerald-300 shrink-0'} onClick={() => toggleUserStatus(viewUser.id)}><CheckCircle2 className="w-3 h-3" />Activate user</button>
            )}
          </div>
          <Field label="Change plan" hint="Takes effect immediately for this user.">
            <select className={inputCls} value={viewUser.plan} onChange={(e) => updateUserPlan(viewUser.id, e.target.value)}>
              {subscriptionPlans.map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-2">Recent activity, last active {USER_EXTRAS[viewUser.id]?.lastActive ?? 'unknown'}</div>
            <ul className="space-y-2">
              {(USER_EXTRAS[viewUser.id]?.recent ?? ['No recent activity']).map((r) => (
                <li key={r} className="text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">{r}</li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

      {adjustUser && (
        <Modal
          title={`Adjust credits · ${adjustUser.name}`}
          onClose={() => setAdjustId(null)}
          footer={<><button className={btnGhost} onClick={() => setAdjustId(null)}>Cancel</button><button className={btnPrimary} onClick={submitAdjust}>Adjust credits</button></>}
        >
          <p className="text-xs text-zinc-400">Current balance: <b className="text-white">{num(adjustUser.credits)}</b> credits</p>
          <div className="flex gap-2">
            <button onClick={() => setSign(1)} className={sign === 1 ? btnPrimary : btnGhost}>Add credits</button>
            <button onClick={() => setSign(-1)} className={sign === -1 ? btnPrimary : btnGhost}>Remove credits</button>
          </div>
          <Field label="Amount" hint="Number of credits to add or remove."><input type="number" min={1} value={delta} onChange={(e) => { setDelta(e.target.value); setErr(''); }} className={inputCls} placeholder="e.g. 100" /></Field>
          <Field label="Reason" error={err} hint="Saved in the transaction history."><input value={reason} onChange={(e) => { setReason(e.target.value); setErr(''); }} className={inputCls} placeholder="Goodwill, support ticket #..." /></Field>
        </Modal>
      )}

      {suspendUser && (
        <Modal
          title="Suspend user?"
          onClose={() => setSuspendId(null)}
          footer={<><button className={btnGhost} onClick={() => setSuspendId(null)}>Cancel</button><button className={btnPrimary} onClick={() => { toggleUserStatus(suspendUser.id); setSuspendId(null); }}>Suspend user</button></>}
        >
          <p className="text-sm text-zinc-300"><b>{suspendUser.name}</b> will lose access to the platform and queued jobs will stop. You can reactivate them at any time.</p>
        </Modal>
      )}
    </div>
  );
};
