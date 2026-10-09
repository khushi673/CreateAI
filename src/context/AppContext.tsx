'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ViewScreen,
  MediaType,
  AIModel,
  GenerationItem,
  Project,
  ProjectFolder,
  UserProfile,
  ToastMessage,
  AdminUserItem,
  CreditPackage,
  SubscriptionPlan,
  AuthRole,
  PlanName,
  ReferenceItem,
  CreditTransaction,
  NewsItem,
  ApiKeyItem,
  JobStage,
  DemoOutcome,
  GenerateParams,
  GenerateTarget,
  ModelApiKey,
  ChatModel,
  ChatMessage,
  ChatConversation,
  ChatPrompt,
  ChatTarget,
} from '@/types';
import {
  AI_MODELS,
  INITIAL_GENERATIONS,
  INITIAL_PROJECTS,
  INITIAL_USER,
  INITIAL_ADMIN_USERS,
  INITIAL_CREDIT_PACKAGES,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_REFERENCES,
  INITIAL_TRANSACTIONS,
  INITIAL_NEWS,
  SAMPLE_VIDEOS,
  SAMPLE_IMAGES,
  SAMPLE_AUDIO,
  AUDIO_COVER,
  getModel,
  INITIAL_MODEL_KEYS,
  CHAT_MODELS,
  INITIAL_CHATS,
} from '@/data/mockData';
import { promptReply } from '@/lib/chatAssistant';
import { estimateCost } from '@/lib/pricing';

interface AppContextType {
  // Auth
  authRole: AuthRole;
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  logout: () => void;

  currentScreen: ViewScreen;
  setCurrentScreen: (screen: ViewScreen) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  generations: GenerationItem[];
  projects: Project[];

  // Models
  models: AIModel[];
  selectedModel: AIModel;
  /** Switches model and resets any setting the new model does not support */
  setSelectedModel: (model: AIModel) => void;
  updateModelCreditCost: (modelId: string, newCost: number) => void;
  toggleModelStatus: (modelId: string) => void;
  updateModel: (modelId: string, patch: Partial<AIModel>) => void;

  // Chat (prompt assistant)
  chatModels: ChatModel[];
  updateChatModel: (modelId: string, patch: Partial<ChatModel>) => void;
  toggleChatModelStatus: (modelId: string) => void;
  chatConversations: ChatConversation[];
  activeChatId: string | null;
  /** Messages of the open conversation (empty for a new chat) */
  chatMessages: ChatMessage[];
  chatTyping: boolean;
  newChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  /** Charges the chat model's per-message cost, then adds the simulated prompt reply */
  sendChatMessage: (text: string, modelId: string, target: ChatTarget) => void;
  /** Puts an assistant-written prompt into Create */
  sendPromptToCreate: (prompt: ChatPrompt) => void;

  // Studio form
  mediaType: MediaType;
  /** Switches Image/Video/Audio and picks a compatible active model */
  setMediaType: (type: MediaType) => void;
  imageToVideo: boolean;
  setImageToVideo: (on: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  negativePrompt: string;
  setNegativePrompt: (neg: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  duration: string;
  setDuration: (dur: string) => void;
  resolution: string;
  setResolution: (res: string) => void;
  seed: string;
  setSeed: (seed: string) => void;
  audioStyle: string;
  setAudioStyle: (s: string) => void;
  extraSettings: Record<string, string>;
  setExtraSetting: (key: string, value: string) => void;
  startFrame: string | null;
  setStartFrame: (url: string | null) => void;
  endFrame: string | null;
  setEndFrame: (url: string | null) => void;
  /** Live credit estimate for the current model + duration + resolution */
  estimatedCost: number;

  // References
  references: ReferenceItem[];
  selectedReferenceIds: string[];
  toggleReference: (id: string) => void;
  clearSelectedReferences: () => void;
  /** Simulates an upload using a sample asset and selects it */
  simulateUpload: (type: MediaType) => ReferenceItem;
  addReference: (ref: Omit<ReferenceItem, 'id'>, select?: boolean) => ReferenceItem;
  removeReference: (id: string) => void;

  // Generation process (simulated)
  jobStage: JobStage;
  generationProgress: number;
  jobCost: number;
  /** Demo switch: which outcome the next Generate click simulates */
  demoOutcome: DemoOutcome;
  setDemoOutcome: (o: DemoOutcome) => void;
  currentGenerationResult: GenerationItem | null;
  startGeneration: (override?: Partial<GenerateParams>) => void;
  resetJob: () => void;

  // Result / library actions
  activeResult: GenerationItem | null;
  openResult: (item: GenerationItem) => void;
  deleteGeneration: (id: string) => void;
  downloadGeneration: (item: GenerationItem) => void;
  rerunGeneration: (item: GenerationItem) => void;
  addAsReference: (asset: GenerationItem) => void;

  // Projects & folders
  selectedProjectDetail: Project | null;
  setSelectedProjectDetail: (proj: Project | null) => void;
  generateTarget: GenerateTarget | null;
  setGenerateTarget: (t: GenerateTarget | null) => void;
  createProject: (name: string, description: string, tags: string[]) => Project;
  deleteProject: (projectId: string) => void;
  renameProject: (projectId: string, name: string) => void;
  createFolder: (projectId: string, name: string, parentId?: string | null) => ProjectFolder;
  renameFolder: (projectId: string, folderId: string, name: string) => void;
  deleteFolder: (projectId: string, folderId: string) => void;
  moveItemToFolder: (projectId: string, itemId: string, folderId: string | null) => void;
  saveToProject: (assetId: string, projectId: string, folderId?: string | null) => void;
  removeFromProject: (projectId: string, itemId: string) => void;

  // Billing & credits
  transactions: CreditTransaction[];
  buyCredits: (amount: number, label?: string) => void;
  upgradePlan: (planName: Exclude<PlanName, 'Free'>) => void;

  // News / announcements
  newsItems: NewsItem[];
  publishAnnouncement: (title: string, body: string, recipientCount: number, byEmail?: boolean) => void;

  // Developer API keys (mock)
  apiKeys: ApiKeyItem[];
  createApiKey: (name?: string) => ApiKeyItem;
  revokeApiKey: (id: string) => void;

  // Modals
  buyCreditsModalOpen: boolean;
  setBuyCreditsModalOpen: (open: boolean) => void;
  saveToProjectModalOpen: boolean;
  setSaveToProjectModalOpen: (open: boolean) => void;
  targetAssetForProject: GenerationItem | null;
  setTargetAssetForProject: (item: GenerationItem | null) => void;
  newProjectModalOpen: boolean;
  setNewProjectModalOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Admin
  modelApiKeys: Record<string, ModelApiKey>;
  updateModelApiKey: (modelId: string, apiKey: string) => void;
  adminUsers: AdminUserItem[];
  toggleUserStatus: (userId: string) => void;
  adjustUserCredits: (userId: string, deltaAmount: number, reason?: string) => void;
  updateUserPlan: (userId: string, newPlanName: string) => void;

  creditPackages: CreditPackage[];
  addCreditPackage: (pkg: Omit<CreditPackage, 'id'>) => void;
  updateCreditPackage: (pkgId: string, updated: Partial<CreditPackage>) => void;
  deleteCreditPackage: (pkgId: string) => void;

  subscriptionPlans: SubscriptionPlan[];
  addSubscriptionPlan: (plan: Omit<SubscriptionPlan, 'id'>) => void;
  updateSubscriptionPlan: (planId: string, updated: Partial<SubscriptionPlan>) => void;
  deleteSubscriptionPlan: (planId: string) => void;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BLOCKED_WORDS = /\b(nsfw|nude|gore|bloody|massacre|terror)\w*/i;
const UPLOAD_IMAGES = SAMPLE_IMAGES;
const nowLabel = () => {
  const d = new Date();
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} · ${time}`;
};

const defaultsFor = (model: AIModel) => {
  const c = model.capabilities;
  const extras: Record<string, string> = {};
  c.extras?.forEach((e) => (extras[e.key] = e.default));
  return {
    duration: c.durations?.[0] ?? '',
    resolution: c.resolutions?.[Math.min(1, (c.resolutions?.length ?? 1) - 1)] ?? '',
    aspectRatio: c.aspectRatios?.[0] ?? 'N/A',
    audioStyle: c.audioStyles?.[0] ?? '',
    extras,
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth & navigation (starts signed out so the Sign In gateway is always the entry point)
  const [authRole, setAuthRole] = useState<AuthRole>(null);
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [generations, setGenerations] = useState<GenerationItem[]>(INITIAL_GENERATIONS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(INITIAL_PROJECTS[0].id);
  const [generateTarget, setGenerateTarget] = useState<GenerateTarget | null>(null);

  // Chat
  const [chatModels, setChatModels] = useState<ChatModel[]>(CHAT_MODELS);
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatTyping, setChatTyping] = useState(false);
  const chatMessages = chatConversations.find((c) => c.id === activeChatId)?.messages ?? [];

  // Models
  const [models, setModels] = useState<AIModel[]>(AI_MODELS);
  const [selectedModel, setSelectedModelState] = useState<AIModel>(AI_MODELS[0]);

  // Studio form
  const initial = defaultsFor(AI_MODELS[0]);
  const [mediaType, setMediaTypeState] = useState<MediaType>('video');
  const [imageToVideo, setImageToVideoState] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('Create a cinematic shot of @Mara walking through a futuristic city at night, neon reflections on wet streets, slow dolly follow');
  const [negativePrompt, setNegativePrompt] = useState<string>('blurry, low quality, distorted anatomy');
  const [aspectRatio, setAspectRatio] = useState<string>(initial.aspectRatio);
  const [duration, setDuration] = useState<string>('10s');
  const [resolution, setResolution] = useState<string>('1080p');
  const [seed, setSeed] = useState<string>('8492019');
  const [audioStyle, setAudioStyle] = useState<string>(initial.audioStyle);
  const [extraSettings, setExtraSettings] = useState<Record<string, string>>(initial.extras);
  const [startFrame, setStartFrame] = useState<string | null>(null);
  const [endFrame, setEndFrame] = useState<string | null>(null);

  // References
  const [references, setReferences] = useState<ReferenceItem[]>(INITIAL_REFERENCES);
  const [selectedReferenceIds, setSelectedReferenceIds] = useState<string[]>(['ref_mara_face']);

  // Generation process
  const [jobStage, setJobStage] = useState<JobStage>('idle');
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [jobCost, setJobCost] = useState<number>(0);
  const [demoOutcome, setDemoOutcome] = useState<DemoOutcome>('success');
  const [currentGenerationResult, setCurrentGenerationResult] = useState<GenerationItem | null>(null);
  const [activeResult, setActiveResult] = useState<GenerationItem | null>(INITIAL_GENERATIONS[0]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const sampleCounter = useRef(0);
  const uploadCounter = useRef(0);

  // Billing, news, keys
  const [transactions, setTransactions] = useState<CreditTransaction[]>(INITIAL_TRANSACTIONS);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(INITIAL_NEWS);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);

  // Modals
  const [buyCreditsModalOpen, setBuyCreditsModalOpen] = useState<boolean>(false);
  const [saveToProjectModalOpen, setSaveToProjectModalOpen] = useState<boolean>(false);
  const [targetAssetForProject, setTargetAssetForProject] = useState<GenerationItem | null>(null);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Admin
  const [modelApiKeys, setModelApiKeys] = useState<Record<string, ModelApiKey>>(INITIAL_MODEL_KEYS);
  const updateModelApiKey = (modelId: string, apiKey: string) =>
    setModelApiKeys((prev) => ({ ...prev, [modelId]: { apiKey, updatedAt: 'Just now' } }));
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>(INITIAL_ADMIN_USERS);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>(INITIAL_CREDIT_PACKAGES);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);

  const selectedProjectDetail = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );
  const setSelectedProjectDetail = (proj: Project | null) => setSelectedProjectId(proj ? proj.id : null);

  // ---------- Toasts ----------
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      const id = 'toast_' + Date.now() + Math.random().toString(36).slice(2, 6);
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  // ---------- Auth ----------
  const loginAsUser = () => {
    setAuthRole('user');
    setCurrentScreen('dashboard');
    setUser(INITIAL_USER);
    addToast('Signed in', 'Signed in as Alex Rivera.', 'success');
  };

  const loginAsAdmin = () => {
    setAuthRole('admin');
    setCurrentScreen('admin');
    addToast('Signed in', 'Signed in as administrator.', 'info');
  };

  const logout = () => {
    clearTimers();
    setJobStage('idle');
    setAuthRole(null);
    addToast('Signed out', undefined, 'info');
  };

  // ---------- Models & studio form ----------
  const applyModelDefaults = (model: AIModel, keep?: { duration?: string; resolution?: string; aspectRatio?: string }) => {
    const c = model.capabilities;
    const d = defaultsFor(model);
    setDuration(keep?.duration && c.durations?.includes(keep.duration) ? keep.duration : d.duration);
    setResolution(keep?.resolution && c.resolutions?.includes(keep.resolution) ? keep.resolution : d.resolution);
    setAspectRatio(keep?.aspectRatio && c.aspectRatios?.includes(keep.aspectRatio) ? keep.aspectRatio : d.aspectRatio);
    setAudioStyle(d.audioStyle);
    setExtraSettings(d.extras);
    if (!c.startFrame) setStartFrame(null);
    if (!c.endFrame) setEndFrame(null);
    // trim selected references to what the model accepts
    const max = c.maxReferenceImages;
    setSelectedReferenceIds((prev) => {
      const imgs = prev.filter((id) => references.find((r) => r.id === id)?.type === 'image');
      const others = prev.filter((id) => references.find((r) => r.id === id)?.type !== 'image');
      return [...imgs.slice(0, max), ...others];
    });
  };

  const setSelectedModel = (model: AIModel) => {
    setSelectedModelState(model);
    applyModelDefaults(model, { duration, resolution, aspectRatio });
  };

  const setMediaType = (type: MediaType) => {
    setMediaTypeState(type);
    if (type !== 'video') setImageToVideoState(false);
    if (!selectedModel.mediaTypes.includes(type) || selectedModel.status === 'Disabled') {
      const next = models.find((m) => m.mediaTypes.includes(type) && m.status === 'Active');
      if (next) {
        setSelectedModelState(next);
        applyModelDefaults(next);
      }
    }
  };

  const setImageToVideo = (on: boolean) => {
    setImageToVideoState(on);
    if (on) {
      setMediaTypeState('video');
      if (!selectedModel.mediaTypes.includes('video') || !selectedModel.capabilities.startFrame || selectedModel.status === 'Disabled') {
        const next = models.find((m) => m.mediaTypes.includes('video') && m.capabilities.startFrame && m.status === 'Active');
        if (next) {
          setSelectedModelState(next);
          applyModelDefaults(next);
        }
      }
    }
  };

  const setExtraSetting = (key: string, value: string) => setExtraSettings((prev) => ({ ...prev, [key]: value }));

  const estimatedCost = useMemo(
    () =>
      estimateCost(
        selectedModel,
        selectedModel.capabilities.durations ? duration : undefined,
        selectedModel.capabilities.resolutions ? resolution : undefined
      ),
    [selectedModel, duration, resolution]
  );

  const updateModelCreditCost = (modelId: string, newCost: number) => {
    setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, creditCost: newCost } : m)));
    setSelectedModelState((prev) => (prev.id === modelId ? { ...prev, creditCost: newCost } : prev));
    addToast('Model cost updated', `Base cost is now ${newCost} credits.`, 'success');
  };

  const updateModel = (modelId: string, patch: Partial<AIModel>) => {
    setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, ...patch } : m)));
    setSelectedModelState((prev) => (prev.id === modelId ? { ...prev, ...patch } : prev));
  };

  const toggleModelStatus = (modelId: string) => {
    const m = models.find((x) => x.id === modelId);
    if (!m) return;
    const next = m.status === 'Disabled' ? 'Active' : 'Disabled';
    updateModel(modelId, { status: next });
    addToast(`${m.name} ${next === 'Active' ? 'enabled' : 'disabled'}`, next === 'Active' ? 'Users can select it in Create.' : 'Hidden from Create.', next === 'Active' ? 'success' : 'warning');
  };

  // ---------- Chat ----------
  const updateChatModel = (modelId: string, patch: Partial<ChatModel>) =>
    setChatModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, ...patch } : m)));

  const toggleChatModelStatus = (modelId: string) => {
    const m = chatModels.find((x) => x.id === modelId);
    if (!m) return;
    const next = m.status === 'Disabled' ? 'Active' : 'Disabled';
    updateChatModel(modelId, { status: next });
    addToast(`${m.name} ${next === 'Active' ? 'enabled' : 'disabled'}`, next === 'Active' ? 'Users can select it in Chat.' : 'Hidden from Chat.', next === 'Active' ? 'success' : 'warning');
  };

  const newChat = () => setActiveChatId(null);
  const selectChat = (id: string) => setActiveChatId(id);
  const deleteChat = (id: string) => {
    setChatConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveChatId((cur) => (cur === id ? null : cur));
  };
  const renameChat = (id: string, title: string) =>
    setChatConversations((prev) => prev.map((c) => (c.id === id && title.trim() ? { ...c, title: title.trim() } : c)));

  const sendChatMessage = (text: string, modelId: string, target: ChatTarget) => {
    const model = chatModels.find((m) => m.id === modelId);
    const msg = text.trim();
    if (!model || !msg || chatTyping) return;
    if (model.status === 'Disabled') {
      addToast('Model unavailable', `${model.name} is disabled by an administrator.`, 'warning');
      return;
    }
    if (user.credits < model.creditCost) {
      addToast('Not enough credits', `${model.name} costs ${model.creditCost} credits per message. Add credits in Credits & plans.`, 'warning');
      return;
    }
    const targetModel = models.find((m) => m.id === target.modelId) ?? models.find((m) => m.mediaTypes.includes(target.mediaType));
    if (!targetModel) {
      addToast('No model available', `No ${target.mediaType} model is enabled right now.`, 'warning');
      return;
    }
    setUser((prev) => ({ ...prev, credits: prev.credits - model.creditCost }));
    setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, credits: Math.max(0, u.credits - model.creditCost) } : u)));
    logTransaction({ kind: 'charge', title: `Chat — ${model.name}`, detail: '1 message', amount: -model.creditCost });

    const convId = activeChatId ?? 'chat_' + Date.now();
    const userMsg: ChatMessage = { id: 'msg_' + Date.now(), role: 'user', text: msg, cost: model.creditCost, modelName: model.name };
    const existing = chatConversations.find((c) => c.id === convId);
    const lastPrompt = [...(existing?.messages ?? [])].reverse().find((m) => m.prompt)?.prompt;
    if (existing) {
      setChatConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() } : c)));
    } else {
      setChatConversations((prev) => [{ id: convId, title: msg.length > 40 ? msg.slice(0, 40) + '…' : msg, messages: [userMsg], updatedAt: Date.now() }, ...prev]);
      setActiveChatId(convId);
    }
    setChatTyping(true);

    const reply = promptReply({ idea: msg, mediaType: target.mediaType, model: targetModel, previous: lastPrompt });
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: 'msg_' + Date.now() + 'a',
        role: 'assistant',
        text: reply.text,
        modelName: model.name,
        prompt: reply.prompt
          ? { text: reply.prompt.text, negative: reply.prompt.negative, mediaType: target.mediaType, targetModelId: targetModel.id, targetModelName: targetModel.name }
          : undefined,
      };
      setChatConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() } : c)));
      setChatTyping(false);
    }, 1000);
  };

  const sendPromptToCreate = (p: ChatPrompt) => {
    const model = models.find((m) => m.id === p.targetModelId && m.status !== 'Disabled') ?? models.find((m) => m.mediaTypes.includes(p.mediaType) && m.status === 'Active');
    setMediaTypeState(p.mediaType);
    setImageToVideoState(false);
    if (model) {
      setSelectedModelState(model);
      applyModelDefaults(model);
    }
    setPrompt(p.text);
    setNegativePrompt(p.negative ?? '');
    setCurrentScreen('create');
    addToast('Prompt added to Create', model ? `Ready for ${model.name}.` : undefined, 'success');
  };

  // ---------- References ----------
  const toggleReference = (id: string) => {
    const ref = references.find((r) => r.id === id);
    if (!ref) return;
    setSelectedReferenceIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (ref.type === 'image') {
        const count = prev.filter((x) => references.find((r) => r.id === x)?.type === 'image').length;
        if (count >= selectedModel.capabilities.maxReferenceImages && selectedModel.capabilities.maxReferenceImages > 0) {
          addToast('Reference limit reached', `${selectedModel.name} accepts up to ${selectedModel.capabilities.maxReferenceImages} reference images.`, 'warning');
          return prev;
        }
      }
      return [...prev, id];
    });
  };

  const clearSelectedReferences = () => setSelectedReferenceIds([]);

  const addReference = (ref: Omit<ReferenceItem, 'id'>, select = true): ReferenceItem => {
    const item: ReferenceItem = { ...ref, id: 'ref_' + Date.now() + Math.random().toString(36).slice(2, 5) };
    setReferences((prev) => [item, ...prev]);
    if (select) setSelectedReferenceIds((prev) => [...prev, item.id]);
    return item;
  };

  const simulateUpload = (type: MediaType): ReferenceItem => {
    uploadCounter.current += 1;
    const n = uploadCounter.current;
    let item: Omit<ReferenceItem, 'id'>;
    if (type === 'image') {
      const url = UPLOAD_IMAGES[n % UPLOAD_IMAGES.length];
      item = { name: `Upload${n}`, type, url, thumbnailUrl: url, source: 'uploaded', tag: 'upload' };
    } else if (type === 'video') {
      const v = SAMPLE_VIDEOS[n % SAMPLE_VIDEOS.length];
      item = { name: `Clip${n}`, type, url: v.mediaUrl, thumbnailUrl: v.thumbnailUrl, source: 'uploaded', tag: 'upload' };
    } else {
      item = { name: `Track${n}`, type, url: SAMPLE_AUDIO[n % SAMPLE_AUDIO.length], thumbnailUrl: AUDIO_COVER, source: 'uploaded', tag: 'upload' };
    }
    const created = addReference(item, true);
    addToast('Upload complete', `${created.name} was added to References.`, 'success');
    return created;
  };

  const removeReference = (id: string) => {
    setReferences((prev) => prev.filter((r) => r.id !== id));
    setSelectedReferenceIds((prev) => prev.filter((x) => x !== id));
  };

  // ---------- Generation simulation ----------
  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (ticker.current) clearInterval(ticker.current);
    ticker.current = null;
  }

  useEffect(() => () => clearTimers(), []);

  const resetJob = () => {
    clearTimers();
    setJobStage('idle');
    setGenerationProgress(0);
    setCurrentGenerationResult(null);
  };

  const logTransaction = (tx: Omit<CreditTransaction, 'id' | 'date'>) =>
    setTransactions((prev) => [{ ...tx, id: 'tx_' + Date.now() + Math.random().toString(36).slice(2, 4), date: nowLabel() }, ...prev]);

  const startGeneration = (override?: Partial<GenerateParams>) => {
    const p: GenerateParams = {
      mediaType,
      imageToVideo,
      modelId: selectedModel.id,
      prompt,
      negativePrompt,
      aspectRatio,
      duration,
      resolution,
      seed,
      audioStyle,
      extraSettings,
      startFrame,
      endFrame,
      referenceIds: selectedReferenceIds,
      ...override,
    };
    const model = getModel(p.modelId);
    const dur = model.capabilities.durations ? p.duration : undefined;
    const res = model.capabilities.resolutions ? p.resolution : undefined;
    const cost = estimateCost(model, dur, res);

    if (jobStage === 'submitted' || jobStage === 'queued' || jobStage === 'generating') return;
    if (!p.prompt.trim()) {
      addToast('Prompt required', 'Enter a prompt before generating.', 'warning');
      return;
    }
    if (p.imageToVideo && !p.startFrame) {
      addToast('Start frame required', 'Image to Video needs a start frame.', 'warning');
      return;
    }
    if (user.credits < cost) {
      addToast('Not enough credits', `This generation costs ${cost} credits. Add credits in Credits & plans.`, 'warning');
      return;
    }

    clearTimers();
    setCurrentGenerationResult(null);
    setJobCost(cost);
    setGenerationProgress(0);
    setJobStage('submitted');

    const blocked = demoOutcome === 'blocked' || BLOCKED_WORDS.test(p.prompt);
    const willFail = !blocked && demoOutcome === 'fail';
    const usableRefIds = p.referenceIds.filter((id) => {
      const t = references.find((r) => r.id === id)?.type;
      return t === 'image' ? model.capabilities.maxReferenceImages > 0 : t === 'audio' ? Boolean(model.capabilities.referenceAudio) : false;
    });
    const refNames = usableRefIds.map((id) => references.find((r) => r.id === id)?.name).filter(Boolean) as string[];
    const mediaTitle = p.prompt.replace(/@(\w+)/g, '$1').slice(0, 48) + (p.prompt.length > 48 ? '…' : '');

    sampleCounter.current += 1;
    const idx = sampleCounter.current;
    const vid = SAMPLE_VIDEOS[idx % SAMPLE_VIDEOS.length];
    const img = SAMPLE_IMAGES[idx % SAMPLE_IMAGES.length];

    const base: GenerationItem = {
      id: 'gen_' + Date.now(),
      title: mediaTitle,
      prompt: p.prompt,
      negativePrompt: p.negativePrompt,
      mediaType: p.mediaType,
      modelId: model.id,
      modelName: model.name,
      mediaUrl: p.mediaType === 'video' ? vid.mediaUrl : p.mediaType === 'audio' ? SAMPLE_AUDIO[idx % SAMPLE_AUDIO.length] : img,
      thumbnailUrl: p.mediaType === 'video' ? p.startFrame || vid.thumbnailUrl : p.mediaType === 'audio' ? AUDIO_COVER : img,
      createdAt: 'Just now',
      date: nowLabel(),
      aspectRatio: p.mediaType === 'audio' ? 'N/A' : p.aspectRatio,
      duration: model.capabilities.durations ? p.duration : undefined,
      resolution: model.capabilities.resolutions ? p.resolution : undefined,
      creditsUsed: cost,
      likes: 0,
      downloads: 0,
      seed: p.seed || String(Math.floor(Math.random() * 9000000 + 1000000)),
      extraSettings: p.mediaType === 'audio' ? { style: p.audioStyle } : p.extraSettings,
      startFrame: p.startFrame ?? undefined,
      endFrame: p.endFrame ?? undefined,
      referenceNames: refNames,
      referenceImage: p.startFrame ?? undefined,
      status: 'Completed',
      safetyCheck: 'Passed',
      projectId: generateTarget?.projectId,
      folderId: generateTarget?.folderId ?? undefined,
    };

    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

    if (blocked) {
      at(1400, () => {
        const item: GenerationItem = { ...base, status: 'Blocked', safetyCheck: 'Blocked', creditsUsed: 0, projectId: undefined, folderId: undefined };
        setGenerations((prev) => [item, ...prev]);
        setCurrentGenerationResult(item);
        setJobStage('blocked');
        addToast('Generation blocked', 'This request violates the platform\'s content policy. No credits were charged.', 'error');
      });
      return;
    }

    // Charge on submit
    setUser((prev) => ({ ...prev, credits: Math.max(0, prev.credits - cost) }));
    setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, credits: Math.max(0, u.credits - cost), totalGenerations: u.totalGenerations + 1 } : u)));
    const kindLabel = p.mediaType === 'video' ? 'Video' : p.mediaType === 'image' ? 'Image' : 'Audio';
    logTransaction({ kind: 'charge', title: `${kindLabel} Generation — ${model.name}`, detail: [dur, res].filter(Boolean).join(' · ') || 'Standard', amount: -cost });

    at(900, () => setJobStage('queued'));
    at(2000, () => {
      setJobStage('generating');
      setGenerationProgress(8);
      ticker.current = setInterval(() => setGenerationProgress((v) => Math.min(94, v + 6)), 350);
    });

    at(5200, () => {
      if (ticker.current) clearInterval(ticker.current);
      ticker.current = null;
      if (willFail) {
        const item: GenerationItem = { ...base, status: 'Failed', projectId: undefined, folderId: undefined };
        setGenerations((prev) => [item, ...prev]);
        setCurrentGenerationResult(item);
        setUser((prev) => ({ ...prev, credits: prev.credits + cost }));
        setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, credits: u.credits + cost } : u)));
        logTransaction({ kind: 'refund', title: 'Failed Generation — Refund', detail: `${model.name} · provider error`, amount: cost });
        setJobStage('failed');
        addToast('Generation failed', `${cost} credits refunded.`, 'error');
        return;
      }
      setGenerationProgress(100);
      setGenerations((prev) => [base, ...prev]);
      if (generateTarget) {
        setProjects((prev) =>
          prev.map((pr) => {
            if (pr.id !== generateTarget.projectId) return pr;
            const items = [base, ...pr.items];
            return { ...pr, items, itemCount: items.length, updatedAt: 'Just now' };
          })
        );
      }
      setCurrentGenerationResult(base);
      setActiveResult(base);
      setJobStage('complete');
      addToast('Generation complete', `Your ${p.mediaType} is ready.`, 'success');
    });
  };

  // ---------- Result / library ----------
  const openResult = (item: GenerationItem) => {
    setActiveResult(item);
    setCurrentScreen('result');
  };

  const deleteGeneration = (id: string) => {
    setGenerations((prev) => prev.filter((g) => g.id !== id));
    setProjects((prev) =>
      prev.map((p) => {
        if (!p.items.some((i) => i.id === id)) return p;
        const items = p.items.filter((i) => i.id !== id);
        return { ...p, items, itemCount: items.length };
      })
    );
    setActiveResult((cur) => (cur?.id === id ? null : cur));
    addToast('Deleted', 'The generation was removed from History.', 'info');
  };

  const downloadGeneration = (item: GenerationItem) => {
    setGenerations((prev) => prev.map((g) => (g.id === item.id ? { ...g, downloads: g.downloads + 1 } : g)));
    addToast('Download started', `Saving "${item.title}".`, 'success');
  };

  const rerunGeneration = (item: GenerationItem) => {
    const model = getModel(item.modelId);
    if (model.status === 'Disabled') {
      addToast('Model unavailable', `${model.name} is disabled by an administrator.`, 'warning');
      return;
    }
    setMediaTypeState(item.mediaType);
    setImageToVideoState(Boolean(item.startFrame));
    setSelectedModelState(model);
    setPrompt(item.prompt);
    setNegativePrompt(item.negativePrompt ?? '');
    if (item.aspectRatio && item.aspectRatio !== 'N/A') setAspectRatio(item.aspectRatio);
    if (item.duration) setDuration(item.duration);
    if (item.resolution) setResolution(item.resolution);
    if (item.seed) setSeed(item.seed);
    setExtraSettings(item.extraSettings ?? defaultsFor(model).extras);
    setStartFrame(item.startFrame ?? null);
    setEndFrame(item.endFrame ?? null);
    setCurrentScreen('create');
    resetJob();
    addToast('Re-running generation', `${model.name} · ${[item.duration, item.resolution].filter(Boolean).join(' · ')}`, 'info');
    // Defer so the Studio mounts before the job state starts
    setTimeout(
      () =>
        startGeneration({
          mediaType: item.mediaType,
          imageToVideo: Boolean(item.startFrame),
          modelId: item.modelId,
          prompt: item.prompt,
          negativePrompt: item.negativePrompt ?? '',
          aspectRatio: item.aspectRatio,
          duration: item.duration ?? '',
          resolution: item.resolution ?? '',
          seed: item.seed ?? '',
          extraSettings: item.extraSettings ?? {},
          audioStyle: item.extraSettings?.style ?? '',
          startFrame: item.startFrame ?? null,
          endFrame: item.endFrame ?? null,
        }),
      50
    );
  };

  const addAsReference = (asset: GenerationItem) => {
    const existing = references.find((r) => r.id === 'ref_' + asset.id);
    const mention = asset.title.replace(/[^A-Za-z0-9 ]/g, '').split(' ').slice(0, 2).join('') || 'Generated';
    if (existing) {
      setSelectedReferenceIds((prev) => (prev.includes(existing.id) ? prev : [...prev, existing.id]));
    } else {
      const item: ReferenceItem = {
        id: 'ref_' + asset.id,
        name: mention,
        type: asset.mediaType,
        url: asset.mediaUrl,
        thumbnailUrl: asset.thumbnailUrl,
        source: 'generated',
        tag: 'generated',
      };
      setReferences((prev) => [item, ...prev]);
      setSelectedReferenceIds((prev) => [...prev, item.id]);
    }
    setCurrentScreen('create');
    addToast('Reference added', `"${asset.title}" is selected in Create.`, 'info');
  };

  // ---------- Projects & folders ----------
  const patchProject = (projectId: string, fn: (p: Project) => Project) =>
    setProjects((prev) => prev.map((p) => (p.id === projectId ? fn(p) : p)));

  const saveToProject = (assetId: string, projectId: string, folderId: string | null = null) => {
    const asset = generations.find((g) => g.id === assetId);
    if (!asset) return;
    const saved: GenerationItem = { ...asset, projectId, folderId: folderId ?? undefined };
    patchProject(projectId, (p) => {
      const items = [saved, ...p.items.filter((i) => i.id !== assetId)];
      return { ...p, items, itemCount: items.length, updatedAt: 'Just now' };
    });
    setGenerations((prev) => prev.map((g) => (g.id === assetId ? saved : g)));
    setActiveResult((cur) => (cur?.id === assetId ? saved : cur));
    const proj = projects.find((p) => p.id === projectId);
    const folder = proj?.folders.find((f) => f.id === folderId);
    addToast('Saved to project', `Saved to "${proj?.name ?? 'Project'}"${folder ? ` › ${folder.name}` : ''}`, 'success');
    setSaveToProjectModalOpen(false);
  };

  const removeFromProject = (projectId: string, itemId: string) => {
    patchProject(projectId, (p) => {
      const items = p.items.filter((i) => i.id !== itemId);
      return { ...p, items, itemCount: items.length };
    });
    addToast('Removed from project', 'The generation is still available in History.', 'info');
  };

  const createProject = (name: string, description: string, tags: string[]): Project => {
    const proj: Project = {
      id: 'proj_' + Date.now(),
      name,
      description,
      coverImage: SAMPLE_IMAGES[1],
      createdAt: 'Just now',
      updatedAt: 'Just now',
      itemCount: 0,
      items: [],
      folders: [],
      tags,
    };
    setProjects((prev) => [proj, ...prev]);
    addToast('Project created', name, 'success');
    return proj;
  };

  const deleteProject = (projectId: string) => {
    const name = projects.find((p) => p.id === projectId)?.name;
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setGenerateTarget((t) => (t?.projectId === projectId ? null : t));
    if (selectedProjectId === projectId) setSelectedProjectId(null);
    addToast('Project deleted', `"${name}" was deleted. Its generations remain in History.`, 'info');
  };

  const renameProject = (projectId: string, name: string) => {
    patchProject(projectId, (p) => ({ ...p, name }));
    addToast('Project renamed', name, 'success');
  };

  const createFolder = (projectId: string, name: string, parentId: string | null = null): ProjectFolder => {
    const folder: ProjectFolder = { id: 'fold_' + Date.now() + Math.random().toString(36).slice(2, 4), name, parentId };
    patchProject(projectId, (p) => ({ ...p, folders: [...p.folders, folder], updatedAt: 'Just now' }));
    addToast('Folder created', name, 'success');
    return folder;
  };

  const renameFolder = (projectId: string, folderId: string, name: string) => {
    patchProject(projectId, (p) => ({ ...p, folders: p.folders.map((f) => (f.id === folderId ? { ...f, name } : f)) }));
    addToast('Folder renamed', name, 'success');
  };

  const deleteFolder = (projectId: string, folderId: string) => {
    patchProject(projectId, (p) => {
      // children and files move up to the parent folder
      const parent = p.folders.find((f) => f.id === folderId)?.parentId ?? null;
      return {
        ...p,
        folders: p.folders.filter((f) => f.id !== folderId).map((f) => (f.parentId === folderId ? { ...f, parentId: parent } : f)),
        items: p.items.map((i) => (i.folderId === folderId ? { ...i, folderId: parent ?? undefined } : i)),
      };
    });
    setGenerateTarget((t) => (t?.folderId === folderId ? { ...t, folderId: null } : t));
    addToast('Folder deleted', 'Its contents moved up one level.', 'info');
  };

  const moveItemToFolder = (projectId: string, itemId: string, folderId: string | null) => {
    patchProject(projectId, (p) => ({
      ...p,
      items: p.items.map((i) => (i.id === itemId ? { ...i, folderId: folderId ?? undefined } : i)),
    }));
    const folder = projects.find((p) => p.id === projectId)?.folders.find((f) => f.id === folderId);
    addToast('Moved', folder ? `Moved to ${folder.name}` : 'Moved to project root', 'success');
  };

  // ---------- Billing ----------
  const buyCredits = (amount: number, label = 'Credit Pack') => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }));
    setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, credits: u.credits + amount } : u)));
    logTransaction({ kind: 'purchase', title: `Credit Pack — ${label}`, detail: `${amount.toLocaleString()} credits`, amount });
    addToast('Credits added', `+${amount.toLocaleString()} credits.`, 'success');
    setBuyCreditsModalOpen(false);
  };

  const upgradePlan = (planName: Exclude<PlanName, 'Free'>) => {
    const plan = subscriptionPlans.find((p) => p.name === planName);
    const bonus = plan?.monthlyCredits ?? 1000;
    setUser((prev) => ({ ...prev, plan: planName, credits: prev.credits + bonus }));
    setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, plan: planName, credits: u.credits + bonus } : u)));
    logTransaction({ kind: 'subscription', title: `${planName} Plan — Monthly Credits`, detail: plan ? `$${plan.monthlyPrice}.00 / month` : 'Upgrade', amount: bonus });
    addToast('Plan upgraded', `${planName} plan active. +${bonus.toLocaleString()} credits.`, 'success');
  };

  // ---------- News ----------
  const publishAnnouncement = (title: string, body: string, recipientCount: number, byEmail = false) => {
    const item: NewsItem = {
      id: 'news_' + Date.now(),
      tag: 'Announcement',
      title,
      body,
      date: 'Just now',
      image: SAMPLE_IMAGES[2],
    };
    setNewsItems((prev) => [item, ...prev]);
    addToast('Announcement sent successfully', `${byEmail ? 'Dashboard notification and email sent' : 'Dashboard notification sent'} to ${recipientCount} user${recipientCount === 1 ? '' : 's'}.`, 'success');
  };

  // ---------- API keys ----------
  const createApiKey = (name = 'ComfyUI workflow') => {
    const rand = Array.from({ length: 16 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
    const key: ApiKeyItem = { id: 'key_' + Date.now(), name, key: `sk-demo-${rand}`, createdAt: nowLabel(), revoked: false };
    setApiKeys((prev) => [key, ...prev]);
    addToast('API key created', 'Copy it now. This is a demo key.', 'success');
    return key;
  };

  const revokeApiKey = (id: string) => {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revoked: true } : k)));
    addToast('API key revoked', 'Requests with this key are now rejected.', 'warning');
  };

  // ---------- Admin ----------
  const toggleUserStatus = (userId: string) => {
    const target = adminUsers.find((u) => u.id === userId);
    if (!target) return;
    const next = target.status === 'Active' ? 'Suspended' : 'Active';
    setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: next } : u)));
    addToast('User status changed', `${target.name} is now ${next}.`, next === 'Active' ? 'success' : 'warning');
  };

  const adjustUserCredits = (userId: string, deltaAmount: number, reason?: string) => {
    const target = adminUsers.find((u) => u.id === userId);
    if (!target) return;
    const updated = Math.max(0, target.credits + deltaAmount);
    setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, credits: updated } : u)));
    if (userId === user.id) {
      setUser((curr) => ({ ...curr, credits: updated }));
      setTransactions((prev) => [
        { id: 'tx_' + Date.now(), kind: 'bonus', title: reason || 'Admin Adjustment', detail: 'Adjusted by support', amount: deltaAmount, date: nowLabel() },
        ...prev,
      ]);
    }
    addToast('Credits adjusted', `${deltaAmount >= 0 ? '+' : ''}${deltaAmount} credits for ${target.name} (${reason || 'Admin Adjustment'})`, deltaAmount >= 0 ? 'success' : 'info');
  };

  const updateUserPlan = (userId: string, newPlanName: string) => {
    const target = adminUsers.find((u) => u.id === userId);
    if (!target) return;
    setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlanName } : u)));
    if (userId === user.id) setUser((curr) => ({ ...curr, plan: newPlanName as PlanName }));
    addToast('Plan changed', `${target.name} is now on the ${newPlanName} plan.`, 'success');
  };

  const addCreditPackage = (pkg: Omit<CreditPackage, 'id'>) => {
    setCreditPackages((prev) => [...prev, { ...pkg, id: 'pkg_' + Date.now() }]);
    addToast('Credit pack created', `${pkg.name}: ${pkg.credits} credits for $${pkg.price}.`, 'success');
  };
  const updateCreditPackage = (pkgId: string, updated: Partial<CreditPackage>) => {
    setCreditPackages((prev) => prev.map((p) => (p.id === pkgId ? { ...p, ...updated } : p)));
    addToast('Credit pack updated', undefined, 'success');
  };
  const deleteCreditPackage = (pkgId: string) => {
    setCreditPackages((prev) => prev.filter((p) => p.id !== pkgId));
    addToast('Credit pack deleted', undefined, 'info');
  };

  const addSubscriptionPlan = (plan: Omit<SubscriptionPlan, 'id'>) => {
    setSubscriptionPlans((prev) => [...prev, { ...plan, id: 'plan_' + Date.now() }]);
    addToast('Plan created', plan.name, 'success');
  };
  const updateSubscriptionPlan = (planId: string, updated: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, ...updated } : p)));
    addToast('Plan updated', undefined, 'success');
  };
  const deleteSubscriptionPlan = (planId: string) => {
    setSubscriptionPlans((prev) => prev.filter((p) => p.id !== planId));
    addToast('Plan deleted', undefined, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        authRole,
        loginAsUser,
        loginAsAdmin,
        logout,
        currentScreen,
        setCurrentScreen,
        mobileNavOpen,
        setMobileNavOpen,
        user,
        setUser,
        generations,
        projects,
        models,
        selectedModel,
        setSelectedModel,
        updateModelCreditCost,
        toggleModelStatus,
        updateModel,
        chatModels,
        updateChatModel,
        toggleChatModelStatus,
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
        mediaType,
        setMediaType,
        imageToVideo,
        setImageToVideo,
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
        clearSelectedReferences,
        simulateUpload,
        addReference,
        removeReference,
        jobStage,
        generationProgress,
        jobCost,
        demoOutcome,
        setDemoOutcome,
        currentGenerationResult,
        startGeneration,
        resetJob,
        activeResult,
        openResult,
        deleteGeneration,
        downloadGeneration,
        rerunGeneration,
        addAsReference,
        selectedProjectDetail,
        setSelectedProjectDetail,
        generateTarget,
        setGenerateTarget,
        createProject,
        deleteProject,
        renameProject,
        createFolder,
        renameFolder,
        deleteFolder,
        moveItemToFolder,
        saveToProject,
        removeFromProject,
        transactions,
        buyCredits,
        upgradePlan,
        newsItems,
        publishAnnouncement,
        apiKeys,
        createApiKey,
        revokeApiKey,
        buyCreditsModalOpen,
        setBuyCreditsModalOpen,
        saveToProjectModalOpen,
        setSaveToProjectModalOpen,
        targetAssetForProject,
        setTargetAssetForProject,
        newProjectModalOpen,
        setNewProjectModalOpen,
        toasts,
        addToast,
        removeToast,
        modelApiKeys,
        updateModelApiKey,
        adminUsers,
        toggleUserStatus,
        adjustUserCredits,
        updateUserPlan,
        creditPackages,
        addCreditPackage,
        updateCreditPackage,
        deleteCreditPackage,
        subscriptionPlans,
        addSubscriptionPlan,
        updateSubscriptionPlan,
        deleteSubscriptionPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
