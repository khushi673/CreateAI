'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  Wand2, 
  Play, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Film, 
  Image as ImageIcon, 
  Music, 
  CheckCircle2, 
  Star,
  Layers,
  Cpu
} from 'lucide-react';
import { AI_MODELS } from '@/data/mockData';

export const LandingView: React.FC = () => {
  const { setCurrentScreen, setAuthMode, setAuthModalOpen, setMediaType, setSelectedModel } = useApp();

  const handleStartCreate = (modelId?: string) => {
    if (modelId) {
      const model = AI_MODELS.find((m) => m.id === modelId);
      if (model) setSelectedModel(model);
    }
    setCurrentScreen('create');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-purple-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Background Glowing Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-6 shadow-xl animate-in fade-in">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Kling AI v1.5 & Wan 2.1 Video Models Now Live</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Turn Any Text into <br />
            <span className="gradient-text">Cinematic 4K AI Media</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The next-generation AI creation platform for creators, VFX artists, and storytellers. Harness Kling, Wan 2.1, Seedance & Nano Banana in one unified studio.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
            onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-sm transition-all shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2 group"
            >
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Creating Free (+50 Credits)
            </button>

            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
              Watch Platform Tour
            </button>
          </div>

          {/* Key Stats Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-zinc-900 pt-8">
            <div>
              <div className="text-2xl font-extrabold text-white">1.4M+</div>
              <div className="text-xs text-zinc-400 mt-0.5">Generations Rendered</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">48,000+</div>
              <div className="text-xs text-zinc-400 mt-0.5">Active Creators</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">4K 60fps</div>
              <div className="text-xs text-zinc-400 mt-0.5">Output Resolution</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-400">&lt; 15 sec</div>
              <div className="text-xs text-zinc-400 mt-0.5">Average Render Time</div>
            </div>
          </div>

        </div>

        {/* Video & Image Studio Interactive Mock Showcase */}
        <div className="mt-16 max-w-5xl mx-auto relative z-10">
          <div className="p-2 sm:p-4 rounded-3xl glass-panel border border-zinc-800/90 shadow-2xl overflow-hidden group">
            
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950/60 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-zinc-400 font-mono ml-2">aethergen.ai/studio/kling-v1-5</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  GPU CLUSTER ONLINE
                </span>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video w-full rounded-b-2xl overflow-hidden bg-black">
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-traffic-and-neon-lights-42861-large.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Overlay Prompt Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 p-4 rounded-2xl glass-panel border border-zinc-700/80 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white">Kling AI v1.5</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Seed: 8910471 • 16:9 • 4K</span>
                  </div>
                  <p className="text-xs text-zinc-200 font-medium truncate">
                    "Cinematic shot of a cybernetic samurai walking down a neon-drenched Tokyo alleyway..."
                  </p>
                </div>
                <button
                onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-md shadow-purple-950"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Try This Model
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Model Roster Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Powered by Next-Gen AI Models
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Select specialized neural engines tailored for motion physics, photorealism, character dynamics & audio stems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_MODELS.map((model) => (
              <div
                key={model.id}
                onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
                className="p-6 rounded-3xl glass-card border border-zinc-800/80 hover:border-purple-500/50 transition-all cursor-pointer group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{model.icon}</span>
                    <div className="flex items-center gap-2">
                      {model.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-800">
                          {model.badge}
                        </span>
                      )}
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50">
                        ⚡ {model.creditCost} Credits
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {model.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono mb-3">{model.provider} • {model.version}</p>
                  
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    {model.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{model.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Launch Studio <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Image to Video & Motion Control</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload any reference artwork, sketch, or photo and animate camera pans, orbits, and character movement seamlessly.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Parallel Multi-Model Pipeline</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Compare Kling AI v1.5 alongside Wan 2.1 and Seedance simultaneously to select the perfect aesthetic output.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Project Folder Library</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Group clips into commercial film bins, export full project zip archives, and keep track of prompt seeds & history.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-purple-950 via-zinc-900 to-indigo-950 border border-purple-500/40 text-center relative z-10 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Ready to Generate Next-Gen AI Video?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto mb-8">
            Join thousands of filmmakers, VFX directors, and content creators today. Instant credit bonus included.
          </p>
          <button
          onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
            className="px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-purple-950 inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Enter AI Creation Studio
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-900 text-center text-xs text-zinc-400">
        <p>© 2026 AetherGen AI Creation Platform V1 Prototype. Built with Next.js, React, TypeScript & Tailwind CSS.</p>
      </footer>

    </div>
  );
};
