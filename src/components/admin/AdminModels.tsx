'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AIModel, ModelStatus } from '@/types';
import { Pencil, KeyRound, Eye, EyeOff } from 'lucide-react';
import { PageHeader, Table, Tr, Td, Badge, statusTone, Toggle, Modal, Field, inputCls, btnPrimary, btnGhost, btnSmall } from './ui';

const csv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);
const label = (m: AIModel) => m.mediaTypes.map((t) => t[0].toUpperCase() + t.slice(1)).join(' / ');

export const AdminModels: React.FC = () => {
  const { models, toggleModelStatus, updateModel, updateModelCreditCost, modelApiKeys, updateModelApiKey, addToast } = useApp();
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState<ModelStatus>('Active');
  const [durations, setDurations] = useState('');
  const [resolutions, setResolutions] = useState('');
  const [err, setErr] = useState('');
  const [keyModelId, setKeyModelId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');
  const [keyErr, setKeyErr] = useState('');
  const [reveal, setReveal] = useState(false);

  const open = (m: AIModel) => {
    setEditId(m.id);
    setName(m.name);
    setCost(String(m.creditCost));
    setStatus(m.status);
    setDurations((m.capabilities.durations ?? []).join(', '));
    setResolutions((m.capabilities.resolutions ?? []).join(', '));
    setErr('');
  };

  const model = models.find((m) => m.id === editId);

  const save = () => {
    if (!model) return;
    const c = Number(cost);
    if (!name.trim()) return setErr('Display name is required.');
    if (!Number.isFinite(c) || c <= 0) return setErr('Credit cost must be greater than 0.');
    const caps = { ...model.capabilities };
    if (model.capabilities.durations) if (csv(durations).length) caps.durations = csv(durations);
    if (model.capabilities.resolutions) if (csv(resolutions).length) caps.resolutions = csv(resolutions);
    updateModel(model.id, { name: name.trim(), status, capabilities: caps });
    if (c !== model.creditCost) updateModelCreditCost(model.id, c);
    addToast('Model settings saved', `${name.trim()} updated.`, 'success');
    setEditId(null);
  };

  const mask = (k: string) => k.slice(0, 6) + '••••••••' + k.slice(-4);
  const keyModel = models.find((m) => m.id === keyModelId);

  const closeKey = () => {
    setKeyModelId(null);
    setNewKey('');
    setReveal(false);
  };

  const saveKey = () => {
    const k = newKey.trim();
    if (!keyModel) return;
    if (k.length < 12) return setKeyErr('Enter the full API key.');
    updateModelApiKey(keyModel.id, k);
    addToast('API key updated', `${keyModel.name} now uses the new key.`, 'success');
    closeKey();
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Model management" description="Turn models on or off, set their credit cost and change the API key each model uses." />

      <Table head={['Model', 'Provider', 'Type', 'Status', 'Supported types', 'Credit cost', 'API key', 'Enabled', 'Actions']} empty={models.length === 0}>
        {models.map((m) => (
          <Tr key={m.id}>
            <Td>
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-bold text-white">{m.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">{m.id}</div>
                </div>
              </div>
            </Td>
            <Td className="text-zinc-300">{m.provider}</Td>
            <Td>{label(m)}</Td>
            <Td><Badge tone={statusTone(m.status)}>{m.status}</Badge></Td>
            <Td>
              <div className="flex flex-wrap gap-1 max-w-[220px]">
                {m.supports.map((s) => <span key={s} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-semibold">{s}</span>)}
              </div>
            </Td>
            <Td className="font-mono text-zinc-200">{m.creditCost}</Td>
            <Td>
              <div className="font-mono text-[11px] text-zinc-300">{mask(modelApiKeys[m.id]?.apiKey ?? '')}</div>
              <div className="text-[10px] text-zinc-600">Changed {modelApiKeys[m.id]?.updatedAt}</div>
            </Td>
            <Td>
              <Toggle on={m.status !== 'Disabled'} onChange={() => toggleModelStatus(m.id)} label={`Enable ${m.name}`} />
            </Td>
            <Td>
              <div className="flex gap-1.5">
                <button className={btnSmall} onClick={() => open(m)}><Pencil className="w-3 h-3" />Edit model</button>
                <button className={btnSmall} onClick={() => { setKeyModelId(m.id); setKeyErr(''); }}><KeyRound className="w-3 h-3" />Change API key</button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {model && (
        <Modal title={`Edit ${model.name}`} onClose={() => setEditId(null)} footer={<><button className={btnGhost} onClick={() => setEditId(null)}>Cancel</button><button className={btnPrimary} onClick={save}>Save changes</button></>}>
          <Field label="Display name"><input className={inputCls} value={name} onChange={(e) => { setName(e.target.value); setErr(''); }} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Credit cost" hint="Credits charged per generation."><input type="number" min={1} className={inputCls} value={cost} onChange={(e) => { setCost(e.target.value); setErr(''); }} /></Field>
            <Field label="Status" hint="Disabled hides the model from users.">
              <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as ModelStatus)}>
                {(['Active', 'Beta', 'Disabled'] as ModelStatus[]).map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          {model.capabilities.durations && (
            <Field label="Supported durations" hint="Comma separated, e.g. 5s, 10s">
              <input className={inputCls} value={durations} onChange={(e) => setDurations(e.target.value)} />
              <div className="flex flex-wrap gap-1 mt-1">{csv(durations).map((d) => <span key={d} className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">{d}</span>)}</div>
            </Field>
          )}
          {model.capabilities.resolutions && (
            <Field label="Supported resolutions" hint="Comma separated, e.g. 720p, 1080p">
              <input className={inputCls} value={resolutions} onChange={(e) => setResolutions(e.target.value)} />
              <div className="flex flex-wrap gap-1 mt-1">{csv(resolutions).map((d) => <span key={d} className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">{d}</span>)}</div>
            </Field>
          )}
          {err && <p className="text-xs text-rose-400 font-semibold">{err}</p>}
        </Modal>
      )}

      {keyModel && (
        <Modal
          title={`Change API key for ${keyModel.name}`}
          onClose={closeKey}
          footer={<><button className={btnGhost} onClick={closeKey}>Cancel</button><button className={btnPrimary} onClick={saveKey}>Save key</button></>}
        >
          <p className="text-xs text-zinc-400">The new key replaces the current one for this model right away.</p>
          <Field label="New API key" error={keyErr}>
            <div className="relative">
              <input autoFocus type={reveal ? 'text' : 'password'} className={inputCls + ' font-mono pr-10'} value={newKey} onChange={(e) => { setNewKey(e.target.value); setKeyErr(''); }} placeholder="Paste key here" />
              <button type="button" onClick={() => setReveal((r) => !r)} aria-label={reveal ? 'Hide key' : 'Show key'} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">{reveal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </Field>
        </Modal>
      )}
    </div>
  );
};
