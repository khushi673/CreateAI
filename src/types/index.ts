export type ViewScreen = 
  | 'landing' 
  | 'auth' 
  | 'dashboard' 
  | 'create' 
  | 'history' 
  | 'projects' 
  | 'project-detail' 
  | 'pricing' 
  | 'credits' 
  | 'profile' 
  | 'admin';

export type MediaType = 'video' | 'image' | 'audio';
export type AuthRole = 'user' | 'admin' | null;

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  mediaTypes: MediaType[];
  description: string;
  badge?: string;
  creditCost: number;
  icon: string;
  rating: number;
  featured?: boolean;
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
}

export interface Project {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  items: GenerationItem[];
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  credits: number;
  plan: 'Free' | 'Pro' | 'Enterprise';
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
  allowedModelIds: string[];
  badge?: string;
  isPopular?: boolean;
  active: boolean;
  description: string;
  features: string[];
}
