'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  GitCompare, Zap, Video, ImageIcon, Check, Play, RotateCcw, Download, Bookmark, Link2, Trophy,
  Loader2, AlertTriangle, Clock, Ban, Gauge, BadgeDollarSign, CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AIModel, MediaType } from '@/types';
import { SAMPLE_IMAGES, SAMPLE_VIDEOS } from '@/data/mockData';
import {
  CompareSettings, caption, DEFAULT_IDS, effective, modelCost, sharedOptions, SAMPLE_COMPARE_PROMPTS,
} from '@/components/compare/compareUtils';
import { chip, ghostBtn, PageHeader, primaryBtn } from '@/components/labs/ui';

type Stage = 'submitted' | 'queued' | 'generating' | 'complete' | 'failed';
interface Run {
  stage: Stage;
  progress: number;
  /** wall-clock ms the simulation takes */
  durationMs: number;
  /** mock provider generation time in seconds, shown in the result */
  genSeconds: number;
  settings: CompareSettings;
  cost: number;
  mediaUrl: string;
  thumb: string;
}

const STAGE_LABEL: Record<Stage, string> = {
  submitted: 'Submitted',
  queued: 'Queued',
  generating: 'Generating',
  complete: 'Complete',
  failed: 'Failed',
};

export const CompareView: React.FC = () => {
  const {
    models, user, setUser, addToast, setCurrentScreen, setPrompt: setStudioPrompt,
    setMediaType: setStudioMedia, setSelectedModel, addReference,
  } = useApp();

  const [media, setMedia] = useState<'video' | 'image'>('video');
  const [prompt, setPromptLocal] = useState(SAMPLE_COMPARE_PROMPTS.video[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_IDS.video);
  const [settings, setSettings] = useState<CompareSettings>({ duration: '10s', resolution: '1080p', aspectRatio: '16:9' });
  const [simulateFail, setSimulateFail] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [runs, setRuns] = useState<Record<string, Run>>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [moreOpts, setMoreOpts] = useState(false);
  const [moreActions, setMoreActions] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const available = useMemo(() => models.filter((m) => m.mediaTypes.includes(media)), [models, media]);
  const selected = useMemo(
    () => selectedIds.map((id) => available.find((m) => m.id === id)).filter((m): m is AIModel => !!m && m.status !== 'Disabled'),
    [selectedIds, available]
  );

  const dur = sharedOptions(selected, 'duration');
  const res = sharedOptions(selected, 'resolution');
  const asp = sharedOptions(selected, 'aspectRatio');

  // keep shared settings valid for the current model set
  useEffect(() => {
    setSettings((s) => {
      const pick = (cur: string, o: { options: string[] }, pref: string) =>
        o.options.length === 0 ? cur : o.options.includes(cur) ? cur : o.options.includes(pref) ? pref : o.options[0];
      const next = { duration: pick(s.duration, dur, '10s'), resolution: pick(s.resolution, res, '1080p'), aspectRatio: pick(s.aspectRatio, asp, '16:9') };
      return next.duration === s.duration && next.resolution === s.resolution && next.aspectRatio === s.aspectRatio ? s : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(','), media]);

  const costs = selected.map((m) => ({ m, cost: modelCost(m, settings) }));
  const total = costs.reduce((a, c) => a + c.cost, 0);
  const locked = phase === 'running';

  const switchMedia = (t: 'video' | 'image') => {
    if (locked || t === media) return;
    setMedia(t);
    setSelectedIds(DEFAULT_IDS[t].filter((id) => models.find((m) => m.id === id)?.status !== 'Disabled'));
    setPromptLocal(SAMPLE_COMPARE_PROMPTS[t][0]);
    setPhase('idle');
    setRuns({});
  };

  const toggleModel = (m: AIModel) => {
    if (locked) return;
    if (m.status === 'Disabled') {
      addToast('Model unavailable', `${m.name} is not available right now.`, 'warning');
      return;
    }
    setSelectedIds((prev) => {
      if (prev.includes(m.id)) {
        if (prev.length <= 2) {
          addToast('Pick at least 2 models', 'Comparison needs two or three models.', 'warning');
          return prev;
        }
        return prev.filter((x) => x !== m.id);
      }
      if (prev.length >= 3) {
        addToast('Maximum 3 models', 'Deselect a model before adding another.', 'warning');
        return prev;
      }
      return [...prev, m.id];
    });
    setPhase('idle');
    setRuns({});
  };

  const startCompare = () => {
    if (locked) return;
    if (!prompt.trim()) return addToast('Prompt required', 'Write one prompt to send to every model.', 'warning');
    if (selected.length < 2) return addToast('Select at least 2 models', 'Comparison needs two or three active models.', 'warning');
    if (user.credits < total) {
      addToast('Not enough credits', `Comparing needs ${total} credits, you have ${user.credits}.`, 'warning');
      return;
    }
    setUser((prev) => ({ ...prev, credits: prev.credits - total }));
    addToast('Comparison started', `${total} credits charged across ${selected.length} models.`, 'info');

    const slowest = selected.length - 1;
    const next: Record<string, Run> = {};
    selected.forEach((m, i) => {
      const s: CompareSettings = {
        duration: effective(m, 'duration', settings.duration),
        resolution: effective(m, 'resolution', settings.resolution),
        aspectRatio: effective(m, 'aspectRatio', settings.aspectRatio),
      };
      next[m.id] = {
        stage: 'submitted',
        progress: 0,
        durationMs: i === slowest ? 9000 : 4500 + i * 1300,
        genSeconds: Math.round(18 + (m.creditCost / 5) * 3 + i * 9 + (i === slowest ? 14 : 0)),
        settings: s,
        cost: modelCost(m, settings),
        mediaUrl: media === 'video' ? SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length].mediaUrl : SAMPLE_IMAGES[(i + 1) % SAMPLE_IMAGES.length],
        thumb: media === 'video' ? SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length].thumbnailUrl : SAMPLE_IMAGES[(i + 1) % SAMPLE_IMAGES.length],
      };
    });
    setRuns(next);
    setSaved([]);
    setPhase('running');

    const failId = simulateFail ? selected[selected.length - 1].id : null;
    const started = Date.now();
    const ids = selected.map((m) => m.id);
    let doneAnnounced = false;
    let cur = next;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      const el = Date.now() - started;
      let allDone = true;
      const out: Record<string, Run> = {};
      ids.forEach((id) => {
        const r = cur[id];
        if (r.stage === 'complete' || r.stage === 'failed') {
          out[id] = r;
          return;
        }
        const p = Math.min(100, (el / r.durationMs) * 100);
        if (p >= 100) {
          out[id] = { ...r, progress: 100, stage: id === failId ? 'failed' : 'complete' };
        } else {
          allDone = false;
          out[id] = { ...r, progress: p, stage: p < 8 ? 'submitted' : p < 22 ? 'queued' : 'generating' };
        }
      });
      cur = out;
      setRuns(out);
      if (allDone && !doneAnnounced) {
        doneAnnounced = true;
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setPhase('done');
        if (failId) {
          const refund = next[failId].cost;
          setUser((prev) => ({ ...prev, credits: prev.credits + refund }));
          addToast('One model failed', `${refund} credits were refunded automatically.`, 'error');
        } else {
          addToast('Comparison complete', 'All models finished.', 'success');
        }
      }
    }, 120);
  };

  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPhase('idle');
    setRuns({});
    setSaved([]);
  };

  // badges
  const finished = selected.filter((m) => runs[m.id]?.stage === 'complete');
  const fastestId = phase === 'done' && finished.length > 1 ? [...finished].sort((a, b) => runs[a.id].genSeconds - runs[b.id].genSeconds)[0].id : null;
  const bestValueId = phase === 'done' && finished.length > 1 ? [...finished].sort((a, b) => b.rating / runs[b.id].cost - a.rating / runs[a.id].cost)[0].id : null;

  const useModel = (m: AIModel) => {
    setStudioMedia(media as MediaType);
    setSelectedModel(m);
    setStudioPrompt(prompt);
    setCurrentScreen('create');
    addToast('Model selected in Create', `${m.name} selected with your prompt.`, 'success');
  };

  const useAsRef = (m: AIModel, r: Run) => {
    addReference({ name: `${m.name.replace(/\s+/g, '')}Cmp`, type: media, url: r.mediaUrl, thumbnailUrl: r.thumb, source: 'generated', tag: 'generated' }, false);
    addToast('Added as reference', `${m.name} result added to References.`, 'success');
  };

  const gridCols = selected.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';
  const SettingRow = ({ label, k, o }: { label: string; k: keyof CompareSettings; o: { options: string[]; fallback: boolean } }) =>
    o.options.length === 0 ? null : (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</span>
          {o.fallback && <span className="text-[10px] text-amber-400">no common value, each model adjusts</span>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {o.options.map((opt) => (
            <button key={opt} disabled={locked} onClick={() => setSettings((s) => ({ ...s, [k]: opt }))} className={chip(settings[k] === opt)}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <PageHeader
        icon={<GitCompare className="w-6 h-6 text-fuchsia-400" />}
        title="Compare"
        subtitle="Run one prompt on 2–3 models and pick the best result. Write a prompt, choose models, then click Compare."
        actions={
          phase !== 'idle' && (
            <button onClick={reset} disabled={locked} className={ghostBtn}>
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Prompt + models */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-white">1. Your prompt</span>
              <div className="flex p-0.5 rounded-xl bg-zinc-900 border border-zinc-800">
                {([['video', Video, 'Video'], ['image', ImageIcon, 'Image']] as const).map(([t, Icon, label]) => (
                  <button
                    key={t}
                    onClick={() => switchMedia(t)}
                    disabled={locked}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${media === t ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={prompt}
              disabled={locked}
              onChange={(e) => setPromptLocal(e.target.value)}
              rows={4}
              placeholder="Describe what every model should create…"
              className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/60 resize-none"
            />
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_COMPARE_PROMPTS[media].map((p, i) => (
                <button key={i} disabled={locked} onClick={() => setPromptLocal(p)} className="px-2.5 py-1 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-purple-500/40 text-[11px] text-zinc-400 hover:text-white truncate max-w-[16rem]">
                  {p.slice(0, 38)}…
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white">2. Choose 2 or 3 models <span className="text-zinc-500 font-bold">({selected.length}/3 chosen)</span></span>
                          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {available.map((m) => {
                const on = selected.some((s) => s.id === m.id);
                const disabled = m.status === 'Disabled';
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleModel(m)}
                    className={`text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      disabled ? 'opacity-50 border-zinc-800 bg-zinc-900/40 cursor-not-allowed' : on ? 'border-purple-500/60 bg-purple-600/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                        {m.name}
                        {m.status === 'Beta' && <span className="text-[9px] px-1.5 rounded bg-amber-500/15 text-amber-300">BETA</span>}
                      </span>
                      <span className="block text-[10px] text-zinc-500 truncate">{disabled ? 'Not available right now' : `${m.provider} · from ${m.creditCost} credits`}</span>
                    </span>
                    {disabled ? <Ban className="w-4 h-4 text-zinc-600" /> : on && <Check className="w-4 h-4 text-purple-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings + cost */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-4 space-y-4">
            <button onClick={() => setMoreOpts((v) => !v)} aria-expanded={moreOpts} className="w-full flex items-center justify-between text-xs font-extrabold text-white">
              <span>Settings <span className="text-zinc-500 font-bold">({[media === 'video' ? settings.duration : '', settings.resolution, settings.aspectRatio].filter(Boolean).join(' · ')})</span></span>
              <span className="text-[11px] text-purple-400 font-bold">{moreOpts ? 'Hide' : 'Change'}</span>
            </button>
            {moreOpts && (
              <>
                {media === 'video' && <SettingRow label="Length (duration)" k="duration" o={dur} />}
                <SettingRow label="Quality (resolution)" k="resolution" o={res} />
                <SettingRow label="Shape (aspect ratio)" k="aspectRatio" o={asp} />
                <p className="text-[10px] text-zinc-500">Only options that all chosen models support are shown.</p>
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer select-none pt-2 border-t border-zinc-800">
                  <input type="checkbox" checked={simulateFail} disabled={locked} onChange={(e) => setSimulateFail(e.target.checked)} className="accent-purple-500" />
                  Test a failure on the last model (credits are refunded)
                </label>
              </>
            )}
          </div>

          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <span className="text-xs font-extrabold text-white block">3. Cost</span>
            <div className="space-y-2">
              {costs.map(({ m, cost }) => (
                <div key={m.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-400 truncate">{caption(m, settings)}</span>
                  <span className="font-bold text-amber-300 flex items-center gap-1 shrink-0"><Zap className="w-3 h-3 fill-amber-300" />{cost}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <span className="text-xs font-bold text-white">Total (estimated)</span>
              <span className="text-lg font-black text-amber-300 flex items-center gap-1"><Zap className="w-4 h-4 fill-amber-300" />{total}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <span>Your balance</span>
              <span className={user.credits < total ? 'text-red-400 font-bold' : ''}>{user.credits} credits</span>
            </div>
            <button onClick={startCompare} disabled={locked || selected.length < 2} className={`${primaryBtn} w-full py-3`}>
              {locked ? <><Loader2 className="w-4 h-4 animate-spin" /> Comparing…</> : phase === 'done' ? <><RotateCcw className="w-4 h-4" /> Run again · {total} credits</> : <><Play className="w-4 h-4 fill-white" /> Compare · {total} credits</>}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
          Results {phase === 'done' && <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Finished</span>}
        </h2>
        <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
          {selected.map((m, i) => {
            const r = runs[m.id];
            return (
              <div key={m.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col">
                <div className="p-3 flex items-center gap-2 border-b border-zinc-800/80">
                  <span className="text-lg">{m.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-white truncate">{m.name}</div>
                    <div className="text-[10px] text-zinc-500">{m.provider}</div>
                  </div>
                  {bestValueId === m.id && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><BadgeDollarSign className="w-3 h-3" />Best value</span>}
                  {fastestId === m.id && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1"><Gauge className="w-3 h-3" />Fastest</span>}
                </div>

                <div className="aspect-video bg-zinc-950 relative flex items-center justify-center">
                  {!r ? (
                    <div className="text-center text-zinc-600 space-y-1 px-4">
                      {media === 'video' ? <Video className="w-8 h-8 mx-auto" /> : <ImageIcon className="w-8 h-8 mx-auto" />}
                      <p className="text-[11px]">Result {i + 1} appears here after you click Compare</p>
                    </div>
                  ) : r.stage === 'failed' ? (
                    <div className="text-center text-red-300 space-y-1 px-4">
                      <AlertTriangle className="w-8 h-8 mx-auto" />
                      <p className="text-xs font-bold">Something went wrong</p>
                      <p className="text-[10px] text-red-300/70">{r.cost} credits refunded</p>
                    </div>
                  ) : r.stage === 'complete' ? (
                    media === 'video' ? (
                      <video src={r.mediaUrl} poster={r.thumb} autoPlay muted loop playsInline controls className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.mediaUrl} alt={m.name} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="w-full px-6 space-y-2 text-center">
                      <Loader2 className="w-6 h-6 mx-auto text-purple-400 animate-spin" />
                      <p className="text-xs font-bold text-white">{STAGE_LABEL[r.stage]}…</p>
                      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-[width] duration-150" style={{ width: `${r.progress}%` }} />
                      </div>
                      <p className="text-[10px] text-zinc-500">{Math.round(r.progress)}%</p>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-3 flex-1 flex flex-col">
                  {r ? (
                    <>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {[r.settings.duration, r.settings.resolution, r.settings.aspectRatio].filter(Boolean).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-300" />{r.stage === 'failed' ? `0 (refunded ${r.cost})` : `${r.cost} credits`}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.stage === 'complete' ? `${r.genSeconds}s` : '—'}</span>
                      </div>
                      <button disabled={r.stage !== 'complete'} onClick={() => useModel(m)} className={`${primaryBtn} w-full mt-auto`}>
                        <Trophy className="w-3.5 h-3.5" /> Use this model
                      </button>
                      <button onClick={() => setMoreActions((v) => !v)} className="text-[11px] font-semibold text-zinc-400 hover:text-white">{moreActions ? 'Fewer actions' : 'More actions'}</button>
                      {moreActions && (
                        <div className="grid grid-cols-3 gap-1.5">
                          <button disabled={r.stage !== 'complete'} onClick={() => addToast('Download started', `${m.name} result is being saved…`, 'success')} className={ghostBtn}><Download className="w-3.5 h-3.5" />Download</button>
                          <button
                            disabled={r.stage !== 'complete'}
                            onClick={() => { setSaved((s) => [...s, m.id]); addToast('Saved to History', `${m.name} result added to your library.`, 'success'); }}
                            className={ghostBtn}
                          >
                            {saved.includes(m.id) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}Save
                          </button>
                          <button disabled={r.stage !== 'complete'} onClick={() => useAsRef(m, r)} className={ghostBtn}><Link2 className="w-3.5 h-3.5" />Reference</button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-[11px] text-zinc-500">{caption(m, settings)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
