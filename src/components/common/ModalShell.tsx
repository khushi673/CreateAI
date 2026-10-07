'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const ModalShell: React.FC<ModalShellProps> = ({ title, subtitle, onClose, children, footer, size = 'md' }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${size === 'lg' ? 'max-w-4xl' : size === 'sm' ? 'max-w-sm' : 'max-w-2xl'} max-h-[88vh] flex flex-col rounded-3xl glass-panel border border-zinc-700 shadow-2xl animate-fade-in-up`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-extrabold text-white">{title}</h2>
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="p-4 border-t border-zinc-800">{footer}</div>}
      </div>
    </div>
  );
};
