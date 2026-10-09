'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Bell, Send } from 'lucide-react';
import { inputCls, primaryBtn } from '@/components/labs/ui';

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

export const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative w-9 h-5 rounded-full shrink-0 transition-colors ${checked ? 'bg-purple-600' : 'bg-zinc-700'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
  </button>
);



export interface Recipient { email: string; email_sent: boolean }

/** Share-with form (email, notify toggle, send button) and the "Shared with" list. Used by project and generation sharing. */
export const ShareWith: React.FC<{
  defaultNotify: boolean;
  recipients: Recipient[];
  onShared: (r: Recipient) => void;
  toast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}> = ({ defaultNotify, recipients, onShared, toast }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notify, setNotify] = useState(defaultNotify);
  const [sending, setSending] = useState(false);
  useEffect(() => setNotify(defaultNotify), [defaultNotify]);

  const submit = () => {
    const to = email.trim();
    if (!EMAIL_RE.test(to)) return setError('Enter a valid email, like name@company.com.');
    if (recipients.some((r) => r.email === to)) return setError('Already shared with this email.');
    setError('');
    setSending(true);
    setTimeout(() => {
      onShared({ email: to, email_sent: notify });
      toast('Shared', notify ? `Notification and email sent to ${to}.` : `In-app notification sent to ${to}.`, 'success');
      setEmail(''); setSending(false);
    }, 1000);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Share with</span>
        <div className="relative">
          <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} onKeyDown={(e) => e.key === 'Enter' && !sending && submit()} placeholder="name@company.com" aria-invalid={!!error} className={`${inputCls} !pl-9 ${error ? '!border-red-500/60' : ''}`} />
        </div>
        {error && <p className="text-[11px] text-red-300">{error}</p>}
      </div>
    
      <button onClick={submit} disabled={sending} className={primaryBtn}><Send className="w-3.5 h-3.5" />{sending ? 'Sending…' : 'Share and notify'}</button>
      {recipients.length > 0 && (
        <div className="pt-3 border-t border-zinc-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Shared with</span>
          {recipients.map((r) => (
            <div key={r.email} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-zinc-200 truncate">{r.email}</span>
              <span className="flex gap-1 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold"><Bell className="w-3 h-3" />In-app</span>
                {r.email_sent && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] font-bold"><Mail className="w-3 h-3" />Email</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
