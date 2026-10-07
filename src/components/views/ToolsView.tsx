'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Wrench, Maximize2, Gauge, FastForward, Mic2, Loader2, Check, Play } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { GenerationItem } from '@/types';
import { ModalShell } from '@/components/common/ModalShell';
import { chip, DemoBadge, PageHeader, primaryBtn, ghostBtn } from '@/components/labs/ui';

type ToolId = 'upscale' | 'interpolate' | 'extend' | 'lipsync';
interface Tool {
  id: ToolId;
  title: string;
  desc: string;
  icon: React.ElementType;
  accepts: ('video' | 'image')[];
  optionLabel: string;
  options: string[];
  result: string;
}

const TOOLS: Tool[] = [
  { id: 'upscale', title: 'Increase resolution (upscale)', desc: 'Make a video or image sharper and larger.', icon: Maximize2, accepts: ['video', 'image'], optionLabel: 'How much bigger', options: ['2x', '4x'], result: 'Upscaled' },
  { id: 'interpolate', title: 'Smooth motion (frame interpolation)', desc: 'Add in-between frames so movement looks smoother.', icon: Gauge, accepts: ['video'], optionLabel: 'Frames per second (fps)', options: ['24 → 30 fps', '24 → 48 fps', '24 → 60 fps'], result: 'Interpolated' },
  { id: 'extend', title: 'Make video longer (extend)', desc: 'Continue a clip past its last frame.', icon: FastForward, accepts: ['video'], optionLabel: 'Add how many seconds', options: ['+5s', '+10s'], result: 'Extended' },
  { id: 'lipsync', title: 'Match mouth to audio (lip sync)', desc: 'Make a character\'s lips follow an audio track.', icon: Mic2, accepts: ['video'], optionLabel: 'Audio track', options: ['Runway Beat', 'Narration take 1', 'Upload audio…'], result: 'Lip-synced' },
];

const ToolModal: React.FC<{ tool: Tool | null; onClose: () => void }> = ({ tool, onClose }) => {
  const { generations, addToast } = useApp();
  const [pick, setPick] = useState<string | null>(null);
  const [opt, setOpt] = useState('');
  const [stage, setStage] = useState<'setup' | 'running' | 'done'>('setup');
  const [progress, setProgress] = useState(0);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPick(null); setStage('setup'); setProgress(0);
    setOpt(tool?.options[0] ?? '');
    return () => { if (iv.current) clearInterval(iv.current); };
  }, [tool]);

  if (!tool) return null;
  const items: GenerationItem[] = generations.filter((g) => g.status === 'Completed' && tool.accepts.includes(g.mediaType as 'video' | 'image'));
  const chosen = items.find((g) => g.id === pick);

  const run = () => {
    if (!chosen) return addToast('Choose a generation first', undefined, 'warning');
    setStage('running');
    setProgress(0);
    iv.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (iv.current) clearInterval(iv.current);
          setStage('done');
          addToast(`${tool.title} is coming soon`, 'Demo result only. No credits charged.', 'info');
          return 100;
        }
        return p + 8;
      });
    }, 180);
  };

  const filter = tool.id === 'upscale' ? 'contrast(1.12) saturate(1.1) brightness(1.04)' : tool.id === 'interpolate' ? 'saturate(1.05)' : 'none';

  return (
    <ModalShell onClose={onClose} title={tool.title} subtitle="Coming soon. This is a simulated preview.">
      {stage === 'setup' && (
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">1. Choose a generation</span>
            {items.length === 0 ? (
              <p className="text-xs text-zinc-500 mt-2">No compatible generations yet. Make one in Create first.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 max-h-52 overflow-y-auto pr-1">
                {items.map((g) => (
                  <button key={g.id} onClick={() => setPick(g.id)} className={`relative rounded-xl overflow-hidden border text-left ${pick === g.id ? 'border-purple-500 ring-1 ring-purple-500' : 'border-zinc-800 hover:border-zinc-600'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.thumbnailUrl} alt="" className="aspect-video w-full object-cover" />
                    <span className="block px-2 py-1 text-[10px] text-zinc-300 truncate bg-zinc-950">{g.title}</span>
                    {pick === g.id && <Check className="absolute top-1.5 right-1.5 w-4 h-4 p-0.5 rounded-full bg-purple-600 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">2. {tool.optionLabel}</span>
            <div className="flex flex-wrap gap-1.5 mt-2">{tool.options.map((o) => <button key={o} onClick={() => setOpt(o)} className={chip(opt === o)}>{o}</button>)}</div>
          </div>
          <button onClick={run} className={`${primaryBtn} w-full py-3`}><Play className="w-3.5 h-3.5 fill-white" />Show preview</button>
        </div>
      )}
      {stage === 'running' && (
        <div className="py-10 text-center space-y-3">
          <Loader2 className="w-8 h-8 mx-auto text-purple-400 animate-spin" />
          <p className="text-sm font-bold text-white">Processing {chosen?.title}…</p>
          <div className="h-1.5 max-w-xs mx-auto rounded-full bg-zinc-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      {stage === 'done' && chosen && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(['Before', 'After'] as const).map((label) => (
              <div key={label} className="space-y-1.5">
                <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={chosen.thumbnailUrl} alt={label} style={{ filter: label === 'After' ? filter : 'none' }} className={`w-full h-full object-cover ${label === 'Before' && tool.id === 'upscale' ? 'blur-[1.5px]' : ''}`} />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-white">{label}</span>
                </div>
                <p className="text-[11px] text-zinc-400 text-center">{label === 'Before' ? `${chosen.resolution ?? 'Original'}${chosen.duration ? ' · ' + chosen.duration : ''}` : `${tool.result} · ${opt}`}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setStage('setup'); setProgress(0); }} className={`${ghostBtn} flex-1`}>Try another</button>
            <button onClick={onClose} className={`${primaryBtn} flex-1`}>Done</button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export const ToolsView: React.FC = () => {
  const [active, setActive] = useState<Tool | null>(null);
  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <PageHeader
        icon={<Wrench className="w-6 h-6 text-fuchsia-400" />}
        title="Post Tools"
        badge={<DemoBadge />}
        subtitle="Extra steps for finished videos (coming soon)."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => setActive(t)} className="glass-panel rounded-2xl p-5 text-left space-y-3 hover:border-purple-500/40 hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600/30 to-fuchsia-600/20 border border-purple-500/30 flex items-center justify-center text-purple-200 group-hover:scale-105 transition-transform"><t.icon className="w-5 h-5" /></span>
              <DemoBadge label="Coming soon" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{t.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <ToolModal tool={active} onClose={() => setActive(null)} />
    </div>
  );
};
