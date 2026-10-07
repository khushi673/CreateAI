'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, Loader2, Music, Play, RefreshCw, ShieldAlert, Undo2, ImagePlay } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { JobStage } from '@/types';

const STEPS: { stage: JobStage; label: string }[] = [
  { stage: 'submitted', label: 'Job Submitted' },
  { stage: 'queued', label: 'Queued' },
  { stage: 'generating', label: 'Generating...' },
  { stage: 'complete', label: 'Generation Complete' },
];
const ORDER: JobStage[] = ['idle', 'submitted', 'queued', 'generating', 'complete'];

export const JobPanel: React.FC = () => {
  const {
    jobStage,
    generationProgress,
    jobCost,
    currentGenerationResult: result,
    selectedModel,
    startFrame,
    imageToVideo,
    resetJob,
    openResult,
    setCurrentScreen,
    setDemoOutcome,
    startGeneration,
  } = useApp();
  const [autoOpen, setAutoOpen] = useState(true);

  // Complete -> show the result page automatically after a short beat
  useEffect(() => {
    if (jobStage !== 'complete' || !result || !autoOpen) return;
    const t = setTimeout(() => openResult(result), 2200);
    return () => clearTimeout(t);
  }, [jobStage, result, autoOpen, openResult]);

  useEffect(() => {
    if (jobStage === 'submitted') setAutoOpen(true);
  }, [jobStage]);

  const running = jobStage === 'submitted' || jobStage === 'queued' || jobStage === 'generating';
  const stepIndex = ORDER.indexOf(jobStage);

  return (
    <div className="p-5 rounded-3xl glass-panel border border-zinc-800 min-h-[460px] flex flex-col shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
        <span className="text-xs font-bold text-white uppercase tracking-wider">Output</span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
            jobStage === 'complete' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : jobStage === 'failed' || jobStage === 'blocked' ? 'bg-rose-950 text-rose-300 border-rose-800' : running ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
          }`}
        >
          {jobStage === 'idle' ? 'READY' : jobStage === 'failed' ? 'FAILED' : jobStage === 'blocked' ? 'BLOCKED' : jobStage === 'complete' ? 'COMPLETED' : 'PROCESSING'}
        </span>
      </div>

      {/* Progress stepper (Submitted → Queued → Generating → Complete) */}
      {(running || jobStage === 'complete') && (
        <ol className="grid grid-cols-4 gap-2 mb-5" aria-label="Generation progress">
          {STEPS.map((s, i) => {
            const done = stepIndex > i + 1 || (jobStage === 'complete' && i < 4);
            const current = ORDER[i + 1] === jobStage && jobStage !== 'complete';
            return (
              <li key={s.stage} className="flex flex-col items-center text-center gap-1.5">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                    done ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : current ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-zinc-900 border-zinc-700 text-zinc-600'
                  }`}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : current ? <Loader2 className="w-4 h-4 animate-spin" /> : <Circle className="w-3 h-3" />}
                </span>
                <span className={`text-[10px] font-bold leading-tight ${done ? 'text-emerald-300' : current ? 'text-white' : 'text-zinc-500'}`}>{s.label}</span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Idle */}
        {jobStage === 'idle' && (
          <div className="w-full text-center space-y-4">
            {imageToVideo && startFrame ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800">
                <img src={startFrame} alt="Start frame" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 text-xs font-bold text-white">
                    <ImagePlay className="w-4 h-4 text-purple-300" /> Start frame set
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-purple-400">
                <Play className="w-8 h-8 ml-1" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-white">No generation yet</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
                Your result opens here when the generation completes.
              </p>
            </div>
          </div>
        )}

        {/* Running */}
        {running && (
          <div className="w-full text-center space-y-4 animate-fade-in-up">
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                {jobStage === 'generating' ? `${generationProgress}%` : ''}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {jobStage === 'submitted' ? 'Job Submitted' : jobStage === 'queued' ? 'Queued' : 'Generating...'}
              </h3>
              <p className="text-xs text-purple-300 font-mono mt-1">
                {jobStage === 'submitted' && `Safety check passed · ${jobCost} credits reserved`}
                {jobStage === 'queued' && 'Waiting for a free slot'}
                {jobStage === 'generating' && `${selectedModel.name} is generating your ${selectedModel.mediaTypes[0]}`}
              </p>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-full transition-all duration-300 rounded-full" style={{ width: `${jobStage === 'generating' ? generationProgress : jobStage === 'queued' ? 4 : 1}%` }} />
            </div>
          </div>
        )}

        {/* Complete */}
        {jobStage === 'complete' && result && (
          <div className="w-full space-y-4 animate-fade-in-up">
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 relative">
              {result.mediaType === 'video' ? (
                <video src={result.mediaUrl} poster={result.thumbnailUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              ) : result.mediaType === 'audio' ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-950">
                  <Music className="w-10 h-10 text-amber-400" />
                  <p className="text-xs font-bold text-white px-4 text-center">{result.title}</p>
                </div>
              ) : (
                <img src={result.mediaUrl} alt="" className="w-full h-full object-cover" />
              )}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-extrabold text-white">Generation Complete</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-zinc-400">{autoOpen ? 'Opening result…' : ''}</p>
              <div className="flex gap-2">
                {autoOpen && (
                  <button onClick={() => setAutoOpen(false)} className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white">
                    Cancel
                  </button>
                )}
                <button onClick={() => openResult(result)} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white inline-flex items-center gap-1.5">
                  View result <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Failed */}
        {jobStage === 'failed' && (
          <div className="w-full text-center space-y-4 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Generation Failed</h3>
              <p className="text-xs text-zinc-400 mt-1">The provider returned an error.</p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/50 border border-emerald-800 text-sm font-extrabold text-emerald-300">
              <Undo2 className="w-4 h-4" /> {jobCost} Credits Refunded
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => {
                  setDemoOutcome('success');
                  resetJob();
                  setTimeout(() => startGeneration(), 30);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-run
              </button>
              <button onClick={() => setCurrentScreen('credits')} className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white">
                View credits
              </button>
            </div>
          </div>
        )}

        {/* Blocked */}
        {jobStage === 'blocked' && (
          <div className="w-full text-center space-y-4 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-800 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Generation blocked</h3>
              <p className="text-xs text-zinc-300 mt-1">This request violates the platform&apos;s content policy.</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 font-bold">Safety Check: Blocked</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">0 credits charged</span>
            </div>
            <button
              onClick={() => {
                setDemoOutcome('success');
                resetJob();
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white"
            >
              Edit prompt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
