'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bot,
  Cpu,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const AdminLLMConfiguration: React.FC = () => {
  const { addToast } = useApp();

  const [provider, setProvider] = useState('OpenAI');
  const [model, setModel] = useState('gpt-4.1');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.9);
  const [safetyMode, setSafetyMode] = useState<'Strict' | 'Balanced' | 'Relaxed'>('Balanced');
  const [fallbackEnabled, setFallbackEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('LLM Configuration Saved', `Provider: ${provider} • Model: ${model}`, 'success');
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-black text-white">LLM Configuration</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage the default inference provider, model behavior, safety settings, and failover logic.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          Sync Providers
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-purple-300">
              <Cpu className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Default Inference</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option>OpenAI</option>
                  <option>Anthropic</option>
                  <option>Google</option>
                  <option>Azure OpenAI</option>
                  <option>Groq</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="gpt-4.1">GPT-4.1</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="claude-sonnet-4">Claude Sonnet 4</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="llama-3.1-70b">Llama 3.1 70B</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-300">
              <SlidersHorizontal className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Response Tuning</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-zinc-400">Temperature</label>
                  <span className="text-[11px] font-bold text-amber-300">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-zinc-400">Max Tokens</label>
                  <span className="text-[11px] font-bold text-amber-300">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="4096"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-zinc-400">Top P</label>
                  <span className="text-[11px] font-bold text-amber-300">{topP.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Safety & Routing</h3>
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Safety Policy</label>
              <select
                value={safetyMode}
                onChange={(e) => setSafetyMode(e.target.value as 'Strict' | 'Balanced' | 'Relaxed')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option>Strict</option>
                <option>Balanced</option>
                <option>Relaxed</option>
              </select>
            </div>

            <label className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-200">
              <span>Auto fallback to secondary provider</span>
              <input
                type="checkbox"
                checked={fallbackEnabled}
                onChange={(e) => setFallbackEnabled(e.target.checked)}
                className="h-4 w-4 accent-emerald-500 rounded"
              />
            </label>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Runtime Health</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-emerald-900/50 bg-emerald-950/40 p-3 text-sm">
                <span className="text-emerald-300">Primary provider status</span>
                <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Healthy
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3 text-sm text-zinc-200">
                <span>Fallback routing</span>
                <span className="font-bold text-white">{fallbackEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3 text-sm text-zinc-200">
                <span>Latency target</span>
                <span className="font-bold text-white">~1.8s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-purple-950"
          >
            <Save className="w-4 h-4" />
            Save LLM Settings
          </button>
        </div>
      </form>
    </div>
  );
};
