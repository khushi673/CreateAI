'use client';

import React, { useState } from 'react';
import { copyText } from '@/lib/clipboard';
import { GenerationActions } from '@/components/common/GenerationActions';
import { useApp } from '@/context/AppContext';
import { GenerationItem } from '@/types';
import {
  ArrowLeft, FolderPlus, Wand2, Copy, Check, Sparkles, ShieldCheck, ShieldAlert,
  AlertTriangle, Coins, Calendar, Folder, Film, ImageIcon, Music,
} from 'lucide-react';

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-zinc-800/70 last:border-0 text-xs">
    <span className="text-zinc-500 shrink-0">{label}</span>
    <span className="text-zinc-200 font-semibold text-right break-words min-w-0">{children}</span>
  </div>
);

export const ResultView: React.FC = () => {
  const {
    activeResult, generations, projects, setCurrentScreen, openResult,
    setTargetAssetForProject, setSaveToProjectModalOpen, setPrompt, addToast,
    setSelectedProjectDetail,
  } = useApp();
  const [copied, setCopied] = useState<string | null>(null);

  if (!activeResult) {
    return (
      <div className="p-12 text-center glass-panel rounded-3xl border border-zinc-800 space-y-3 max-w-lg mx-auto mt-10">
        <Sparkles className="w-10 h-10 text-zinc-600 mx-auto" />
        <h2 className="text-base font-bold text-white">No generation selected</h2>
        <p className="text-xs text-zinc-400">Open a generation from History, or create your first one in Create.</p>
        <div className="flex justify-center gap-2">
          <button onClick={() => setCurrentScreen('create')} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">Go to Create</button>
          <button onClick={() => setCurrentScreen('history')} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold">Open History</button>
        </div>
      </div>
    );
  }

  const item: GenerationItem = generations.find((g) => g.id === activeResult.id) ?? activeResult;
  const project = item.projectId ? projects.find((p) => p.id === item.projectId) : undefined;
  const folder = project?.folders.find((f) => f.id === item.folderId);
  const others = generations.filter((g) => g.id !== item.id).slice(0, 8);
  const isOk = item.status === 'Completed';

  const copy = (text: string, key: string, msg: string) => {
    void copyText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
    addToast(msg, undefined, 'success');
  };

  const extra = Object.entries(item.extraSettings ?? {});

  return (
    <div className="space-y-6 pb-20">
      <button onClick={() => setCurrentScreen('history')} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to History
      </button>
      <p className="text-xs text-zinc-400 -mt-3">Your result. Download it first, or open More actions to save, re-run or reuse it.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6">
        {/* Preview + actions */}
        <div className="space-y-4 min-w-0">
          {item.status === 'Blocked' ? (
            <div className="rounded-3xl border border-red-500/40 bg-red-950/20 p-8 sm:p-12 text-center space-y-3">
              <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
              <h2 className="text-lg font-black text-white">Generation blocked</h2>
              <p className="text-sm text-red-200/80 max-w-md mx-auto">This prompt breaks the content rules.</p>
              <p className="text-[11px] text-zinc-400">No credits were charged. Change the prompt and try again.</p>
            </div>
          ) : item.status === 'Failed' ? (
            <div className="rounded-3xl border border-amber-500/40 bg-amber-950/20 p-8 sm:p-12 text-center space-y-3">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-lg font-black text-white">Generation failed</h2>
              <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                <Coins className="w-3.5 h-3.5" /> {item.creditsUsed} credits refunded
              </p>
              <p className="text-[11px] text-zinc-400">Something went wrong. Open More actions and choose Re-run.</p>
            </div>
          ) : (
            <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-black shadow-2xl">
              {item.mediaType === 'video' && (
                <video key={item.id} src={item.mediaUrl} poster={item.thumbnailUrl} controls loop playsInline className="w-full max-h-[70vh] bg-black" />
              )}
              {item.mediaType === 'image' && <img src={item.mediaUrl} alt={item.title} className="w-full max-h-[70vh] object-contain bg-black" />}
              {item.mediaType === 'audio' && (
                <div className="p-6 flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-br from-zinc-950 to-purple-950/30">
                  <img src={item.thumbnailUrl} alt="" className="w-40 h-40 rounded-2xl object-cover border border-zinc-800 shrink-0" />
                  <audio key={item.id} src={item.mediaUrl} controls className="w-full" />
                </div>
              )}
            </div>
          )}

          <GenerationActions
            item={item}
            variant="labeled"
            onDeleted={() => setCurrentScreen('history')}
            extra={isOk ? (
              <button onClick={() => { setTargetAssetForProject(item); setSaveToProjectModalOpen(true); }} className="px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center gap-1.5 transition-colors"><FolderPlus className="w-4 h-4" /> Save to project</button>
            ) : undefined}
          />
        </div>

        {/* Details */}
        <div className="space-y-4 min-w-0">
          <div className="p-5 rounded-2xl glass-panel border border-zinc-800">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-base font-black text-white leading-snug">{item.title}</h1>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : item.status === 'Failed' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>{item.status}</span>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold mb-3 border ${item.safetyCheck === 'Passed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : item.safetyCheck === 'Flagged' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
              {item.safetyCheck === 'Passed' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              Safety check: {item.safetyCheck}
            </div>

            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Details</p>
            <Row label="Model">{item.modelName}</Row>
            <Row label="Type"><span className="inline-flex items-center gap-1 capitalize">{item.mediaType === 'video' ? <Film className="w-3 h-3" /> : item.mediaType === 'audio' ? <Music className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}{item.mediaType}</span></Row>
            {item.aspectRatio && item.aspectRatio !== 'N/A' && <Row label="Shape (aspect ratio)">{item.aspectRatio}</Row>}
            {item.duration && <Row label="Duration">{item.duration}</Row>}
            {item.resolution && <Row label="Resolution">{item.resolution}</Row>}
            {item.seed && <Row label="Seed (repeat code)"><span className="font-mono">{item.seed}</span></Row>}
            {extra.map(([k, v]) => (
              <Row key={k} label={k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}>{v}</Row>
            ))}
            <Row label="References used">{item.referenceNames && item.referenceNames.length > 0 ? item.referenceNames.map((n) => `@${n}`).join(', ') : 'None'}</Row>
            <Row label="Credits used"><span className="inline-flex items-center gap-1"><Coins className="w-3 h-3 text-amber-400" />{item.creditsUsed}{item.status === 'Failed' ? ' (refunded)' : ''}</span></Row>
            <Row label="Created"><span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3 text-zinc-500" />{item.date}</span></Row>
            <Row label="Downloads">{item.downloads}</Row>
            {project && (
              <Row label="Saved in">
                <button
                  onClick={() => { setSelectedProjectDetail(project); setCurrentScreen('project-detail'); }}
                  className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors"
                >
                  <Folder className="w-3 h-3" />{project.name}{folder ? ` › ${folder.name}` : ''}
                </button>
              </Row>
            )}
          </div>

          {(item.startFrame || item.endFrame) && (
            <div className="p-4 rounded-2xl glass-panel border border-zinc-800">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Frames</p>
              <div className="flex gap-3">
                {item.startFrame && (
                  <div><img src={item.startFrame} alt="Start frame" className="w-24 h-16 rounded-lg object-cover border border-zinc-700" /><p className="text-[10px] text-zinc-400 mt-1">Start frame</p></div>
                )}
                {item.endFrame && (
                  <div><img src={item.endFrame} alt="End frame" className="w-24 h-16 rounded-lg object-cover border border-zinc-700" /><p className="text-[10px] text-zinc-400 mt-1">End frame</p></div>
                )}
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl glass-panel border border-zinc-800 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Prompt</p>
                <button onClick={() => copy(item.prompt, 'p', 'Prompt copied')} className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  {copied === 'p' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied === 'p' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">{item.prompt}</p>
              <button
                onClick={() => { setPrompt(item.prompt); setCurrentScreen('create'); addToast('Prompt loaded into Create', undefined, 'info'); }}
                className="mt-3 text-[11px] font-bold text-fuchsia-300 hover:text-fuchsia-200 flex items-center gap-1"
              ><Wand2 className="w-3 h-3" /> Edit this prompt in Create</button>
            </div>
            {item.negativePrompt && (
              <div className="pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Negative prompt (what to avoid)</p>
                  <button onClick={() => copy(item.negativePrompt!, 'n', 'Negative prompt copied')} className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    {copied === 'n' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied === 'n' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.negativePrompt}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent generations */}
      {others.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-white mb-3">Recent generations</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {others.map((g) => (
              <button key={g.id} onClick={() => { openResult(g); window.scrollTo?.({ top: 0, behavior: 'smooth' }); }} className="shrink-0 w-40 text-left group">
                <div className="aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 group-hover:border-purple-500/50 transition-colors">
                  <img src={g.thumbnailUrl} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <p className="text-[11px] text-zinc-300 truncate mt-1.5">{g.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};
