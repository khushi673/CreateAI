'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Wand2, 
  Sparkles, 
  Film, 
  Image as ImageIcon, 
  Music, 
  Sliders, 
  Upload, 
  X, 
  RotateCw, 
  Download, 
  FolderPlus, 
  RotateCcw, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Info, 
  Video, 
  Play, 
  SlidersHorizontal,
  Shuffle
} from 'lucide-react';
import { AI_MODELS, PROMPT_TEMPLATES } from '@/data/mockData';
import { MediaType } from '@/types';

export const CreateView: React.FC = () => {
  const {
    mediaType,
    setMediaType,
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
    motionSpeed,
    setMotionSpeed,
    cameraMovement,
    setCameraMovement,
    guidanceScale,
    setGuidanceScale,
    seed,
    setSeed,
    referenceMedia,
    setReferenceMedia,
    isGenerating,
    generationProgress,
    generationStep,
    currentGenerationResult,
    startGeneration,
    setTargetAssetForProject,
    setSaveToProjectModalOpen,
    useAsReference,
    setAssetDetailModalItem,
    addToast
  } = useApp();

  const [settingsOpen, setSettingsOpen] = useState(true);

  // Filter available models for current media type
  const availableModels = AI_MODELS.filter((m) => m.mediaTypes.includes(mediaType));

  const handleEnhancePrompt = () => {
    if (!prompt) return;
    const enhancements = [
      ', 8k resolution, photorealistic cinematic lighting, raytraced reflections, Octane Render, 35mm lens f/1.8',
      ', volumetric fog, golden hour lighting, hyper-detailed textures, masterpiece, high motion fidelity',
      ', dynamic camera movement, motion blur, Unreal Engine 5 render, award winning cinematography'
    ];
    const suffix = enhancements[Math.floor(Math.random() * enhancements.length)];
    setPrompt(prompt + suffix);
    addToast('Prompt Enhanced', 'Added professional cinematic modifier tags', 'success');
  };

  const handleRandomizePrompt = () => {
    const randomTpl = PROMPT_TEMPLATES[Math.floor(Math.random() * PROMPT_TEMPLATES.length)];
    setPrompt(randomTpl.prompt);
    addToast('Randomized Prompt', `Loaded "${randomTpl.label}" template`, 'info');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
            <h1 className="text-xl sm:text-2xl font-black text-white">AI Creation Studio</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-800">
              V1 LIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Synthesize videos, photos, and soundtrack stems with industry leading neural models.
          </p>
        </div>

        {/* Media Type Switcher Tabs */}
        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <button
            onClick={() => {
              setMediaType('video');
              const vidModel = AI_MODELS.find((m) => m.mediaTypes.includes('video'));
              if (vidModel) setSelectedModel(vidModel);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mediaType === 'video' ? 'bg-purple-600 text-white shadow-md shadow-purple-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4 text-purple-300" />
            Video Studio
          </button>
          <button
            onClick={() => {
              setMediaType('image');
              const imgModel = AI_MODELS.find((m) => m.mediaTypes.includes('image'));
              if (imgModel) setSelectedModel(imgModel);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mediaType === 'image' ? 'bg-purple-600 text-white shadow-md shadow-purple-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-300" />
            Image Studio
          </button>
          <button
            onClick={() => {
              setMediaType('audio');
              const audModel = AI_MODELS.find((m) => m.mediaTypes.includes('audio'));
              if (audModel) setSelectedModel(audModel);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mediaType === 'audio' ? 'bg-purple-600 text-white shadow-md shadow-purple-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4 text-amber-300" />
            Audio Studio
          </button>
        </div>
      </div>

      {/* Main Creation Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Model Picker + Prompt + Parameters Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Select AI Model Engine */}
          <div className="p-5 rounded-2xl glass-panel border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                1. Select AI Model Engine
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
                Active: <strong className="text-white">{selectedModel.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableModels.map((model) => {
                const isSelected = selectedModel.id === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/50 text-white shadow-lg'
                        : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{model.icon}</span>
                        {model.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-900 text-purple-200 rounded">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white leading-tight">{model.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{model.provider}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-400">⚡ {model.creditCost} Credits</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Prompt Input & Helper Tools */}
          <div className="p-5 rounded-2xl glass-panel border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-purple-400" />
                2. Enter Prompt & Description
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRandomizePrompt}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-semibold flex items-center gap-1 border border-zinc-800 transition-colors"
                  title="Randomize Prompt"
                >
                  <Shuffle className="w-3 h-3 text-amber-400" />
                  Random
                </button>
                <button
                  onClick={handleEnhancePrompt}
                  className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700/60 text-purple-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                  title="AI Enhance Prompt"
                >
                  <Sparkles className="w-3 h-3 text-fuchsia-400" />
                  AI Enhance
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your scene in detail (e.g. Cyberpunk samurai walking in rain, cinematic lighting, 4k ultra detail)..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
            />

            {/* Preset Prompt Template Pills */}
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                Template Ideas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(tpl.prompt)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] transition-colors"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="pt-3 border-t border-zinc-800/80">
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                Negative Prompt (Things to exclude)
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, distorted anatomy, grainy, low resolution..."
                className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-2 px-3 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Step 3: Input Reference Media (If selected or uploaded) */}
          <div className="p-5 rounded-2xl glass-panel border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-purple-400" />
                3. Input Reference Media (Optional)
              </label>
              {referenceMedia && (
                <button
                  onClick={() => setReferenceMedia(null)}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> Remove Reference
                </button>
              )}
            </div>

            {referenceMedia ? (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-950/30 border border-purple-500/40">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-purple-500 bg-black">
                  <img
                    src={'thumbnailUrl' in referenceMedia ? referenceMedia.thumbnailUrl : referenceMedia.mediaUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-white truncate">
                    {'title' in referenceMedia ? referenceMedia.title : 'Uploaded Reference'}
                  </p>
                  <p className="text-[10px] text-purple-300 font-mono mt-0.5">Reference Image Loaded for Motion Synthesis</p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  setReferenceMedia({
                    mediaUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
                    title: 'Sample Reference Shot'
                  });
                  addToast('Reference Loaded', 'Attached sample reference frame for video generation', 'info');
                }}
                className="border-2 border-dashed border-zinc-800 hover:border-purple-500/50 rounded-xl p-6 text-center cursor-pointer transition-all bg-zinc-900/30 hover:bg-zinc-900/60"
              >
                <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-zinc-300">
                  Click to Upload or Drag Reference Image / Frame
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Supports PNG, JPG, MP4 up to 50MB. Used by Kling & Wan 2.1 for image-to-video motion.
                </p>
              </div>
            )}
          </div>

          {/* Step 4: Settings & Parameters Panel */}
          <div className="p-5 rounded-2xl glass-panel border border-zinc-800 space-y-4">
            <div
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                4. Generation Settings & Parameters
              </label>
              <span className="text-xs text-purple-400 font-semibold">
                {settingsOpen ? 'Collapse Controls ▲' : 'Expand Controls ▼'}
              </span>
            </div>

            {settingsOpen && (
              <div className="space-y-4 pt-2 border-t border-zinc-800/80">
                
                {/* Aspect Ratio */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['16:9', '9:16', '1:1', '4:3', '21:9'].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all ${
                          aspectRatio === ratio
                            ? 'bg-purple-600 text-white border-purple-500 shadow'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration & Resolution (If video) */}
                {mediaType === 'video' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">Duration</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['5s', '10s', '15s'].map((dur) => (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setDuration(dur)}
                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                              duration === dur
                                ? 'bg-purple-600 text-white border-purple-500'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                            }`}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">Output Resolution</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['720p', '1080p', '4K'].map((res) => (
                          <button
                            key={res}
                            type="button"
                            onClick={() => setResolution(res)}
                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                              resolution === res
                                ? 'bg-purple-600 text-white border-purple-500'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Motion Speed & Camera Movement (If video) */}
                {mediaType === 'video' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[11px] font-bold text-zinc-300">Motion Speed</label>
                        <span className="text-xs font-mono text-purple-400 font-bold">{motionSpeed} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={motionSpeed}
                        onChange={(e) => setMotionSpeed(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">Camera Movement</label>
                      <select
                        value={cameraMovement}
                        onChange={(e) => setCameraMovement(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="Pan Right">Pan Right</option>
                        <option value="Pan Left">Pan Left</option>
                        <option value="Zoom In">Zoom In</option>
                        <option value="Zoom Out">Zoom Out</option>
                        <option value="Orbit 360">Orbit 360</option>
                        <option value="Static Tripod">Static Tripod</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Guidance Scale & Seed */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-bold text-zinc-300">Guidance Scale (CFG)</label>
                      <span className="text-xs font-mono text-purple-400 font-bold">{guidanceScale}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={guidanceScale}
                      onChange={(e) => setGuidanceScale(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">Seed</label>
                    <input
                      type="text"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      placeholder="Random (e.g. 8910471)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Action Trigger Generate Button */}
          <button
            onClick={startGeneration}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white font-black text-sm transition-all shadow-xl shadow-purple-950 flex items-center justify-center gap-2 group"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin text-white" />
                <span>Generating with {selectedModel.name}... ({generationProgress}%)</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Generate {mediaType.toUpperCase()} (⚡ {selectedModel.creditCost} Credits)</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: Live Generation Queue Loader & Completed Output Stage (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 min-h-[480px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
            
            {/* Stage Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                Render Canvas & Output Preview
              </span>
              {currentGenerationResult && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  READY
                </span>
              )}
            </div>

            {/* Stage Content Switcher */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[320px]">
              
              {/* STATE 1: Live Generation Progress / Processing Queued State */}
              {isGenerating && (
                <div className="w-full flex flex-col items-center justify-center text-center p-6 space-y-6 animate-in fade-in">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin flex items-center justify-center"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                      {generationProgress}%
                    </div>
                  </div>

                  <div className="space-y-2 max-w-xs">
                    <h3 className="text-sm font-bold text-white">Synthesizing Latent Frames</h3>
                    <p className="text-xs text-purple-300 font-mono animate-pulse">{generationStep}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>

                  <p className="text-[10px] text-zinc-400">
                    Model: {selectedModel.name} • GPU Cluster #14 • Estimated time ~10s
                  </p>
                </div>
              )}

              {/* STATE 2: Show Completed Sample Result */}
              {!isGenerating && currentGenerationResult && (
                <div className="w-full flex flex-col items-center space-y-4 animate-in fade-in">
                  
                  {/* Media Player Container */}
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 relative group shadow-2xl">
                    {currentGenerationResult.mediaType === 'video' ? (
                      <video
                        src={currentGenerationResult.mediaUrl}
                        poster={currentGenerationResult.thumbnailUrl}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : currentGenerationResult.mediaType === 'audio' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-zinc-950">
                        <Music className="w-12 h-12 text-amber-400 animate-pulse" />
                        <p className="text-xs font-bold text-white">{currentGenerationResult.title}</p>
                        <audio src={currentGenerationResult.mediaUrl} controls className="w-full" />
                      </div>
                    ) : (
                      <img
                        src={currentGenerationResult.mediaUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Generated Details */}
                  <div className="w-full p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                    <p className="font-bold text-white truncate">{currentGenerationResult.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                      <span>{currentGenerationResult.modelName}</span>
                      <span>Seed: {currentGenerationResult.seed}</span>
                    </div>
                  </div>

                  {/* Required Post-Generation Actions */}
                  <div className="w-full grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setTargetAssetForProject(currentGenerationResult);
                        setSaveToProjectModalOpen(true);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-950 flex items-center justify-center gap-1.5"
                    >
                      <FolderPlus className="w-4 h-4" />
                      Save to Project
                    </button>

                    <button
                      onClick={() => useAsReference(currentGenerationResult)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Use as Reference
                    </button>

                    <button
                      onClick={() => addToast('Download Started', `Downloading 4K file for ${currentGenerationResult.title}`, 'info')}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>

                    <button
                      onClick={startGeneration}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Regenerate
                    </button>
                  </div>

                </div>
              )}

              {/* STATE 3: Idle Stage Initial Prompt */}
              {!isGenerating && !currentGenerationResult && (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-purple-400">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Canvas Ready for Render</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    Fill out the prompt & choose your model on the left, then click Generate to start rendering.
                  </p>
                </div>
              )}

            </div>

            {/* Footer Tip */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-purple-400" /> All assets saved to history
              </span>
              <span>Commercial License Included</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
