'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Clapperboard, Plus, Trash2, ChevronLeft, ChevronRight, Play, Square, Sparkles, Send, Loader2, Check, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SAMPLE_IMAGES, SAMPLE_VIDEOS, getModel } from '@/data/mockData';
import { estimateCost } from '@/lib/pricing';
import { DemoBadge, ghostBtn, inputCls, PageHeader, primaryBtn } from '@/components/labs/ui';

interface Shot {
  id: string;
  caption: string;
  prompt: string;
  duration: number;
  thumb: string;
  state: 'idle' | 'loading' | 'done';
}

const THUMBS = [SAMPLE_VIDEOS[0].thumbnailUrl, SAMPLE_IMAGES[0], SAMPLE_VIDEOS[1].thumbnailUrl, SAMPLE_IMAGES[3], SAMPLE_VIDEOS[2].thumbnailUrl, SAMPLE_IMAGES[1]];
const DURATIONS = [3, 5, 8, 10];
let uid = 10;

const INITIAL: Shot[] = [
  { id: 's1', caption: 'Establishing', prompt: 'Wide aerial shot of a neon city at night, wet streets, slow push in', duration: 5, thumb: THUMBS[0], state: 'idle' },
  { id: 's2', caption: 'Meet Mara', prompt: 'Medium shot of @Mara walking toward camera, neon reflections, shallow depth of field', duration: 5, thumb: THUMBS[1], state: 'idle' },
  { id: 's3', caption: 'Close-up', prompt: 'Close-up on @Mara turning her head, rim light, 85mm', duration: 3, thumb: THUMBS[2], state: 'idle' },
  { id: 's4', caption: 'Exit', prompt: 'Wide shot, @Mara walks away into the fog as the city lights flare', duration: 8, thumb: THUMBS[3], state: 'idle' },
];

export const StoryboardView: React.FC = () => {
  const { addToast, setPrompt, setCurrentScreen } = useApp();
  const [shots, setShots] = useState<Shot[]>(INITIAL);
  const [playing, setPlaying] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const total = shots.reduce((a, s) => a + s.duration, 0);
  const kling = getModel('kling-4');
  const estTotal = shots.reduce((a, s) => a + estimateCost(kling, s.duration <= 5 ? '5s' : '10s', '1080p'), 0);

  const patch = (id: string, p: Partial<Shot>) => setShots((prev) => prev.map((s) => (s.id === id ? { ...s, ...p } : s)));
  const move = (i: number, d: -1 | 1) =>
    setShots((prev) => {
      const j = i + d;
      if (j < 0 || j >= prev.length) return prev;
      const n = [...prev];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const remove = (id: string) => {
    if (shots.length <= 1) return addToast('Keep at least one shot', undefined, 'warning');
    setShots((prev) => prev.filter((s) => s.id !== id));
  };
  const add = () => {
    uid += 1;
    setShots((prev) => [...prev, { id: 's' + uid, caption: 'New shot', prompt: '', duration: 5, thumb: THUMBS[prev.length % THUMBS.length], state: 'idle' }]);
  };

  const play = () => {
    if (playing !== null) { clear(); setPlaying(null); return; }
    let t = 0;
    shots.forEach((s, i) => {
      timers.current.push(setTimeout(() => setPlaying(i), t));
      t += Math.max(900, s.duration * 260);
    });
    timers.current.push(setTimeout(() => { setPlaying(null); addToast('Playback finished', `${total}s storyboard preview`, 'info'); }, t));
  };

  const generateAll = () => {
    if (generating) return;
    if (shots.some((s) => !s.prompt.trim())) return addToast('Missing prompts', 'Write a prompt in every shot first.', 'warning');
    setGenerating(true);
    setShots((prev) => prev.map((s) => ({ ...s, state: 'idle' })));
    shots.forEach((s, i) => {
      timers.current.push(setTimeout(() => patch(s.id, { state: 'loading' }), i * 1100));
      timers.current.push(setTimeout(() => patch(s.id, { state: 'done' }), i * 1100 + 1900));
    });
    timers.current.push(
      setTimeout(() => {
        setGenerating(false);
        addToast('Shots generated', `Demo only. A real run would cost about ${estTotal} credits.`, 'success');
      }, shots.length * 1100 + 1900)
    );
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <PageHeader
        icon={<Clapperboard className="w-6 h-6 text-fuchsia-400" />}
        title="Storyboard"
        badge={<DemoBadge />}
        subtitle="Plan a video shot by shot. Write a prompt for each shot, then send it to Create or click Generate all shots."
        actions={
          <>
            <button onClick={play} className={ghostBtn}>{playing !== null ? <><Square className="w-3.5 h-3.5" />Stop</> : <><Play className="w-3.5 h-3.5" />Preview</>}</button>
            <button onClick={generateAll} disabled={generating} className={primaryBtn}>
              {generating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating…</> : <><Sparkles className="w-3.5 h-3.5" />Generate all shots</>}
            </button>
          </>
        }
      />

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x">
        {shots.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`snap-start shrink-0 w-72 glass-panel rounded-2xl overflow-hidden transition-all ${playing === i ? 'ring-2 ring-fuchsia-500 scale-[1.01]' : ''}`}>
              <div className="relative aspect-video bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.thumb} alt={s.caption} className={`w-full h-full object-cover ${s.state === 'loading' ? 'opacity-30' : ''}`} />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-black text-white">Shot {String(i + 1).padStart(2, '0')}</span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-zinc-300">{s.duration}s</span>
                {s.state === 'loading' && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-6 h-6 text-purple-300 animate-spin" /></div>}
                {s.state === 'done' && <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500/90 text-[10px] font-bold text-white flex items-center gap-1"><Check className="w-3 h-3" />Generated</span>}
              </div>
              <div className="p-3 space-y-2">
                <input className={inputCls} value={s.caption} onChange={(e) => patch(s.id, { caption: e.target.value, state: 'idle' })} placeholder="Caption" />
                <textarea className={`${inputCls} resize-none`} rows={3} value={s.prompt} onChange={(e) => patch(s.id, { prompt: e.target.value, state: 'idle' })} placeholder="Describe this shot…" />
                <div className="flex items-center gap-1.5">
                  <select className={`${inputCls} !w-auto`} value={s.duration} onChange={(e) => patch(s.id, { duration: Number(e.target.value) })}>
                    {DURATIONS.map((d) => <option key={d} value={d}>{d}s</option>)}
                  </select>
                  <button aria-label="Move left" disabled={i === 0} onClick={() => move(i, -1)} className={`${ghostBtn} !px-2`}><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button aria-label="Move right" disabled={i === shots.length - 1} onClick={() => move(i, 1)} className={`${ghostBtn} !px-2`}><ChevronRight className="w-3.5 h-3.5" /></button>
                  <button aria-label="Remove shot" onClick={() => remove(s.id)} className={`${ghostBtn} !px-2 hover:!text-red-300`}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <button
                  onClick={() => { if (!s.prompt.trim()) return addToast('Add a prompt first', undefined, 'warning'); setPrompt(s.prompt); setCurrentScreen('create'); addToast('Shot sent to Create', `Shot ${i + 1}: ${s.caption}`, 'success'); }}
                  className={`${ghostBtn} w-full`}
                >
                  <Send className="w-3.5 h-3.5" />Send to Create
                </button>
              </div>
            </div>
            {i < shots.length - 1 && <div className="shrink-0 self-center text-zinc-600"><ChevronRight className="w-5 h-5" /></div>}
          </React.Fragment>
        ))}
        <button onClick={add} className="snap-start shrink-0 w-48 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-purple-500/50 text-zinc-500 hover:text-purple-300 flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all">
          <Plus className="w-6 h-6" />Add a shot
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-white">Timeline</span>
          <span className="text-[11px] text-zinc-400">Total runtime <strong className="text-white">{total}s</strong> · estimate <span className="text-amber-300 inline-flex items-center gap-0.5"><Zap className="w-3 h-3" />{estTotal}</span> credits with Kling 4.0</span>
        </div>
        <div className="flex h-10 rounded-xl overflow-hidden gap-0.5 bg-zinc-950">
          {shots.map((s, i) => (
            <div
              key={s.id}
              style={{ width: `${(s.duration / total) * 100}%` }}
              className={`flex items-center justify-center text-[10px] font-bold truncate px-1 transition-colors ${playing === i ? 'bg-fuchsia-600 text-white' : i % 2 ? 'bg-purple-900/60 text-purple-200' : 'bg-purple-700/50 text-purple-100'}`}
              title={`${s.caption} · ${s.duration}s`}
            >
              {String(i + 1).padStart(2, '0')} · {s.duration}s
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
