'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ViewScreen, 
  MediaType, 
  AIModel, 
  GenerationItem, 
  Project, 
  UserProfile,
  ToastMessage,
  AdminUserItem,
  CreditPackage,
  SubscriptionPlan,
  AuthRole
} from '@/types';
import { 
  AI_MODELS, 
  INITIAL_GENERATIONS, 
  INITIAL_PROJECTS, 
  INITIAL_USER,
  INITIAL_ADMIN_USERS,
  INITIAL_CREDIT_PACKAGES,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_FREE_PLAN_CREDITS
} from '@/data/mockData';

interface AppContextType {
  // Auth State & Role Actions
  authRole: AuthRole;
  setAuthRole: (role: AuthRole) => void;
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  logout: () => void;

  currentScreen: ViewScreen;
  setCurrentScreen: (screen: ViewScreen) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  generations: GenerationItem[];
  projects: Project[];
  
  // Dynamic AI Models
  models: AIModel[];
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  updateModelCreditCost: (modelId: string, newCost: number) => void;

  mediaType: MediaType;
  setMediaType: (type: MediaType) => void;
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
  motionSpeed: number;
  setMotionSpeed: (speed: number) => void;
  cameraMovement: string;
  setCameraMovement: (movement: string) => void;
  guidanceScale: number;
  setGuidanceScale: (scale: number) => void;
  seed: string;
  setSeed: (seed: string) => void;
  referenceMedia: GenerationItem | { mediaUrl: string; title?: string } | null;
  setReferenceMedia: (ref: GenerationItem | { mediaUrl: string; title?: string } | null) => void;
  
  // Generation Process State
  isGenerating: boolean;
  generationProgress: number;
  generationStep: string;
  currentGenerationResult: GenerationItem | null;
  startGeneration: () => void;
  
  // Project & Asset Actions
  selectedProjectDetail: Project | null;
  setSelectedProjectDetail: (proj: Project | null) => void;
  saveToProject: (assetId: string, projectId: string) => void;
  useAsReference: (asset: GenerationItem) => void;
  createProject: (name: string, description: string, tags: string[]) => Project;
  
  // Billing & Credits
  buyCredits: (amount: number) => void;
  upgradePlan: (planName: 'Pro' | 'Enterprise') => void;

  // Modals state
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  buyCreditsModalOpen: boolean;
  setBuyCreditsModalOpen: (open: boolean) => void;
  upgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;
  saveToProjectModalOpen: boolean;
  setSaveToProjectModalOpen: (open: boolean) => void;
  targetAssetForProject: GenerationItem | null;
  setTargetAssetForProject: (item: GenerationItem | null) => void;
  assetDetailModalItem: GenerationItem | null;
  setAssetDetailModalItem: (item: GenerationItem | null) => void;
  newProjectModalOpen: boolean;
  setNewProjectModalOpen: (open: boolean) => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Dedicated Admin State & Actions
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

  freePlanCredits: number;
  setFreePlanCredits: (credits: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample Pool
const MOCK_SAMPLE_VIDEOS = [
  {
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyber-punk-street-with-neon-lights-42862-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
  },
  {
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41548-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80',
  },
];

const MOCK_SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication Role State
  const [authRole, setAuthRole] = useState<AuthRole>('user'); // Default to 'user' or 'admin' or null
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('landing');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [generations, setGenerations] = useState<GenerationItem[]>(INITIAL_GENERATIONS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<Project | null>(INITIAL_PROJECTS[0]);

  // Models state
  const [models, setModels] = useState<AIModel[]>(AI_MODELS);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);

  // Form states
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [prompt, setPrompt] = useState<string>('Cinematic cyberpunk samurai in rainy night neon street, slow motion pan, high detail physics');
  const [negativePrompt, setNegativePrompt] = useState<string>('low quality, blurry, distorted anatomy, noisy, grain');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [duration, setDuration] = useState<string>('5s');
  const [resolution, setResolution] = useState<string>('1080p');
  const [motionSpeed, setMotionSpeed] = useState<number>(7);
  const [cameraMovement, setCameraMovement] = useState<string>('Pan Right');
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [seed, setSeed] = useState<string>('8492019');
  const [referenceMedia, setReferenceMedia] = useState<GenerationItem | { mediaUrl: string; title?: string } | null>(null);

  // Generation process state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [currentGenerationResult, setCurrentGenerationResult] = useState<GenerationItem | null>(null);

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [buyCreditsModalOpen, setBuyCreditsModalOpen] = useState<boolean>(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [saveToProjectModalOpen, setSaveToProjectModalOpen] = useState<boolean>(false);
  const [targetAssetForProject, setTargetAssetForProject] = useState<GenerationItem | null>(null);
  const [assetDetailModalItem, setAssetDetailModalItem] = useState<GenerationItem | null>(null);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Admin states
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>(INITIAL_ADMIN_USERS);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>(INITIAL_CREDIT_PACKAGES);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [freePlanCredits, setFreePlanCredits] = useState<number>(INITIAL_FREE_PLAN_CREDITS);

  // Role Authentication Helpers
  const loginAsUser = () => {
    setAuthRole('user');
    setCurrentScreen('dashboard');
    setUser(INITIAL_USER);
    addToast('Signed In', 'Welcome back to your Creator Workspace!', 'success');
  };

  const loginAsAdmin = () => {
    setAuthRole('admin');
    setCurrentScreen('admin');
    addToast('Admin Authenticated', 'Welcome to AetherGen Central Control Panel', 'info');
  };

  const logout = () => {
    setAuthRole(null);
    addToast('Signed Out', 'You have been signed out of the platform.', 'info');
  };

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Update Model credit cost
  const updateModelCreditCost = (modelId: string, newCost: number) => {
    setModels((prev) =>
      prev.map((m) => (m.id === modelId ? { ...m, creditCost: newCost } : m))
    );
    if (selectedModel.id === modelId) {
      setSelectedModel((prev) => ({ ...prev, creditCost: newCost }));
    }
    addToast('Model Cost Updated', `Updated model credit cost to ${newCost} credits`, 'success');
  };

  // Start generation simulation
  const startGeneration = () => {
    if (user.credits < selectedModel.creditCost) {
      addToast('Insufficient Credits', `You need ${selectedModel.creditCost} credits for this model. Please top up!`, 'warning');
      setBuyCreditsModalOpen(true);
      return;
    }

    const cost = selectedModel.creditCost;
    setUser((prev) => ({ ...prev, credits: Math.max(0, prev.credits - cost) }));
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, credits: Math.max(0, u.credits - cost), totalGenerations: u.totalGenerations + 1 } : u))
    );

    setIsGenerating(true);
    setGenerationProgress(5);
    setGenerationStep('Initializing AI pipeline & loading checkpoint weights...');
    setCurrentGenerationResult(null);

    addToast('Generation Queued', `Deducted ${cost} credits for ${selectedModel.name}`, 'info');

    setTimeout(() => {
      setGenerationProgress(25);
      setGenerationStep('Synthesizing latent features & spatial frame motion...');
    }, 1200);

    setTimeout(() => {
      setGenerationProgress(60);
      setGenerationStep('Rendering 4K resolution frames & neural upscaling...');
    }, 2500);

    setTimeout(() => {
      setGenerationProgress(88);
      setGenerationStep('Applying color grade & audio-visual synchronization...');
    }, 3800);

    setTimeout(() => {
      setGenerationProgress(100);
      setIsGenerating(false);

      const randomVideo = MOCK_SAMPLE_VIDEOS[Math.floor(Math.random() * MOCK_SAMPLE_VIDEOS.length)];
      const randomImg = MOCK_SAMPLE_IMAGES[Math.floor(Math.random() * MOCK_SAMPLE_IMAGES.length)];

      const isVid = mediaType === 'video';
      const isAud = mediaType === 'audio';

      const newGen: GenerationItem = {
        id: 'gen_' + Date.now(),
        title: prompt.slice(0, 45) + (prompt.length > 45 ? '...' : ''),
        prompt,
        negativePrompt,
        mediaType,
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        mediaUrl: isVid ? randomVideo.mediaUrl : isAud ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' : randomImg,
        thumbnailUrl: isVid ? randomVideo.thumbnailUrl : isAud ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80' : randomImg,
        createdAt: 'Just now',
        aspectRatio,
        duration: isVid ? duration : isAud ? '15s' : undefined,
        resolution,
        creditsUsed: cost,
        likes: 1,
        downloads: 0,
        seed: seed || Math.floor(Math.random() * 9000000 + 1000000).toString(),
        settings: {
          motionSpeed,
          cameraMovement,
          guidanceScale,
        },
        referenceImage: referenceMedia ? ('thumbnailUrl' in referenceMedia ? referenceMedia.thumbnailUrl : referenceMedia.mediaUrl) : undefined,
      };

      setGenerations((prev) => [newGen, ...prev]);
      setCurrentGenerationResult(newGen);

      addToast('Generation Ready!', `Your ${mediaType} has been successfully generated.`, 'success');
    }, 5000);
  };

  const saveToProject = (assetId: string, projectId: string) => {
    const asset = generations.find((g) => g.id === assetId);
    if (!asset) return;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const exists = p.items.some((item) => item.id === assetId);
          if (exists) return p;
          const updatedItems = [asset, ...p.items];
          return {
            ...p,
            items: updatedItems,
            itemCount: updatedItems.length,
            updatedAt: 'Just now',
          };
        }
        return p;
      })
    );

    const projName = projects.find((p) => p.id === projectId)?.name || 'Project';
    addToast('Saved to Project', `Asset saved to "${projName}"`, 'success');
    setSaveToProjectModalOpen(false);
  };

  const useAsReference = (asset: GenerationItem) => {
    setReferenceMedia(asset);
    setMediaType(asset.mediaType);
    setPrompt((prev) => prev ? `${prev} (inspired by ${asset.title})` : asset.prompt);
    setCurrentScreen('create');
    addToast('Reference Loaded', `Set "${asset.title}" as input reference for Create Studio`, 'info');
  };

  const createProject = (name: string, description: string, tags: string[]): Project => {
    const newProj: Project = {
      id: 'proj_' + Date.now(),
      name,
      description,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      itemCount: 0,
      items: [],
      tags,
    };
    setProjects((prev) => [newProj, ...prev]);
    addToast('Project Created', `Project "${name}" is ready!`, 'success');
    return newProj;
  };

  const buyCredits = (amount: number) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }));
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, credits: u.credits + amount } : u))
    );
    addToast('Credits Added!', `Successfully added +${amount} credits to your account.`, 'success');
    setBuyCreditsModalOpen(false);
  };

  const upgradePlan = (planName: 'Pro' | 'Enterprise') => {
    setUser((prev) => ({ ...prev, plan: planName, credits: prev.credits + (planName === 'Pro' ? 1000 : 5000) }));
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, plan: planName, credits: u.credits + (planName === 'Pro' ? 1000 : 5000) } : u))
    );
    addToast('Plan Upgraded!', `Welcome to ${planName} Plan! Added bonus credits.`, 'success');
    setUpgradeModalOpen(false);
  };

  // Admin Actions
  const toggleUserStatus = (userId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          addToast('User Status Changed', `User ${u.name} is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const adjustUserCredits = (userId: string, deltaAmount: number, reason?: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updatedCredits = Math.max(0, u.credits + deltaAmount);
          if (u.id === user.id) {
            setUser((curr) => ({ ...curr, credits: updatedCredits }));
          }
          addToast(
            'Credits Adjusted',
            `${deltaAmount >= 0 ? 'Added +' : ''}${deltaAmount} credits to ${u.name} (${reason || 'Admin Adjustment'})`,
            deltaAmount >= 0 ? 'success' : 'info'
          );
          return { ...u, credits: updatedCredits };
        }
        return u;
      })
    );
  };

  const updateUserPlan = (userId: string, newPlanName: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (u.id === user.id) {
            setUser((curr) => ({ ...curr, plan: newPlanName as any }));
          }
          addToast('Subscription Updated', `Changed ${u.name}'s plan to ${newPlanName}`, 'success');
          return { ...u, plan: newPlanName };
        }
        return u;
      })
    );
  };

  const addCreditPackage = (pkg: Omit<CreditPackage, 'id'>) => {
    const newPkg: CreditPackage = {
      ...pkg,
      id: 'pkg_' + Date.now(),
    };
    setCreditPackages((prev) => [...prev, newPkg]);
    addToast('Credit Package Created', `Created package "${pkg.name}" ($${pkg.price} for ${pkg.credits} credits)`, 'success');
  };

  const updateCreditPackage = (pkgId: string, updated: Partial<CreditPackage>) => {
    setCreditPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, ...updated } : p))
    );
    addToast('Credit Package Updated', `Saved changes to credit package`, 'success');
  };

  const deleteCreditPackage = (pkgId: string) => {
    setCreditPackages((prev) => prev.filter((p) => p.id !== pkgId));
    addToast('Credit Package Deleted', `Removed credit package from store`, 'info');
  };

  const addSubscriptionPlan = (plan: Omit<SubscriptionPlan, 'id'>) => {
    const newPlan: SubscriptionPlan = {
      ...plan,
      id: 'plan_' + Date.now(),
    };
    setSubscriptionPlans((prev) => [...prev, newPlan]);
    addToast('Subscription Plan Created', `Created plan "${plan.name}"`, 'success');
  };

  const updateSubscriptionPlan = (planId: string, updated: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, ...updated } : p))
    );
    addToast('Subscription Plan Updated', `Saved changes to subscription plan`, 'success');
  };

  const deleteSubscriptionPlan = (planId: string) => {
    setSubscriptionPlans((prev) => prev.filter((p) => p.id !== planId));
    addToast('Subscription Plan Deleted', `Removed plan from system`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        authRole,
        setAuthRole,
        loginAsUser,
        loginAsAdmin,
        logout,
        currentScreen,
        setCurrentScreen,
        user,
        setUser,
        generations,
        projects,
        models,
        selectedModel,
        setSelectedModel,
        updateModelCreditCost,
        mediaType,
        setMediaType,
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
        selectedProjectDetail,
        setSelectedProjectDetail,
        saveToProject,
        useAsReference,
        createProject,
        buyCredits,
        upgradePlan,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        buyCreditsModalOpen,
        setBuyCreditsModalOpen,
        upgradeModalOpen,
        setUpgradeModalOpen,
        saveToProjectModalOpen,
        setSaveToProjectModalOpen,
        targetAssetForProject,
        setTargetAssetForProject,
        assetDetailModalItem,
        setAssetDetailModalItem,
        newProjectModalOpen,
        setNewProjectModalOpen,
        toasts,
        addToast,
        removeToast,
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
        freePlanCredits,
        setFreePlanCredits,
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
