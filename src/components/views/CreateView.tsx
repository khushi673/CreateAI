'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Wand2,
  Sparkles,
  Film,
  Image as ImageIcon,
  Music,
  ImagePlay,
  Upload,
  X,
  Plus,
  Maximize2,
  Zap,
  FolderOpen,
  Dices,
  FlaskConical,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { PROMPT_TEMPLATES } from '@/data/mockData';
import { MediaType, DemoOutcome } from '@/types';
import { costSummary } from '@/lib/pricing';
import { ModelSelect } from '@/components/studio/ModelSelect';
import { PromptField } from '@/components/studio/PromptField';
import { JobPanel } from '@/components/studio/JobPanel';
import { ModalShell } from '@/components/common/ModalShell';
import { ReferencePickerModal, FramePickerModal } from '@/components/studio/PickerModals';
import { formatDuration, mentionOf } from '@/components/studio/helpers';

const Segmented: React.FC<{ options: string[]; value: string; onChange: (v: string) => void; format?: (v: string) => string }> = ({ options, value, onChange, format }) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map((o) => (
      <button
        key={o}
        type="button"
        onClick={() => onChange(o)}
        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
          value === o ? 'bg-purple-600 text-white border-purple-500 shadow' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
        }`}
      >
        {format ? format(o) : o}
      </button>
    ))}
  </div>
);

const Card: React.FC<{ step: string; help?: string; hint?: React.ReactNode; children: React.ReactNode }> = ({ step, help, hint, children }) => (
  <section className="p-5 rounded-2xl glass-panel border border-zinc-800 space-y-3">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-bold text-white">{step}</h2>
        {help && <p className="text-[11px] text-zinc-500 mt-0.5">{help}</p>}
      </div>
      {hint}
    </div>
    {children}
  </section>
);

const AspectGlyph: React.FC<{ ratio: string }> = ({ ratio }) => {
  const [w, h] = ratio.split(':').map(Number);
  const max = 16;
  const scale = max / Math.max(w, h);
  return <span className="inline-block border border-current rounded-[3px]" style={{ width: Math.round(w * scale), height: Math.round(h * scale) }} />;
};

export const CreateView: React.FC = () => {
  const {
    models,
    mediaType,
    setMediaType,
    imageToVideo,
    setImageToVideo,
    selectedModel,
    setSelectedModel,
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    aspectRatio,
    setAspectRatio,
    duration,
    setDuration,
    resolution,
    setResolution,
    seed,
    setSeed,
    audioStyle,
    setAudioStyle,
    extraSettings,
    setExtraSetting,
    startFrame,
    setStartFrame,
    endFrame,
    setEndFrame,
    estimatedCost,
    references,
    selectedReferenceIds,
    toggleReference,
    user,
    jobStage,
    demoOutcome,
    setDemoOutcome,
    startGeneration,
    projects,
    generateTarget,
    setGenerateTarget,
    addToast,
  } = useApp();

  const [promptModal, setPromptModal] = useState(false);
  const [refPicker, setRefPicker] = useState(false);
  const [framePicker, setFramePicker] = useState<'start' | 'end' | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const caps = selectedModel.capabilities;
  const running = jobStage === 'submitted' || jobStage === 'queued' || jobStage === 'generating';
  const available = models.filter((m) => m.mediaTypes.includes(mediaType) && m.status !== 'Disabled' && (!imageToVideo || m.capabilities.startFrame));
  const modelDisabled = selectedModel.status === 'Disabled';
  const selectedRefs = selectedReferenceIds.map((id) => references.find((r) => r.id === id)).filter(Boolean) as typeof references;
  const imageRefs = selectedRefs.filter((r) => r.type === 'image');
  const audioRefs = selectedRefs.filter((r) => r.type === 'audio');
  const insufficient = user.credits < estimatedCost;
  const targetProject = projects.find((p) => p.id === generateTarget?.projectId);
  const targetFolder = targetProject?.folders.find((f) => f.id === generateTarget?.folderId);

  const modes: { id: 'image' | 'video' | 'audio' | 'i2v'; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'image', label: 'Image', icon: ImageIcon, color: 'text-emerald-300' },
    { id: 'video', label: 'Video', icon: Film, color: 'text-purple-300' },
    { id: 'audio', label: 'Audio', icon: Music, color: 'text-amber-300' },
    { id: 'i2v', label: 'Image to Video', icon: ImagePlay, color: 'text-fuchsia-300' },
  ];
  const activeMode = imageToVideo ? 'i2v' : mediaType;

  const switchMode = (id: string) => {
    if (running) return;
    if (id === 'i2v') setImageToVideo(true);
    else {
      setImageToVideo(false);
      setMediaType(id as MediaType);
    }
  };

  const handleModelChange = (m: typeof selectedModel) => {
    setSelectedModel(m);
    addToast('Settings updated', `${m.name} shows its own options and pricing.`, 'info');
  };

  const enhance = () => {
    if (!prompt.trim()) return;
    const suffixes = [', 8k, photorealistic cinematic lighting, shallow depth of field', ', volumetric fog, golden hour, hyper-detailed textures', ', dynamic camera movement, motion blur, award-winning cinematography'];
    setPrompt(prompt + suffixes[Math.floor(Math.random() * suffixes.length)]);
    addToast('Prompt enhanced', 'Added style tags to the prompt', 'success');
  };

  const mentionPick = (r: { id: string }) => {
    if (!selectedReferenceIds.includes(r.id)) toggleReference(r.id);
  };

  const generateLabel = imageToVideo ? 'Generate Video' : `Generate ${mediaType === 'image' ? 'Image' : mediaType === 'video' ? 'Video' : 'Audio'}`;
  const outcomes: { id: DemoOutcome; label: string }[] = [
    { id: 'success', label: 'Success' },
    { id: 'fail', label: 'Fail + refund' },
    { id: 'blocked', label: 'Blocked' },
  ];

  const renderFrameSlot = (kind: 'start' | 'end', value: string | null, supported: boolean) => {
    const label = kind === 'start' ? 'Start image' : 'End image';
    const help = kind === 'start' ? 'The video begins with this image.' : 'The video ends on this image.';
    const set = kind === 'start' ? setStartFrame : setEndFrame;
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-zinc-300">{label}</span>
          {kind === 'start' && imageToVideo && <span className="text-[10px] font-bold text-rose-300">Required</span>}
          {kind === 'end' && supported && <span className="text-[10px] text-zinc-500">Optional</span>}
        </div>
        <p className="text-[11px] text-zinc-500 -mt-1 mb-1.5">{help}</p>
        {!supported ? (
          <div className="aspect-video rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 flex items-center justify-center text-center p-3">
            <p className="text-[11px] text-zinc-500">{label} isn’t supported by {selectedModel.name}.</p>
          </div>
        ) : value ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/50 group">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => setFramePicker(kind)} className="px-2.5 py-1 rounded-lg bg-white/90 text-zinc-900 text-[11px] font-bold">Change</button>
              <button onClick={() => set(null)} className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold">Remove</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setFramePicker(kind)}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-800 hover:border-purple-500/60 bg-zinc-900/30 hover:bg-zinc-900/60 flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Upload className="w-5 h-5 text-zinc-400" />
            <span className="text-[11px] font-semibold text-zinc-300">Choose image</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Create</h1>
          <p className="text-xs text-zinc-400 mt-1">Follow the steps from top to bottom, then press Generate.</p>
        </div>

        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto" role="tablist">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = activeMode === m.id;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={active}
                disabled={running}
                onClick={() => switchMode(m.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all disabled:opacity-60 ${
                  active ? 'bg-purple-600 text-white shadow-md shadow-purple-950' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : m.color}`} />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {targetProject && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border bg-purple-950/30 border-purple-600/40">
          <div className="flex items-center gap-2 text-xs text-zinc-200">
            <FolderOpen className="w-4 h-4 text-purple-300" />
            <span>
              Saving to <strong className="text-white">{targetProject.name}</strong>
              {targetFolder && <> › <strong className="text-white">{targetFolder.name}</strong></>}
            </span>
          </div>
          <button onClick={() => setGenerateTarget(null)} className="text-xs font-semibold text-zinc-300 hover:text-white inline-flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Stop saving here
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT: setup */}
        <div className="xl:col-span-7 space-y-5">
          {/* Step 1 */}
          <Card step="1. Choose a model" help="Different models make different looks. Not sure? Keep the default." hint={<span className="text-[11px] text-zinc-500">{available.length} available</span>}>
            <ModelSelect models={available} value={selectedModel} onChange={handleModelChange} />
            {modelDisabled && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200">
                {selectedModel.name} has been disabled by an administrator. Choose another model to continue.
              </div>
            )}
            <p className="text-[11px] text-zinc-500 leading-relaxed">{selectedModel.description}</p>
          </Card>

          {/* Step 2 */}
          <Card
            step="2. Describe what you want"
            help="Write one or two sentences. Be specific about the subject and setting."
            hint={
              <div className="flex items-center gap-1">
                <button onClick={enhance} disabled={!prompt.trim()} className="px-2 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 text-[11px] font-semibold flex items-center gap-1 disabled:opacity-40" title="Add style details to your prompt">
                  <Sparkles className="w-3 h-3" /> AI Enhance
                </button>
                <button onClick={() => setPromptModal(true)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/60" title="Expand prompt window" aria-label="Expand prompt window">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            }
          >
            <PromptField value={prompt} onChange={setPrompt} references={references} onMention={mentionPick} />
            {!prompt.trim() && <p className="text-[11px] text-amber-300/90">Type what you want to see, or pick an example below.</p>}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-zinc-500">Examples:</span>
              {PROMPT_TEMPLATES.slice(0, 3).map((t) => (
                <button key={t.label} onClick={() => setPrompt(t.prompt)} className="px-2 py-0.5 rounded-md text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 text-[11px] transition-colors">
                  {t.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Step 3 */}
          <Card
            step="3. Add references (optional)"
            help="Images that keep a person, outfit or style consistent."
            hint={
              <span className="text-[11px] text-zinc-500">
                {caps.maxReferenceImages > 0 ? `${imageRefs.length} / ${caps.maxReferenceImages} images` : 'No image references'}
                {caps.referenceAudio ? ` · ${audioRefs.length} audio` : ''}
              </span>
            }
          >
            {mediaType === 'video' && (caps.startFrame || caps.endFrame || imageToVideo) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderFrameSlot('start', startFrame, Boolean(caps.startFrame))}
                {renderFrameSlot('end', endFrame, Boolean(caps.endFrame))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {selectedRefs.map((r) => (
                <div key={r.id} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-purple-950/40 border border-purple-600/50">
                  <span className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center">
                    {r.type === 'audio' ? <Music className="w-4 h-4 text-amber-400" /> : <img src={r.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                  </span>
                  <span className="text-xs font-bold text-white">@{mentionOf(r.name)}</span>
                  <button onClick={() => toggleReference(r.id)} className="text-zinc-400 hover:text-rose-300" aria-label={`Remove ${r.name}`}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setRefPicker(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-zinc-700 hover:border-purple-500/60 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add reference
              </button>
              {selectedRefs.length === 0 && <span className="text-[11px] text-zinc-500">None added. You can skip this.</span>}
            </div>
            <p className="text-[11px] text-zinc-500">Type @ in the prompt to use a reference.</p>

            {caps.referenceAudio && (
              <div>
                <label className="block text-[11px] font-bold text-zinc-300">Reference audio</label>
                <p className="text-[11px] text-zinc-500 mb-1.5">A sound whose style the result should follow.</p>
                {audioRefs.length ? (
                  <p className="text-xs text-zinc-300">Using <strong className="text-white">@{mentionOf(audioRefs[0].name)}</strong> as style reference.</p>
                ) : (
                  <button onClick={() => setRefPicker(true)} className="px-3 py-2 rounded-xl border border-dashed border-zinc-700 hover:border-purple-500/60 text-xs font-bold text-zinc-300 hover:text-white">
                    Select / upload reference audio
                  </button>
                )}
              </div>
            )}
          </Card>

          {/* Step 4 */}
          <Card step="4. Settings" help={`Options for ${selectedModel.name}. Defaults work well.`}>
            <div key={selectedModel.id} className="space-y-4 animate-fade-in-up">
              {caps.durations && (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300">Duration</label>
                  <p className="text-[11px] text-zinc-500 mb-1.5">Longer clips cost more.</p>
                  <Segmented options={caps.durations} value={duration} onChange={setDuration} format={formatDuration} />
                </div>
              )}
              {caps.audioStyles && (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300">Audio style</label>
                  <p className="text-[11px] text-zinc-500 mb-1.5">The kind of sound to make.</p>
                  <Segmented options={caps.audioStyles} value={audioStyle} onChange={setAudioStyle} />
                </div>
              )}
              {caps.resolutions && (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300">Resolution</label>
                  <p className="text-[11px] text-zinc-500 mb-1.5">Higher = sharper and costs more.</p>
                  <Segmented options={caps.resolutions} value={resolution} onChange={setResolution} />
                </div>
              )}
              {caps.aspectRatios && caps.aspectRatios.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300">Aspect ratio</label>
                  <p className="text-[11px] text-zinc-500 mb-1.5">Shape of the output.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {caps.aspectRatios.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAspectRatio(r)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                          aspectRatio === r ? 'bg-purple-600 text-white border-purple-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <AspectGlyph ratio={r} /> {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-zinc-800/80 pt-3">
                <button type="button" onClick={() => setShowAdvanced((s) => !s)} aria-expanded={showAdvanced} className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5">
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} /> Advanced
                  <span className="text-[11px] font-normal text-zinc-500">negative prompt, seed, model extras</span>
                </button>
                {showAdvanced && (
                  <div className="mt-3 space-y-4 animate-fade-in-up">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300">Negative prompt</label>
                      <p className="text-[11px] text-zinc-500 mb-1.5">Things you do not want in the result.</p>
                      {caps.negativePrompt ? (
                        <textarea
                          rows={2}
                          value={negativePrompt}
                          onChange={(e) => setNegativePrompt(e.target.value)}
                          placeholder="blurry, distorted anatomy, low resolution…"
                          className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-2 px-3 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
                        />
                      ) : (
                        <p className="text-[11px] text-zinc-500 p-2.5 rounded-xl bg-zinc-900/40 border border-dashed border-zinc-800">{selectedModel.name} doesn’t support negative prompts.</p>
                      )}
                    </div>
                    {caps.seed && (
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300">Seed</label>
                        <p className="text-[11px] text-zinc-500 mb-1.5">Reuse the same number to get a similar result.</p>
                        <div className="flex gap-2 max-w-xs">
                          <input
                            type="text"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value.replace(/\D/g, ''))}
                            placeholder="Random"
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                          />
                          <button onClick={() => setSeed(String(Math.floor(Math.random() * 9000000 + 1000000)))} className="px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white" title="Randomize seed" aria-label="Randomize seed">
                            <Dices className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    {caps.extras?.map((e) => (
                      <div key={e.key}>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">{e.label}</label>
                        <Segmented options={e.options} value={extraSettings[e.key] ?? e.default} onChange={(v) => setExtraSetting(e.key, v)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Cost + Generate */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/50 via-zinc-900/80 to-indigo-950/40 border border-purple-700/40 space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300">Estimated Cost</p>
                <p key={estimatedCost} className="text-3xl font-black text-white flex items-baseline gap-2 animate-pop">
                  <Zap className="w-6 h-6 text-amber-400 fill-amber-400 self-center" />
                  {estimatedCost} <span className="text-base font-bold text-zinc-300">Credits</span>
                </p>
                <p className="text-xs text-zinc-300 mt-1 font-mono">{costSummary(selectedModel, formatDuration(duration), resolution)}</p>
                <p className="text-[11px] text-zinc-500 mt-1">Cost depends on the model, length and quality you choose.</p>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                <p>Balance <strong className="text-white">{user.credits.toLocaleString()}</strong></p>
                <p className={insufficient ? 'text-rose-300 font-bold' : ''}>After: {(user.credits - estimatedCost).toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={() => startGeneration()}
              disabled={running || modelDisabled || !prompt.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm transition-all shadow-xl shadow-purple-950 flex items-center justify-center gap-2"
            >
              {running ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {generateLabel}
                </>
              )}
            </button>

            {/* Prototype demo controls */}
            <div className="pt-3 border-t border-zinc-800/80">
              <button onClick={() => setShowDemo((s) => !s)} className="text-[11px] font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" /> Prototype demo controls {showDemo ? '▲' : '▼'}
              </button>
              {showDemo && (
                <div className="mt-2 space-y-2 animate-fade-in-up">
                  <p className="text-[11px] text-zinc-400">Choose the outcome of the next generation:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {outcomes.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setDemoOutcome(o.id)}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${demoOutcome === o.id ? 'bg-amber-500/20 border-amber-500/60 text-amber-200' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!showDemo && demoOutcome !== 'success' && <p className="text-[11px] text-amber-300 mt-1">Next generation outcome: {outcomes.find((o) => o.id === demoOutcome)?.label}</p>}
            </div>
          </div>
        </div>

        {/* RIGHT: output / job */}
        <div className="xl:col-span-5">
          <div className="xl:sticky xl:top-[85px]">
            <JobPanel />
          </div>
        </div>
      </div>

      {/* Modals */}
      {promptModal && (
        <ModalShell
          title="Prompt editor"
          subtitle="A larger writing space. Type @ to reference characters and outfits."
          onClose={() => setPromptModal(false)}
          size="lg"
          footer={
            <div className="flex justify-end">
              <button onClick={() => setPromptModal(false)} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">Done</button>
            </div>
          }
        >
          <PromptField value={prompt} onChange={setPrompt} references={references} onMention={mentionPick} rows={14} autoFocus />
          {caps.negativePrompt && (
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Negative prompt</label>
              <textarea rows={3} value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 resize-none" />
            </div>
          )}
        </ModalShell>
      )}
      {refPicker && <ReferencePickerModal onClose={() => setRefPicker(false)} />}
      {framePicker && (
        <FramePickerModal
          title={framePicker === 'start' ? 'Select start image' : 'Select end image'}
          onClose={() => setFramePicker(null)}
          onPick={(url) => {
            (framePicker === 'start' ? setStartFrame : setEndFrame)(url);
            setFramePicker(null);
            addToast(framePicker === 'start' ? 'Start image set' : 'End image set', undefined, 'success');
          }}
        />
      )}
    </div>
  );
};
