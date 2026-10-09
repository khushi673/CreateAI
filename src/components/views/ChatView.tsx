'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bot, Check, ChevronDown, Copy, History, MessageSquare, Pencil, Plus, Trash2, Wand2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ChatModel, MediaType } from '@/types';
import { copyText } from '@/lib/clipboard';

const TYPES: { id: MediaType; label: string }[] = [
  { id: 'image', label: 'Image' },
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
];

const EXAMPLES = [
  'A golden retriever running on a beach at sunset',
  'A woman walking through a neon city at night',
  'Calm lo-fi music for studying',
  'A luxury watch on a marble table',
];

/** Chat model picker that sits inside the message box and opens upward. */
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
      >
        {value.name}
        <span className="text-zinc-500 font-normal">· {value.creditCost} credits</span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" className="absolute bottom-full left-0 mb-2 w-72 rounded-xl bg-zinc-950 border border-zinc-700 shadow-2xl p-1 z-20 animate-fade-in-up">
          {models.map((m) => (
            <li key={m.id} role="option" aria-selected={m.id === value.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(m);
                  setOpen(false);
                }}
                className={`w-full flex items-start justify-between gap-2 p-2.5 rounded-lg text-left ${m.id === value.id ? 'bg-purple-600/20' : 'hover:bg-zinc-900'}`}
              >
                <span>
                  <span className="block text-xs font-bold text-white">{m.name}</span>
                  <span className="block text-[11px] text-zinc-400">{m.description}</span>
                  <span className="block text-[11px] text-amber-300 mt-0.5">Uses {m.creditCost} credits per message</span>
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

export const ChatView: React.FC = () => {
  const {
    chatModels,
    models,
    chatConversations,
    activeChatId,
    chatMessages,
    chatTyping,
    newChat,
    selectChat,
    deleteChat,
    renameChat,
    sendChatMessage,
    sendPromptToCreate,
    user,
    addToast,
  } = useApp();

  const availableChat = chatModels.filter((m) => m.status !== 'Disabled');
  const [chatModelId, setChatModelId] = useState(availableChat[0]?.id ?? '');
  const [type, setType] = useState<MediaType>('image');
  const targetModels = models.filter((m) => m.mediaTypes.includes(type) && m.status !== 'Disabled');
  const [targetId, setTargetId] = useState(targetModels[0]?.id ?? '');
  const [text, setText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const chatModel = availableChat.find((m) => m.id === chatModelId) ?? availableChat[0];
  const targetModel = targetModels.find((m) => m.id === targetId) ?? targetModels[0];
  const insufficient = chatModel ? user.credits < chatModel.creditCost : false;
  const sorted = [...chatConversations].sort((a, b) => b.updatedAt - a.updatedAt);
  const active = chatConversations.find((c) => c.id === activeChatId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatMessages.length, chatTyping, activeChatId]);

  const send = (value = text) => {
    if (!chatModel || !targetModel || !value.trim()) return;
    sendChatMessage(value, chatModel.id, { mediaType: type, modelId: targetModel.id });
    setText('');
  };

  const startRename = (id: string, title: string) => {
    setRenamingId(id);
    setRenameValue(title);
  };

  const history = (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <button
          onClick={() => {
            newChat();
            setShowHistory(false);
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-900 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> New chat
        </button>
      </div>
      <p className="px-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">History</p>
      <ul className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {sorted.length === 0 && <li className="px-3 py-4 text-xs text-zinc-500">No chats yet. Your conversations will appear here.</li>}
        {sorted.map((c) => (
          <li key={c.id} className="group relative">
            {renamingId === c.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => {
                  renameChat(c.id, renameValue);
                  setRenamingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                className="w-full bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            ) : (
              <>
                <button
                  onClick={() => {
                    selectChat(c.id);
                    setShowHistory(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate pr-14 transition-colors ${c.id === activeChatId ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-900'}`}
                >
                  {c.title}
                </button>
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5">
                  <button onClick={() => startRename(c.id, c.title)} aria-label="Rename chat" className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-700">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button onClick={() => deleteChat(c.id)} aria-label="Delete chat" className="p-1 rounded text-zinc-400 hover:text-rose-300 hover:bg-zinc-700">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-130px)] min-h-[520px] rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden relative">
      {/* History (desktop) */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-zinc-800 bg-zinc-950/80">{history}</aside>

      {/* History (mobile) */}
      {showHistory && (
        <div className="md:hidden absolute inset-0 z-30 flex">
          <div className="w-72 max-w-[85%] bg-zinc-950 border-r border-zinc-800">{history}</div>
          <button aria-label="Close history" onClick={() => setShowHistory(false)} className="flex-1 bg-black/60" />
        </div>
      )}

      {/* Conversation */}
      <section className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
          <button onClick={() => setShowHistory(true)} aria-label="Open history" className="md:hidden p-2 rounded-lg text-zinc-300 hover:bg-zinc-900">
            <History className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white truncate">{active?.title ?? 'New chat'}</h1>
            <p className="text-[11px] text-zinc-500">Describe what you want. The assistant writes the prompt for you.</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
            {chatMessages.length === 0 && (
              <div className="py-10 text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">What do you want to create?</h2>
                  <p className="text-xs text-zinc-400 mt-1">Pick what the prompt is for below, then describe your idea.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {EXAMPLES.map((e) => (
                    <button
                      key={e}
                      onClick={() => send(e)}
                      disabled={!chatModel || insufficient}
                      className="p-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-xs text-zinc-200 transition-colors disabled:opacity-50"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="self-end max-w-[85%]">
                  <div className="px-4 py-2.5 rounded-3xl bg-zinc-800 text-sm text-white leading-relaxed">{m.text}</div>
                  <p className="text-[10px] text-zinc-500 text-right mt-1 pr-2">
                    {m.modelName} · −{m.cost} credits
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-purple-300" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="text-sm text-zinc-100 leading-relaxed">{m.text}</p>
                    {m.prompt && (
                      <div className="rounded-2xl border border-zinc-700 bg-zinc-900/70 overflow-hidden">
                        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                          <span className="font-semibold uppercase tracking-wide">
                            {m.prompt.mediaType} prompt · {m.prompt.targetModelName}
                          </span>
                          <button
                            onClick={async () => addToast((await copyText(m.prompt!.text)) ? 'Prompt copied' : 'Copy not available', undefined, 'info')}
                            className="flex items-center gap-1 text-zinc-300 hover:text-white"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                          <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{m.prompt.text}</p>
                          {m.prompt.negative && (
                            <p className="text-xs text-zinc-400">
                              <span className="font-semibold text-zinc-300">Negative prompt: </span>
                              {m.prompt.negative}
                            </p>
                          )}
                        </div>
                        <div className="px-4 py-2.5 border-t border-zinc-800">
                          <button
                            onClick={() => sendPromptToCreate(m.prompt!)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors"
                          >
                            <Wand2 className="w-3.5 h-3.5" /> Use this prompt
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {chatTyping && (
              <div className="flex gap-3" aria-label="Assistant is typing">
                <span className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-purple-300" />
                </span>
                <div className="flex items-center gap-1 h-7">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Message box */}
        <div className="px-4 pb-4 pt-2">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="rounded-3xl bg-zinc-900 border border-zinc-700 focus-within:border-purple-500 transition-colors"
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
                placeholder={`Describe the ${type} you want to create…`}
                className="w-full bg-transparent resize-none px-5 pt-4 text-sm text-white placeholder-zinc-500 focus:outline-none max-h-40"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-3">
                <div className="flex flex-wrap items-center gap-1">
                  {chatModel ? (
                    <ModelPicker models={availableChat} value={chatModel} onChange={(m) => setChatModelId(m.id)} />
                  ) : (
                    <span className="text-xs text-rose-300 px-2">No chat model available</span>
                  )}
                  <span className="hidden sm:block w-px h-4 bg-zinc-700 mx-1" />
                  <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-zinc-950/60" role="group" aria-label="Prompt for">
                    {TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setType(t.id);
                          setTargetId(models.find((m) => m.mediaTypes.includes(t.id) && m.status !== 'Disabled')?.id ?? '');
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${type === t.id ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <select
                    value={targetModel?.id ?? ''}
                    onChange={(e) => setTargetId(e.target.value)}
                    aria-label="Write the prompt for this model"
                    className="bg-transparent text-[11px] font-semibold text-zinc-300 focus:outline-none rounded-lg px-1.5 py-1.5 hover:bg-zinc-800 cursor-pointer"
                  >
                    {targetModels.map((m) => (
                      <option key={m.id} value={m.id} className="bg-zinc-900">
                        For {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!chatModel || !targetModel || !text.trim() || chatTyping || insufficient}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white flex items-center justify-center"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </form>
            <p className={`text-[11px] mt-2 text-center ${insufficient ? 'text-rose-300' : 'text-zinc-500'}`}>
              {chatModel
                ? insufficient
                  ? `Not enough credits for ${chatModel.name}. Add credits in Credits & plans.`
                  : `This message uses ${chatModel.creditCost} credits · Balance ${user.credits.toLocaleString()} · Replies are simulated in this demo.`
                : ''}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
