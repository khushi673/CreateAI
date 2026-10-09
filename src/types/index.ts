export type ViewScreen =
  | 'auth'
  | 'dashboard'
  | 'create'
  | 'result'
  | 'chat'
  | 'compare'
  | 'references'
  | 'history'
  | 'projects'
  | 'project-detail'
  | 'collaboration'
  | 'credits'
  | 'profile'
  | 'admin';

export type MediaType = 'video' | 'image' | 'audio';
export type AuthRole = 'user' | 'admin' | null;

export type ModelStatus = 'Active' | 'Disabled' | 'Beta';

/** What a model supports; the Studio renders only the controls a model declares. */
export interface ModelCapabilities {
  durations?: string[];
  resolutions?: string[];
  aspectRatios?: string[];
  seed: boolean;
  negativePrompt: boolean;
  maxReferenceImages: number;
  startFrame?: boolean;
  endFrame?: boolean;
  referenceAudio?: boolean;
  audioStyles?: string[];
  /** Model-specific selectable settings, e.g. "Camera Control" */
  extras?: { key: string; label: string; options: string[]; default: string }[];
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  mediaTypes: MediaType[];
  description: string;
  badge?: string;
  /** Base credit cost (shortest duration, lowest resolution) */
  creditCost: number;
  icon: string;
  rating: number;
  featured?: boolean;
  status: ModelStatus;
  /** What the AI provider charges (USD) for one base generation */
  providerCost: number;
  supports: string[];
  capabilities: ModelCapabilities;
  costFactors: { duration?: Record<string, number>; resolution?: Record<string, number> };
}

export interface GenerationItem {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  mediaType: MediaType;
  modelId: string;
  modelName: string;
  mediaUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  aspectRatio: string;
  duration?: string;
  resolution?: string;
  creditsUsed: number;
  likes: number;
  downloads: number;
  projectId?: string;
  seed?: string;
  settings?: {
    motionSpeed?: number;
    cameraMovement?: string;
    guidanceScale?: number;
  };
  referenceImage?: string;
  status: GenerationStatus;
  /** Absolute date label, e.g. "Oct 7, 2026 · 14:32" */
  date: string;
  folderId?: string;
  safetyCheck: 'Passed' | 'Blocked' | 'Flagged';
  extraSettings?: Record<string, string>;
  startFrame?: string;
  endFrame?: string;
  referenceNames?: string[];
}

export type GenerationStatus = 'Completed' | 'Failed' | 'Blocked';

export interface Project {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  items: GenerationItem[];
  folders: ProjectFolder[];
  tags: string[];
}

export interface ProjectFolder {
  id: string;
  name: string;
  /** null = top-level folder */
  parentId: string | null;
}

export type PlanName = 'Free' | 'Basic' | 'Pro' | 'Enterprise';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  credits: number;
  plan: PlanName;
  isAdmin: boolean;
  memberSince: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

// Admin Specific Types
export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  plan: string;
  credits: number;
  status: 'Active' | 'Suspended';
  joinedAt: string;
  totalGenerations: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  bonusText?: string;
  isPopular?: boolean;
  active: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyCredits: number;
  maxConcurrentJobs: number;
  monthlyGenerationLimit: number;
  allowedModelIds: string[];
  badge?: string;
  isPopular?: boolean;
  active: boolean;
  description: string;
  features: string[];
}

// ---------- Studio / generation ----------

export type JobStage = 'idle' | 'submitted' | 'queued' | 'generating' | 'complete' | 'failed' | 'blocked';
export type DemoOutcome = 'success' | 'fail' | 'blocked';

export interface GenerateParams {
  mediaType: MediaType;
  imageToVideo: boolean;
  modelId: string;
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  duration: string;
  resolution: string;
  seed: string;
  audioStyle: string;
  extraSettings: Record<string, string>;
  startFrame: string | null;
  endFrame: string | null;
  referenceIds: string[];
}

export interface GenerateTarget {
  projectId: string;
  folderId: string | null;
}

// ---------- References ----------

export interface ReferenceItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  source: 'uploaded' | 'generated';
  /** Short tag used by the @ mention selector, e.g. "character" */
  tag?: string;
}

// ---------- Billing ----------

export interface CreditTransaction {
  id: string;
  kind: 'charge' | 'refund' | 'purchase' | 'subscription' | 'bonus';
  title: string;
  detail: string;
  /** signed credits: negative = spent, positive = received */
  amount: number;
  date: string;
}

export interface NewsItem {
  id: string;
  tag: 'Update' | 'New Model' | 'Announcement' | 'Tip';
  title: string;
  body: string;
  date: string;
  image: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  revoked: boolean;
}

// ---------- Admin: per-model API key ----------

export interface ModelApiKey {
  apiKey: string;
  updatedAt: string;
}

// ---------- Chat ----------

/** Text assistant model. Charged per message. */
export interface ChatModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  /** Credits charged per message */
  creditCost: number;
  /** What the AI provider charges (USD) per message */
  providerCost: number;
  status: ModelStatus;
  supports: string[];
}

/** A prompt written by the assistant for a specific media type and model */
export interface ChatPrompt {
  text: string;
  negative?: string;
  mediaType: MediaType;
  targetModelId: string;
  targetModelName: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Credits charged for this message (on the user message) */
  cost?: number;
  modelName?: string;
  prompt?: ChatPrompt;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

/** What the prompt should be written for */
export interface ChatTarget {
  mediaType: MediaType;
  modelId: string;
}
