'use client';

import React, { useMemo, useState } from 'react';
import { Wand2, Copy, Send, RotateCcw, Plus, X, Target, User, Image as ImageIcon, Link2, Camera, Sun, Palette, ListOrdered, Check, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { chip, DemoBadge, ghostBtn, inputCls, PageHeader, primaryBtn } from '@/components/labs/ui';
import { copyText } from '@/lib/clipboard';

const CAMERA = ['Dolly in', 'Orbit', 'Handheld', 'Crane', 'Static', 'Whip pan'];
const LIGHTING = ['Golden hour', 'Neon', 'Studio softbox', 'Moody low-key', 'Overcast'];
const STYLE = ['Cinematic', 'Anime', 'Editorial', 'Photoreal', 'Documentary'];
const CONTINUITY = ['Keep face consistent', 'Keep outfit consistent', 'Same location as previous shot', 'Match color grade'];

interface State {
  goal: string;
  subject: string;
  refs: string[];
  continuity: string[];
  camera: string[];
  lighting: string;
  style: string;
  stages: string[];
}
const EMPTY: State = { goal: '', subject: '', refs: [], continuity: [], camera: [], lighting: '', style: '', stages: [] };
const EXAMPLE: State = {
  goal: 'A 10 second fashion teaser for the autumn campaign',
  subject: 'walking through a futuristic city at night, neon reflections on wet streets',
  refs: ['Mara', 'Outfit01'],
  continuity: ['Keep face consistent'],
  camera: ['Dolly in'],
  lighting: 'Neon',
  style: 'Cinematic',
  stages: ['Wide establishing shot of the street', 'Close-up on the face as she turns to camera'],
};

export const PromptBuilderView: React.FC = () => {
  const { references, setPrompt, setCurrentScreen, addToast } = useApp();
  const [s, setS] = useState<State>(EXAMPLE);
  const [newStage, setNewStage] = useState('');
  const [copied, setCopied] = useState(false);
  const [look, setLook] = useState(false);

  const toggle = (key: 'refs' | 'continuity' | 'camera', v: string) =>
    setS((p) => ({ ...p, [key]: p[key].includes(v) ? p[key].filter((x) => x !== v) : [...p[key], v] }));

  const assembled = useMemo(() => {
    const parts: string[] = [];
    const refs = s.refs.map((r) => `@${r}`).join(' and ');
    const head = [s.goal.trim(), [refs, s.subject.trim()].filter(Boolean).join(' ')].filter(Boolean).join('. ');
    if (head) parts.push(head);
    const look = [s.style && `${s.style.toLowerCase()} style`, s.lighting && `${s.lighting.toLowerCase()} lighting`, s.camera.length && `camera: ${s.camera.map((c) => c.toLowerCase()).join(', ')}`].filter(Boolean);
    if (look.length) parts.push(look.join(', '));
    if (s.continuity.length) parts.push(s.continuity.join(', '));
    let out = parts.join('. ');
    if (out) out += '.';
    if (s.stages.length) out += (out ? '\n' : '') + s.stages.map((st, i) => `Step ${i + 1}: ${st}`).join('\n');
    return out;
  }, [s]);

  const addStage = () => {
    if (!newStage.trim()) return;
    setS((p) => ({ ...p, stages: [...p.stages, newStage.trim()] }));
    setNewStage('');
  };

  const card = 'glass-panel rounded-2xl p-4 space-y-3';
  const Title: React.FC<{ icon: React.ReactNode; text: string; hint?: string }> = ({ icon, text, hint }) => (
    <div className="flex items-center gap-2">
      <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 flex items-center justify-center">{icon}</span>
      <span className="text-xs font-extrabold text-white">{text}</span>
      {hint && <span className="text-[10px] text-zinc-500">{hint}</span>}
    </div>
  );
  const imageRefs = references.filter((r) => r.type !== 'audio');

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <PageHeader
        icon={<Wand2 className="w-6 h-6 text-fuchsia-400" />}
        title="Prompt Builder"
        badge={<DemoBadge />}
        subtitle="Fill in the parts and we assemble a prompt for you. Then send it to Create."
        actions={<button onClick={() => { setS(EXAMPLE); addToast('Example loaded', undefined, 'info'); }} className={ghostBtn}>Load example</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
          <div className={`${card} md:col-span-2`}>
            <Title icon={<Target className="w-3.5 h-3.5" />} text="Goal" hint="What is this for?" />
            <input className={inputCls} value={s.goal} onChange={(e) => setS({ ...s, goal: e.target.value })} placeholder="e.g. A 10 second fashion teaser" />
          </div>
          <div className={`${card} md:col-span-2`}>
            <Title icon={<User className="w-3.5 h-3.5" />} text="Subject" hint="Who or what, and what happens" />
            <input className={inputCls} value={s.subject} onChange={(e) => setS({ ...s, subject: e.target.value })} placeholder="walking through a neon city at night" />
          </div>

          <div className={`${card} md:col-span-2`}>
            <Title icon={<ImageIcon className="w-3.5 h-3.5" />} text="References" hint="Click to insert @Name" />
            {imageRefs.length === 0 ? (
              <p className="text-[11px] text-zinc-500">No references yet. Open References in the sidebar and upload one.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {imageRefs.map((r) => {
                  const on = s.refs.includes(r.name);
                  return (
                    <button key={r.id} onClick={() => toggle('refs', r.name)} className={`${chip(on)} flex items-center gap-1.5 !pl-1.5`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.thumbnailUrl} alt="" className="w-5 h-5 rounded-md object-cover" />@{r.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className={card}>
            <Title icon={<Link2 className="w-3.5 h-3.5" />} text="Keep consistent (continuity)" />
            <div className="flex flex-wrap gap-1.5">{CONTINUITY.map((c) => <button key={c} onClick={() => toggle('continuity', c)} className={chip(s.continuity.includes(c))}>{c}</button>)}</div>
          </div>
          <button onClick={() => setLook((v) => !v)} aria-expanded={look} className="md:col-span-2 flex items-center justify-between glass-panel rounded-2xl px-4 py-3 text-xs font-extrabold text-white">
            <span>More options <span className="text-zinc-500 font-bold">(camera, lighting, style)</span></span>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${look ? 'rotate-180' : ''}`} />
          </button>
          {look && (
            <>
          <div className={card}>
            <Title icon={<Camera className="w-3.5 h-3.5" />} text="Camera movement" hint="Pick any" />
            <div className="flex flex-wrap gap-1.5">{CAMERA.map((c) => <button key={c} onClick={() => toggle('camera', c)} className={chip(s.camera.includes(c))}>{c}</button>)}</div>
          </div>
          <div className={card}>
            <Title icon={<Sun className="w-3.5 h-3.5" />} text="Light" />
            <div className="flex flex-wrap gap-1.5">{LIGHTING.map((c) => <button key={c} onClick={() => setS({ ...s, lighting: s.lighting === c ? '' : c })} className={chip(s.lighting === c)}>{c}</button>)}</div>
          </div>
          <div className={card}>
            <Title icon={<Palette className="w-3.5 h-3.5" />} text="Style" />
            <div className="flex flex-wrap gap-1.5">{STYLE.map((c) => <button key={c} onClick={() => setS({ ...s, style: s.style === c ? '' : c })} className={chip(s.style === c)}>{c}</button>)}</div>
          </div>

            </>
          )}

          <div className={`${card} md:col-span-2`}>
            <Title icon={<ListOrdered className="w-3.5 h-3.5" />} text="Steps (stages)" hint="What happens, in order" />
            {s.stages.length === 0 && <p className="text-[11px] text-zinc-500">No steps yet. Type one below and click Add.</p>}
            <div className="space-y-2">
              {s.stages.map((st, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-purple-300 w-14 shrink-0">Step {i + 1}</span>
                  <input className={inputCls} value={st} onChange={(e) => setS((p) => ({ ...p, stages: p.stages.map((x, j) => (j === i ? e.target.value : x)) }))} />
                  <button aria-label="Remove step" onClick={() => setS((p) => ({ ...p, stages: p.stages.filter((_, j) => j !== i) }))} className="p-2 rounded-lg text-zinc-500 hover:text-red-300 hover:bg-zinc-800"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={inputCls} value={newStage} onChange={(e) => setNewStage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addStage()} placeholder="Add a step, e.g. close-up on the face" />
              <button onClick={addStage} className={ghostBtn}><Plus className="w-3.5 h-3.5" />Add</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl p-4 space-y-3 lg:sticky lg:top-4 border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white">Assembled prompt</span>
              <span className="text-[10px] text-zinc-500">{assembled.length} chars</span>
            </div>
            <div className="min-h-[180px] rounded-xl bg-zinc-950/80 border border-zinc-800 p-3 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
              {assembled || <span className="text-zinc-600">Your prompt appears here as you fill in the parts.</span>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={!assembled}
                onClick={async () => { await copyText(assembled); setCopied(true); setTimeout(() => setCopied(false), 1500); addToast('Copied', 'Prompt copied to clipboard.', 'success'); }}
                className={ghostBtn}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}Copy
              </button>
              <button onClick={() => { setS(EMPTY); addToast('Builder reset', undefined, 'info'); }} className={ghostBtn}><RotateCcw className="w-3.5 h-3.5" />Reset</button>
            </div>
            <button
              disabled={!assembled}
              onClick={() => { setPrompt(assembled); setCurrentScreen('create'); addToast('Prompt sent to Create', undefined, 'success'); }}
              className={`${primaryBtn} w-full py-3`}
            >
              <Send className="w-4 h-4" />Send to Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
