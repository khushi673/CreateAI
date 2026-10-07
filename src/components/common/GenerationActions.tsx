'use client';

import React, { useState } from 'react';
import { ChevronDown, Download, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { GenerationItem } from '@/types';
import { ConfirmDialog } from '@/components/common/Dialogs';

interface GenerationActionsProps {
  item: GenerationItem;
  /** 'icon' = compact icon buttons (cards); 'labeled' = full buttons (result page) */
  variant: 'icon' | 'labeled';
  onDeleted?: () => void;
  /** Extra buttons shown with the secondary actions of the labeled variant */
  extra?: React.ReactNode;
}

/** The single implementation of Download, Re-run, Use as reference and Delete for a generation. */
export const GenerationActions: React.FC<GenerationActionsProps> = ({ item, variant, onDeleted, extra }) => {
  const { downloadGeneration, rerunGeneration, addAsReference, deleteGeneration } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [more, setMore] = useState(false);
  const usable = item.status === 'Completed';

  const actions = [
    { label: 'Download', icon: Download, run: () => downloadGeneration(item), hidden: !usable, primary: true },
    { label: 'Re-run', icon: RotateCcw, run: () => rerunGeneration(item), primary: !usable },
    { label: 'Use as reference (reuse in prompts)', icon: Sparkles, run: () => addAsReference(item), hidden: !usable },
    { label: 'Delete', icon: Trash2, run: () => setConfirm(true), danger: true },
  ];

  const dialog = confirm && (
    <ConfirmDialog
      title="Delete this generation?"
      message="It will be removed from History and from any project. Spent credits are not refunded."
      onConfirm={() => {
        deleteGeneration(item.id);
        onDeleted?.();
      }}
      onClose={() => setConfirm(false)}
    />
  );

  if (variant === 'icon') {
    return (
      <>
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              title={a.label}
              aria-label={a.label}
              disabled={a.hidden}
              onClick={a.run}
              className={`py-2 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                a.danger ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-red-600/80' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
        {dialog}
      </>
    );
  }

  const visible = actions.filter((a) => !a.hidden);
  const main = visible.find((a) => a.primary);
  const rest = visible.filter((a) => a !== main);
  const MainIcon = main?.icon;
  return (
    <div className="space-y-2">
      {main && MainIcon && (
        <button
          onClick={main.run}
          className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 border border-purple-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <MainIcon className="w-4 h-4" /> {main.label}
        </button>
      )}
      <button
        onClick={() => setMore((v) => !v)}
        aria-expanded={more}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white py-1.5 transition-colors"
      >
        More actions <ChevronDown className={`w-3.5 h-3.5 transition-transform ${more ? 'rotate-180' : ''}`} />
      </button>
      {more && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
          {extra}
          {rest.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                onClick={a.run}
                className={`px-3 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                  a.danger
                    ? 'bg-zinc-900 hover:bg-red-600/80 border-zinc-700 hover:border-red-500 text-red-300 hover:text-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {a.label}
              </button>
            );
          })}
        </div>
      )}
      {dialog}
    </div>
  );
};
