'use client';

import React from 'react';
import { X, FileText, Download } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BILLING_SUMMARY } from '@/data/mockData';

export const BillingHistoryModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { addToast } = useApp();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Billing history</h2>
            <p className="text-[11px] text-zinc-400">Demo invoices. No real documents are generated.</p>
          </div>
        </div>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {BILLING_SUMMARY.invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
              <div className="min-w-0">
                <p className="text-xs font-bold text-white font-mono">{inv.id}</p>
                <p className="text-[11px] text-zinc-400">{inv.date}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-white">{inv.amount}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">{inv.status}</span>
                <button
                  onClick={() => addToast('Download started', `${inv.id}.pdf (demo)`, 'success')}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
