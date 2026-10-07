'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ModalShell } from '@/components/common/ModalShell';

const Shell: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <ModalShell title={title} size="sm" onClose={onClose}>
    {children}
  </ModalShell>
);

export const ConfirmDialog: React.FC<{
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ title, message, confirmLabel = 'Delete', onConfirm, onClose }) => (
  <Shell title={title} onClose={onClose}>
    <div className="flex gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-4 h-4 text-red-400" />
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{message}</p>
    </div>
    <div className="flex justify-end gap-2">
      <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white">Cancel</button>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
      >
        {confirmLabel}
      </button>
    </div>
  </Shell>
);

export const TextPromptDialog: React.FC<{
  title: string;
  label: string;
  initial?: string;
  placeholder?: string;
  submitLabel?: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
}> = ({ title, label, initial = '', placeholder, submitLabel = 'Save', onSubmit, onClose }) => {
  const [value, setValue] = useState(initial);
  return (
    <Shell title={title} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          onSubmit(value.trim());
          onClose();
        }}
      >
        <label className="block text-xs font-semibold text-zinc-300 mb-1">{label}</label>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
        <div className="flex justify-end gap-2 mt-5">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white">Cancel</button>
          <button type="submit" disabled={!value.trim()} className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-colors">
            {submitLabel}
          </button>
        </div>
      </form>
    </Shell>
  );
};

export const DialogShell = Shell;
