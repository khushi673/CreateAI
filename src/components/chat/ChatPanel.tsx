'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bot, Check, ChevronDown, MessageSquare, Trash2, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ChatAction, ChatModel } from '@/types';

const SUGGESTIONS = [
  'Generate an image of a golden retriever on a beach at sunset',
  'Make a short video of a city at night in the rain',
  'How many credits do I have?',
];

/** Model picker that lives inside the message box and opens upward. */
const ModelPicker: React.FC<{ models: ChatModel[]; value: ChatModel; onChange: (m: ChatModel) => void }> = ({ models, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        {value.name}
        <span className="text-zinc-500 font-normal">· {value.creditCost} credits</span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" className="absolute bottom-full left-0 mb-2 w-64 rounded-xl bg-zinc-950 border border-zinc-700 shadow-2xl p-1 z-10 animate-fade-in-up">
          {models.map((m) => (
            <li key={m.id} role="option" aria-selected={m.id === value.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(m);
                  setOpen(false);
                }}
                className={`w-full flex items-start justify-between gap-2 p-2 rounded-lg text-left ${m.id === value.id ? 'bg-purple-600/20' : 'hover:bg-zinc-900'}`}
              >
                <span>
                  <span className="block text-xs font-bold text-white">{m.name}</span>
                  <span className="block text-[11px] text-zinc-400">{m.description}</span>
                  <span className="block text-[11px] text-amber-300 mt-0.5">{m.creditCost} credits per message</span>
                </span>
                {m.id === value.id && <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ChatPanel: React.FC = () => {
  const {
    chatOpen,
    setChatOpen,
    chatModels,
    chatMessages,
    chatTyping,
    sendChatMessage,
    clearChat,
    user,
    quickGenerate,
    setCurrentScreen,
    setMediaType,
    setImageToVideo,
    setPrompt,
  } = useApp();
  const available = chatModels.filter((m) => m.status !== 'Disabled');
  const [modelId, setModelId] = useState(available[0]?.id ?? '');
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const model = available.find((m) => m.id === modelId) ?? available[0];
  const insufficient = model ? user.credits < model.creditCost : false;

  useEffect(() => {
    if (chatOpen) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatMessages.length, chatTyping, chatOpen]);

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setChatOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatOpen, setChatOpen]);

  const send = (value = text) => {
    if (!model || !value.trim()) return;
    sendChatMessage(value, model.id);
    setText('');
  };

  const runAction = (a: ChatAction) => {
    setChatOpen(false);
    if (a.kind === 'open') setCurrentScreen(a.screen);
    else if (a.kind === 'generate') quickGenerate(a.mediaType, a.prompt);
    else {
      setImageToVideo(false);
      setMediaType(a.mediaType);
      setPrompt(a.prompt);
      setCurrentScreen('create');
    }
  };

  return (
    <>
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-xl shadow-purple-950/60 hover:scale-105 transition-transform flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {chatOpen && (
        <aside
          role="dialog"
          aria-label="Chat"
          className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[400px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col animate-fade-in-up"
        >
          <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-extrabold text-white">Chat</h2>
              <p className="text-[11px] text-zinc-500">Ask anything or tell the assistant what to make.</p>
            </div>
            <div className="flex items-center gap-1">
              {chatMessages.length > 0 && (
                <button onClick={clearChat} title="Clear chat" aria-label="Clear chat" className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setChatOpen(false)} aria-label="Close chat" className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
            {chatMessages.length === 0 && (
              <div className="my-auto space-y-3">
                <div className="text-center space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center mx-auto">
                    <Bot className="w-5 h-5 text-purple-300" />
                  </div>
                  <h3 className="text-sm font-bold text-white">What would you like to do?</h3>
                </div>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={!model || insufficient}
                    className="w-full p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-purple-500/50 text-xs text-zinc-200 text-left transition-colors disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {chatMessages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="self-end max-w-[85%]">
                  <div className="px-3.5 py-2 rounded-2xl rounded-br-md bg-purple-600 text-white text-sm leading-relaxed">{m.text}</div>
                  <p className="text-[10px] text-zinc-500 text-right mt-1">
                    {m.modelName} · −{m.cost} credits
                  </p>
                </div>
              ) : (
                <div key={m.id} className="self-start max-w-[92%]">
                  <div className="px-3.5 py-2 rounded-2xl rounded-tl-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 leading-relaxed">{m.text}</div>
                  {m.actions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.actions.map((a) => (
                        <button
                          key={a.label}
                          onClick={() => runAction(a)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            a.kind === 'generate' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200'
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}

            {chatTyping && (
              <div className="self-start px-4 py-3 rounded-2xl rounded-tl-md bg-zinc-900 border border-zinc-800 flex gap-1" aria-label="Assistant is typing">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Message box with the model picker inside */}
          <div className="p-3 border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-purple-500"
            >
              <textarea
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Message the assistant…"
                className="w-full bg-transparent resize-none px-3 pt-3 text-sm text-white placeholder-zinc-500 focus:outline-none max-h-32"
              />
              <div className="flex items-center justify-between px-2 pb-2">
                {model ? <ModelPicker models={available} value={model} onChange={(m) => setModelId(m.id)} /> : <span className="text-[11px] text-rose-300 px-2">No model available</span>}
                <button
                  type="submit"
                  disabled={!model || !text.trim() || chatTyping || insufficient}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white flex items-center justify-center"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </form>
            <p className={`text-[11px] mt-1.5 px-1 ${insufficient ? 'text-rose-300' : 'text-zinc-500'}`}>
              {model ? (insufficient ? `Not enough credits for ${model.name}. Add credits in Credits & plans.` : `Uses ${model.creditCost} credits per message · Balance ${user.credits.toLocaleString()} · Replies are simulated.`) : ''}
            </p>
          </div>
        </aside>
      )}
    </>
  );
};
