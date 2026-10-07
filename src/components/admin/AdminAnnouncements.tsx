'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Send, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { PageHeader, Card, Modal, Field, inputCls, btnPrimary, btnGhost, Avatar } from './ui';
import { INITIAL_SENT, SentAnnouncement } from '@/data/adminMock';

export const AdminAnnouncements: React.FC = () => {
  const { adminUsers, publishAnnouncement } = useApp();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ subject?: string; message?: string; recipients?: string }>({});
  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<SentAnnouncement[]>(INITIAL_SENT);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const visible = adminUsers.filter((u) => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  const allSelected = adminUsers.length > 0 && selected.length === adminUsers.length;

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    setErrors((e) => ({ ...e, recipients: undefined }));
    setSuccess(false);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!subject.trim()) e.subject = 'Subject is required.';
    if (!message.trim()) e.message = 'Message is required.';
    if (selected.length === 0) e.recipients = 'Select at least one recipient.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const send = () => {
    setSending(true);
    timer.current = setTimeout(() => {
      const count = selected.length;
      publishAnnouncement(subject.trim(), message.trim(), count);
      setHistory((h) => [{ id: 'sa_' + Date.now(), subject: subject.trim(), body: message.trim(), recipients: count, date: 'Just now' }, ...h]);
      setSending(false);
      setConfirm(false);
      setSuccess(true);
      setSubject('');
      setMessage('');
      setSelected([]);
    }, 1400);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Choose who gets a message, write it, check the preview, then send." />

      {success && (
        <div role="status" className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-700/60 text-emerald-200 rounded-xl px-4 py-3 text-sm font-bold">
          <CheckCircle2 className="w-4 h-4" /> Announcement sent successfully
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-2" title="1. Who gets it" subtitle={`${selected.length} of ${adminUsers.length} selected`}>
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={inputCls + ' pl-9'} placeholder="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-200 cursor-pointer">
            <input type="checkbox" className="accent-rose-500" checked={allSelected} onChange={() => { setSelected(allSelected ? [] : adminUsers.map((u) => u.id)); setErrors((e) => ({ ...e, recipients: undefined })); }} />
            Send to all users
          </label>
          <ul className="space-y-1 max-h-72 overflow-y-auto">
            {visible.map((u) => (
              <li key={u.id}>
                <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                  <input type="checkbox" className="accent-rose-500" checked={selected.includes(u.id)} onChange={() => toggle(u.id)} />
                  <Avatar src={u.avatar} name={u.name} size={28} />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-white truncate">{u.name}</span>
                    <span className="block text-[10px] text-zinc-500 truncate">{u.email}</span>
                  </span>
                </label>
              </li>
            ))}
            {visible.length === 0 && <li className="text-center text-xs text-zinc-500 py-6">No users found</li>}
          </ul>
          {errors.recipients && <p className="text-[11px] text-rose-400 font-semibold mt-2">{errors.recipients}</p>}
        </Card>

        <div className="xl:col-span-3 space-y-4">
          <Card title="2. Write it">
            <div className="space-y-3">
              <Field label="Subject" hint="Shown as the title of the announcement." error={errors.subject}><input className={inputCls} value={subject} onChange={(e) => { setSubject(e.target.value); setErrors((x) => ({ ...x, subject: undefined })); setSuccess(false); }} placeholder="What's new on AetherGen" /></Field>
              <Field label="Message" hint="Recipients see this on their dashboard." error={errors.message}><textarea rows={5} className={inputCls} value={message} onChange={(e) => { setMessage(e.target.value); setErrors((x) => ({ ...x, message: undefined })); setSuccess(false); }} placeholder="Write your announcement..." /></Field>
              <div className="flex justify-end">
                <button className={btnPrimary} onClick={() => validate() && setConfirm(true)}><Send className="w-3.5 h-3.5" />Send announcement</button>
              </div>
            </div>
          </Card>

          <Card title="3. Preview">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400">
                <Mail className="w-3.5 h-3.5" /> From: AetherGen &lt;no-reply@aethergen.ai&gt;
                <span className="ml-auto">To: {selected.length} recipient{selected.length === 1 ? '' : 's'}</span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-base font-black text-white">{subject || 'Your subject appears here'}</h4>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{message || 'Your message body appears here.'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Already sent">
        {history.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">No announcements sent yet</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {history.map((h) => (
              <li key={h.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white truncate">{h.subject}</div>
                  <div className="text-xs text-zinc-500 truncate">{h.body}</div>
                </div>
                <div className="text-[11px] text-zinc-400 whitespace-nowrap">{h.recipients} recipient{h.recipients === 1 ? '' : 's'} · {h.date}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {confirm && (
        <Modal
          title="Send announcement?"
          onClose={() => !sending && setConfirm(false)}
          footer={
            <>
              <button className={btnGhost} disabled={sending} onClick={() => setConfirm(false)}>Cancel</button>
              <button className={btnPrimary} disabled={sending} onClick={send}>
                {sending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Sending...</> : <><Send className="w-3.5 h-3.5" />Send announcement</>}
              </button>
            </>
          }
        >
          <p className="text-sm text-zinc-300">
            &ldquo;<b>{subject}</b>&rdquo; will be sent to <b>{selected.length}</b> user{selected.length === 1 ? '' : 's'}. This cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};
