// All admin-only mock data. Frontend prototype: nothing here touches a backend.

export type JobStatus = 'Queued' | 'Processing' | 'Completed' | 'Failed';

export interface AdminJob {
  id: string;
  userId: string;
  user: string;
  modelId: string;
  type: 'Video' | 'Image' | 'Audio';
  duration: string;
  cost: number;
  status: JobStatus;
  time: string;
  refunded?: boolean;
  error?: string;
}

export const INITIAL_JOBS: AdminJob[] = [
  { id: 'job_70421', userId: 'usr_99812', user: 'Alex Rivera', modelId: 'kling-4', type: 'Video', duration: '10s', cost: 80, status: 'Processing', time: '1 min ago' },
  { id: 'job_70420', userId: 'usr_88102', user: 'Sarah Connor', modelId: 'seedance-2-5', type: 'Video', duration: '5s', cost: 45, status: 'Queued', time: '1 min ago' },
  { id: 'job_70419', userId: 'usr_77201', user: 'Marcus Vance', modelId: 'nano-banana', type: 'Image', duration: '-', cost: 4, status: 'Queued', time: '2 min ago' },
  { id: 'job_70418', userId: 'usr_88102', user: 'Sarah Connor', modelId: 'wan-3', type: 'Video', duration: '8s', cost: 60, status: 'Processing', time: '3 min ago' },
  { id: 'job_70417', userId: 'usr_99812', user: 'Alex Rivera', modelId: 'flux-2-pro', type: 'Image', duration: '-', cost: 6, status: 'Completed', time: '5 min ago' },
  { id: 'job_70416', userId: 'usr_66319', user: 'Elena Rostova', modelId: 'suno-5', type: 'Audio', duration: '60s', cost: 12, status: 'Completed', time: '7 min ago' },
  { id: 'job_70415', userId: 'usr_44901', user: 'Chloe Bennett', modelId: 'luma-ray-3', type: 'Video', duration: '5s', cost: 50, status: 'Failed', time: '9 min ago', error: 'Provider timeout (504)' },
  { id: 'job_70414', userId: 'usr_77201', user: 'Marcus Vance', modelId: 'kling-4', type: 'Video', duration: '10s', cost: 80, status: 'Completed', time: '12 min ago' },
  { id: 'job_70413', userId: 'usr_88102', user: 'Sarah Connor', modelId: 'nano-banana', type: 'Image', duration: '-', cost: 4, status: 'Completed', time: '15 min ago' },
  { id: 'job_70412', userId: 'usr_99812', user: 'Alex Rivera', modelId: 'seedance-2-5', type: 'Video', duration: '10s', cost: 90, status: 'Failed', time: '18 min ago', error: 'GPU out of memory' },
  { id: 'job_70411', userId: 'usr_66319', user: 'Elena Rostova', modelId: 'flux-2-pro', type: 'Image', duration: '-', cost: 6, status: 'Completed', time: '22 min ago' },
  { id: 'job_70410', userId: 'usr_55104', user: 'David Kim', modelId: 'stable-audio-3', type: 'Audio', duration: '30s', cost: 8, status: 'Completed', time: '27 min ago' },
  { id: 'job_70409', userId: 'usr_44901', user: 'Chloe Bennett', modelId: 'wan-3', type: 'Video', duration: '5s', cost: 40, status: 'Completed', time: '31 min ago' },
  { id: 'job_70408', userId: 'usr_88102', user: 'Sarah Connor', modelId: 'kling-4', type: 'Video', duration: '5s', cost: 40, status: 'Failed', time: '38 min ago', error: 'Output validation failed' },
  { id: 'job_70407', userId: 'usr_77201', user: 'Marcus Vance', modelId: 'luma-ray-3', type: 'Video', duration: '10s', cost: 100, status: 'Completed', time: '44 min ago' },
  { id: 'job_70406', userId: 'usr_99812', user: 'Alex Rivera', modelId: 'nano-banana', type: 'Image', duration: '-', cost: 4, status: 'Completed', time: '52 min ago' },
];

export const NEW_JOB_POOL: Omit<AdminJob, 'id' | 'time' | 'status'>[] = [
  { userId: 'usr_99812', user: 'Alex Rivera', modelId: 'kling-4', type: 'Video', duration: '5s', cost: 40 },
  { userId: 'usr_88102', user: 'Sarah Connor', modelId: 'nano-banana', type: 'Image', duration: '-', cost: 4 },
  { userId: 'usr_66319', user: 'Elena Rostova', modelId: 'wan-3', type: 'Video', duration: '8s', cost: 60 },
  { userId: 'usr_77201', user: 'Marcus Vance', modelId: 'suno-5', type: 'Audio', duration: '60s', cost: 12 },
  { userId: 'usr_44901', user: 'Chloe Bennett', modelId: 'flux-2-pro', type: 'Image', duration: '-', cost: 6 },
];

interface UserExtra {
  creditsUsed: number;
  lastActive: string;
  recent: string[];
}

export const USER_EXTRAS: Record<string, UserExtra> = {
  usr_99812: { creditsUsed: 18420, lastActive: '2 min ago', recent: ['Generated video with Kling 4.0 (80 credits)', 'Generated image with Flux 2 Pro (6 credits)', 'Purchased Studio Pack (+2,000 credits)'] },
  usr_88102: { creditsUsed: 61200, lastActive: '5 min ago', recent: ['Generated video with WAN 3.0 (60 credits)', 'Failed generation refunded (+40 credits)', 'Invited teammate to workspace'] },
  usr_77201: { creditsUsed: 7340, lastActive: '12 min ago', recent: ['Generated video with Luma Ray 3 (100 credits)', 'Upgraded to Basic plan', 'Saved 3 items to project'] },
  usr_66319: { creditsUsed: 910, lastActive: '1 hr ago', recent: ['Generated audio with Suno 5 (12 credits)', 'Created reference library entry', 'Signed up'] },
  usr_55104: { creditsUsed: 14100, lastActive: '3 days ago', recent: ['Account suspended (chargeback review)', 'Generated audio with Stable Audio 3 (8 credits)', 'Plan renewal failed'] },
  usr_44901: { creditsUsed: 380, lastActive: '9 min ago', recent: ['Generation failed: provider timeout', 'Generated video with WAN 3.0 (40 credits)', 'Signed up'] },
};

export type TxType = 'Purchase' | 'Subscription' | 'Usage' | 'Refund' | 'Admin adjustment';

export interface AdminTx {
  id: string;
  user: string;
  type: TxType;
  detail: string;
  amount: number;
  date: string;
}

export const INITIAL_ADMIN_TX: AdminTx[] = [
  { id: 'tx_9001', user: 'Alex Rivera', type: 'Purchase', detail: 'Studio Pack', amount: 2000, date: 'Oct 7, 2026 · 09:12' },
  { id: 'tx_9002', user: 'Sarah Connor', type: 'Subscription', detail: 'Enterprise monthly credits', amount: 12000, date: 'Oct 7, 2026 · 08:00' },
  { id: 'tx_9003', user: 'Alex Rivera', type: 'Usage', detail: 'Kling 4.0 video 10s', amount: -80, date: 'Oct 7, 2026 · 09:40' },
  { id: 'tx_9004', user: 'Marcus Vance', type: 'Usage', detail: 'Luma Ray 3 video 10s', amount: -100, date: 'Oct 7, 2026 · 09:28' },
  { id: 'tx_9005', user: 'Chloe Bennett', type: 'Refund', detail: 'Failed generation job_70380', amount: 50, date: 'Oct 6, 2026 · 21:15' },
  { id: 'tx_9006', user: 'Elena Rostova', type: 'Admin adjustment', detail: 'Goodwill bonus', amount: 100, date: 'Oct 6, 2026 · 18:02' },
  { id: 'tx_9007', user: 'David Kim', type: 'Admin adjustment', detail: 'Chargeback reversal', amount: -1200, date: 'Oct 6, 2026 · 11:47' },
  { id: 'tx_9008', user: 'Marcus Vance', type: 'Purchase', detail: 'Starter Pack', amount: 250, date: 'Oct 5, 2026 · 16:30' },
  { id: 'tx_9009', user: 'Sarah Connor', type: 'Usage', detail: 'WAN 3.0 video 8s', amount: -60, date: 'Oct 5, 2026 · 14:05' },
  { id: 'tx_9010', user: 'Alex Rivera', type: 'Subscription', detail: 'Pro monthly credits', amount: 2500, date: 'Oct 5, 2026 · 08:00' },
  { id: 'tx_9011', user: 'Chloe Bennett', type: 'Usage', detail: 'Flux 2 Pro image', amount: -6, date: 'Oct 4, 2026 · 19:44' },
  { id: 'tx_9012', user: 'Elena Rostova', type: 'Refund', detail: 'Duplicate charge', amount: 12, date: 'Oct 4, 2026 · 10:20' },
];

export interface RefundRow {
  id: string;
  user: string;
  jobId: string;
  amount: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
}

export const INITIAL_REFUNDS: RefundRow[] = [
  { id: 'rf_301', user: 'Chloe Bennett', jobId: 'job_70380', amount: 50, reason: 'Provider timeout', status: 'Approved', date: 'Oct 6, 2026' },
  { id: 'rf_302', user: 'Elena Rostova', jobId: 'job_70311', amount: 12, reason: 'Duplicate charge', status: 'Approved', date: 'Oct 4, 2026' },
  { id: 'rf_303', user: 'Marcus Vance', jobId: 'job_70290', amount: 80, reason: 'Output quality complaint', status: 'Pending', date: 'Oct 4, 2026' },
  { id: 'rf_304', user: 'Alex Rivera', jobId: 'job_70255', amount: 90, reason: 'GPU error', status: 'Approved', date: 'Oct 3, 2026' },
  { id: 'rf_305', user: 'David Kim', jobId: 'job_70101', amount: 40, reason: 'Policy: charged after suspension', status: 'Rejected', date: 'Oct 1, 2026' },
];

export interface FailedGen {
  id: string;
  userId: string;
  user: string;
  modelId: string;
  credits: number;
  error: string;
  date: string;
  refunded: boolean;
}

export const INITIAL_FAILED: FailedGen[] = [
  { id: 'job_70415', userId: 'usr_44901', user: 'Chloe Bennett', modelId: 'luma-ray-3', credits: 50, error: 'Provider timeout (504)', date: 'Oct 7, 2026 · 09:31', refunded: false },
  { id: 'job_70412', userId: 'usr_99812', user: 'Alex Rivera', modelId: 'seedance-2-5', credits: 90, error: 'GPU out of memory', date: 'Oct 7, 2026 · 09:22', refunded: false },
  { id: 'job_70408', userId: 'usr_88102', user: 'Sarah Connor', modelId: 'kling-4', credits: 40, error: 'Output validation failed', date: 'Oct 7, 2026 · 09:02', refunded: false },
  { id: 'job_70377', userId: 'usr_77201', user: 'Marcus Vance', modelId: 'wan-3', credits: 60, error: 'Queue expired', date: 'Oct 6, 2026 · 17:10', refunded: true },
];



// ---------- Analytics ----------

interface RangeOption {
  id: string;
  label: string;
  factor: number;
}

export const DATE_RANGES: RangeOption[] = [
  { id: '30d', label: 'Last 30 days', factor: 1 },
  { id: '90d', label: 'Last 90 days', factor: 2.8 },
  { id: '12m', label: 'Last 12 months', factor: 11.2 },
];

/** Packs sold in the selected period (by credit pack id) */
export const PACK_UNITS_SOLD: Record<string, number> = {
  pkg_starter: 410,
  pkg_creator: 620,
  pkg_studio: 190,
  pkg_production: 64,
};

// ---------- Announcements ----------

export interface SentAnnouncement {
  id: string;
  subject: string;
  body: string;
  recipients: number;
  /** Also sent as an email, not only as a dashboard notification */
  emailed: boolean;
  date: string;
}

export const INITIAL_SENT: SentAnnouncement[] = [
  { id: 'sa_1', subject: 'Kling 4.0 is now live', body: 'Cinematic motion with start and end frame control is available on all paid plans.', recipients: 6, emailed: true, date: 'Oct 1, 2026' },
];

// ---------- Dashboard ----------
export const DAILY_GENERATIONS = [
  { day: 'Thu', count: 312 },
  { day: 'Fri', count: 358 },
  { day: 'Sat', count: 271 },
  { day: 'Sun', count: 244 },
  { day: 'Mon', count: 398 },
  { day: 'Tue', count: 421 },
  { day: 'Wed', count: 377 },
];

export const MODEL_USAGE: { modelId: string; count: number }[] = [
  { modelId: 'kling-4', count: 842 },
  { modelId: 'nano-banana', count: 716 },
  { modelId: 'wan-3', count: 498 },
  { modelId: 'seedance-2-5', count: 351 },
  { modelId: 'suno-5', count: 142 },
  { modelId: 'flux-2-pro', count: 73 },
];

/** Chat messages sent in the selected period, by chat model id (used to weight provider cost) */

/** Chat messages sent per chat model in the period (mock) */
export const CHAT_USAGE: Record<string, number> = {
  'chat-fast': 2400,
  'chat-balanced': 1500,
  'chat-pro': 600,
};
