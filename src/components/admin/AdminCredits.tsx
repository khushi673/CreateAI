'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CreditPackage } from '@/types';
import { Plus, Minus, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { PageHeader, Card, Table, Tr, Td, Badge, statusTone, Field, Modal, Toggle, inputCls, btnPrimary, btnGhost, btnSmall, Tabs, num } from './ui';
import { INITIAL_ADMIN_TX, INITIAL_FAILED, INITIAL_REFUNDS, AdminTx, FailedGen, RefundRow, TxType } from '@/data/adminMock';
import { getModel } from '@/data/mockData';

const TX_TYPES: ('All' | TxType)[] = ['All', 'Purchase', 'Subscription', 'Usage', 'Refund', 'Admin adjustment'];
const txTone = (t: TxType) => (t === 'Usage' ? 'zinc' : t === 'Refund' ? 'amber' : t === 'Admin adjustment' ? 'purple' : 'green');
type PkgDraft = Omit<CreditPackage, 'id'> & { id?: string };
const emptyPkg: PkgDraft = { name: '', price: 10, credits: 100, bonusText: '', isPopular: false, active: true };

export const AdminCredits: React.FC = () => {
  const { adminUsers, adjustUserCredits, addToast, creditPackages, addCreditPackage, updateCreditPackage, deleteCreditPackage } = useApp();
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ user?: string; amount?: string; reason?: string }>({});
  const [txs, setTxs] = useState<AdminTx[]>(INITIAL_ADMIN_TX);
  const [txFilter, setTxFilter] = useState<'All' | TxType>('All');
  const [refunds, setRefunds] = useState<RefundRow[]>(INITIAL_REFUNDS);
  const [failed, setFailed] = useState<FailedGen[]>(INITIAL_FAILED);
  const [pkg, setPkg] = useState<PkgDraft | null>(null);
  const [tab, setTab] = useState('adjust');
  const [delPkgId, setDelPkgId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const delPkg = creditPackages.find((p) => p.id === delPkgId);

  const apply = (sign: 1 | -1, confirmed = false) => {
    const n = parseInt(amount, 10);
    const e: typeof errors = {};
    if (!userId) e.user = 'Select a user.';
    if (!n || n <= 0) e.amount = 'Enter a positive amount.';
    if (!reason.trim()) e.reason = 'Reason is required.';
    setErrors(e);
    if (Object.keys(e).length) return;
    if (sign === -1 && !confirmed) return setConfirmRemove(true);
    const u = adminUsers.find((x) => x.id === userId)!;
    adjustUserCredits(userId, sign * n, reason.trim());
    setTxs((p) => [{ id: 'tx_' + Date.now(), user: u.name, type: 'Admin adjustment', detail: reason.trim(), amount: sign * n, date: 'Just now' }, ...p]);
    setAmount('');
    setReason('');
  };

  const refund = (f: FailedGen) => {
    adjustUserCredits(f.userId, f.credits, `Refund for ${f.id}`);
    setFailed((p) => p.map((x) => (x.id === f.id ? { ...x, refunded: true } : x)));
    setRefunds((p) => [{ id: 'rf_' + Date.now(), user: f.user, jobId: f.id, amount: f.credits, reason: f.error, status: 'Approved', date: 'Today' }, ...p]);
    setTxs((p) => [{ id: 'tx_' + Date.now(), user: f.user, type: 'Refund', detail: `Failed generation ${f.id}`, amount: f.credits, date: 'Just now' }, ...p]);
  };

  const setRefundStatus = (id: string, status: RefundRow['status']) => {
    setRefunds((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    addToast(`Refund ${status.toLowerCase()}`, id, status === 'Approved' ? 'success' : 'info');
  };

  const savePkg = () => {
    if (!pkg || !pkg.name.trim() || pkg.price < 0 || pkg.credits <= 0) {
      addToast('Invalid package', 'Name, price and credits are required.', 'warning');
      return;
    }
    const { id, ...rest } = pkg;
    if (id) updateCreditPackage(id, rest);
    else addCreditPackage(rest);
    setPkg(null);
  };

  const shownTx = txs.filter((t) => txFilter === 'All' || t.type === txFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="Credit management" description="Add or remove credits for a user and review refunds." />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'adjust', label: 'Adjust credits' },
          { id: 'transactions', label: 'Transactions' },
          { id: 'refunds', label: 'Refunds & failed generations', badge: refunds.filter((r) => r.status === 'Pending').length + failed.filter((f) => !f.refunded).length },
          { id: 'packs', label: 'Credit packs' },
        ]}
      />

      {tab === 'adjust' && <Card title="Add or remove credits" subtitle="Pick a user, enter how many credits, and say why. The change is saved in Transactions.">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
          <Field label="User" error={errors.user}>
            <select className={inputCls} value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="">Select user...</option>
              {adminUsers.map((u) => <option key={u.id} value={u.id}>{u.name} ({num(u.credits)} credits)</option>)}
            </select>
          </Field>
          <Field label="Amount" error={errors.amount} hint="Number of credits."><input type="number" min={1} className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100" /></Field>
          <Field label="Reason" error={errors.reason} hint="Shown in the transaction history."><input className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Goodwill credit" /></Field>
          <div className="flex gap-2 md:pt-[22px]">
            <button className={btnPrimary} onClick={() => apply(1)}><Plus className="w-3.5 h-3.5" />Add credits</button>
            <button className={btnGhost} onClick={() => apply(-1)}><Minus className="w-3.5 h-3.5" />Remove credits</button>
          </div>
        </div>
      </Card>}

      {tab === 'transactions' && <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold text-white">Credit transactions</h2>
          <select value={txFilter} onChange={(e) => setTxFilter(e.target.value as 'All' | TxType)} className={inputCls + ' !w-auto'} aria-label="Filter by type">
            {TX_TYPES.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All types' : t}</option>
            ))}
          </select>
        </div>
        <Table head={['User', 'Type', 'Detail', 'Amount', 'Date']} empty={shownTx.length === 0} emptyText="No transactions of this type">
          {shownTx.map((t) => (
            <Tr key={t.id}>
              <Td className="font-bold text-white">{t.user}</Td>
              <Td><Badge tone={txTone(t.type)}>{t.type}</Badge></Td>
              <Td className="text-zinc-400">{t.detail}</Td>
              <Td className={`font-mono font-bold ${t.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{t.amount > 0 ? '+' : ''}{num(t.amount)}</Td>
              <Td className="text-zinc-500 whitespace-nowrap">{t.date}</Td>
            </Tr>
          ))}
        </Table>
      </section>}

      {tab === 'refunds' && <>
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-extrabold text-white">Failed generations</h2>
          <p className="text-[11px] text-zinc-500">Generations that did not finish. Refund gives the credits back to the user.</p>
        </div>
        <Table head={['Job', 'User', 'Model', 'Error', 'Credits', 'Action']} empty={failed.length === 0}>
          {failed.map((f) => (
            <Tr key={f.id}>
              <Td className="font-mono text-zinc-500">{f.id}</Td>
              <Td className="font-bold text-white">{f.user}</Td>
              <Td>{getModel(f.modelId).name}</Td>
              <Td className="text-rose-300">{f.error}</Td>
              <Td className="font-mono">{f.credits}</Td>
              <Td>{f.refunded ? <Badge tone="green">Refunded</Badge> : <button className={btnSmall} onClick={() => refund(f)}><RotateCcw className="w-3 h-3" />Refund credits</button>}</Td>
            </Tr>
          ))}
        </Table>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-extrabold text-white">Refund requests</h2>
          <p className="text-[11px] text-zinc-500">Requests from users. Approve returns the credits; Reject keeps the balance unchanged.</p>
        </div>
        <Table head={['User', 'Job', 'Amount', 'Reason', 'Status', 'Action']} empty={refunds.length === 0}>
          {refunds.map((r) => (
            <Tr key={r.id}>
              <Td className="font-bold text-white">{r.user}</Td>
              <Td className="font-mono">{r.jobId}</Td>
              <Td className="font-mono">{r.amount}</Td>
              <Td className="text-zinc-400">{r.reason}</Td>
              <Td><Badge tone={statusTone(r.status)}>{r.status}</Badge></Td>
              <Td>
                {r.status === 'Pending' ? (
                  <div className="flex gap-1.5">
                    <button className={btnSmall} onClick={() => { const u = adminUsers.find((x) => x.name === r.user); if (u) adjustUserCredits(u.id, r.amount, `Refund ${r.jobId}`); setRefundStatus(r.id, 'Approved'); }}>Approve</button>
                    <button className={btnSmall} onClick={() => setRefundStatus(r.id, 'Rejected')}>Reject</button>
                  </div>
                ) : <span className="text-zinc-600">-</span>}
              </Td>
            </Tr>
          ))}
        </Table>
      </section>
      </>}

      {tab === 'packs' && <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-white">Credit packs</h2>
            <p className="text-[11px] text-zinc-500">What users can buy. Turn a pack off to hide it from the store.</p>
          </div>
          <button className={btnPrimary} onClick={() => setPkg({ ...emptyPkg })}><Plus className="w-3.5 h-3.5" />New pack</button>
        </div>
        <Table head={['Pack', 'Price', 'Credits', 'Bonus', 'Active', 'Actions']} empty={creditPackages.length === 0}>
          {creditPackages.map((p) => (
            <Tr key={p.id}>
              <Td className="font-bold text-white">{p.name} {p.isPopular && <Badge tone="purple">Popular</Badge>}</Td>
              <Td>${p.price}</Td>
              <Td className="font-mono">{num(p.credits)}</Td>
              <Td className="text-zinc-400">{p.bonusText || '-'}</Td>
              <Td><Toggle on={p.active} onChange={(v) => updateCreditPackage(p.id, { active: v })} label={`Toggle ${p.name}`} /></Td>
              <Td>
                <div className="flex gap-1.5">
                  <button className={btnSmall} onClick={() => setPkg({ ...p })}><Pencil className="w-3 h-3" />Edit pack</button>
                  <button className={btnSmall + ' !text-rose-300'} onClick={() => setDelPkgId(p.id)}><Trash2 className="w-3 h-3" />Delete pack</button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </section>}

      {confirmRemove && (
        <Modal title="Remove credits?" onClose={() => setConfirmRemove(false)} footer={<><button className={btnGhost} onClick={() => setConfirmRemove(false)}>Cancel</button><button className={btnPrimary} onClick={() => { setConfirmRemove(false); apply(-1, true); }}>Remove credits</button></>}>
          <p className="text-sm text-zinc-300">This takes <b>{num(parseInt(amount, 10) || 0)}</b> credits away from <b>{adminUsers.find((x) => x.id === userId)?.name}</b> right away.</p>
        </Modal>
      )}

      {delPkg && (
        <Modal title="Delete credit pack?" onClose={() => setDelPkgId(null)} footer={<><button className={btnGhost} onClick={() => setDelPkgId(null)}>Cancel</button><button className={btnPrimary} onClick={() => { deleteCreditPackage(delPkg.id); setDelPkgId(null); }}>Delete pack</button></>}>
          <p className="text-sm text-zinc-300"><b>{delPkg.name}</b> will no longer be available to buy. Credits users already bought are not affected.</p>
        </Modal>
      )}

      {pkg && (
        <Modal title={pkg.id ? 'Edit credit pack' : 'New credit pack'} onClose={() => setPkg(null)} footer={<><button className={btnGhost} onClick={() => setPkg(null)}>Cancel</button><button className={btnPrimary} onClick={savePkg}>Save changes</button></>}>
          <Field label="Name"><input className={inputCls} value={pkg.name} onChange={(e) => setPkg({ ...pkg, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (USD)"><input type="number" min={0} className={inputCls} value={pkg.price} onChange={(e) => setPkg({ ...pkg, price: Number(e.target.value) })} /></Field>
            <Field label="Credits" hint="Credits the user receives."><input type="number" min={1} className={inputCls} value={pkg.credits} onChange={(e) => setPkg({ ...pkg, credits: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Bonus text" hint="Optional label shown on the pack."><input className={inputCls} value={pkg.bonusText ?? ''} onChange={(e) => setPkg({ ...pkg, bonusText: e.target.value })} placeholder="+10% bonus" /></Field>
          <div className="flex items-center justify-between"><span className="text-xs text-zinc-300">Mark as popular</span><Toggle on={!!pkg.isPopular} onChange={(v) => setPkg({ ...pkg, isPopular: v })} /></div>
          <div className="flex items-center justify-between"><span className="text-xs text-zinc-300">Active</span><Toggle on={pkg.active} onChange={(v) => setPkg({ ...pkg, active: v })} /></div>
        </Modal>
      )}
    </div>
  );
};
