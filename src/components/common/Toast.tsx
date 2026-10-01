'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border glass-panel shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100'
                : isError
                ? 'border-rose-500/40 bg-rose-950/40 text-rose-100'
                : isWarning
                ? 'border-amber-500/40 bg-amber-950/40 text-amber-100'
                : 'border-purple-500/40 bg-purple-950/40 text-purple-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-purple-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold tracking-wide uppercase">{toast.title}</h4>
              {toast.message && <p className="text-xs text-zinc-300 mt-1 leading-snug">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
