import { AIModel, ChatModel, CreditPackage } from '@/types';
import { PACK_UNITS_SOLD, MODEL_USAGE, CHAT_USAGE } from '@/data/adminMock';

/** Share of sold credits that users have spent (mock) */
const CREDITS_USED_SHARE = 0.85;

/**
 * One chain of numbers for every admin finance figure:
 * packs sold -> revenue and credits sold -> credits used -> provider cost -> profit.
 * `factor` scales the packs sold for the chosen period.
 */
export function computeFinance(packs: CreditPackage[], models: AIModel[], chatModels: ChatModel[], factor = 1) {
  const sold = (p: CreditPackage) => (PACK_UNITS_SOLD[p.id] ?? 0) * factor;
  const revenue = packs.reduce((t, p) => t + p.price * sold(p), 0);
  const creditsSold = packs.reduce((t, p) => t + p.credits * sold(p), 0);
  const creditsUsed = creditsSold * CREDITS_USED_SHARE;

  // What users pay per credit on average, and what the providers charge per credit on average
  const pricePerCredit = creditsSold ? revenue / creditsSold : 0;
  // Average provider cost per credit, weighted by how many credits users spend on each model:
  // total provider cost of all generations / total credits those generations cost.
  const uses = (id: string) => MODEL_USAGE.find((u) => u.modelId === id)?.count ?? CHAT_USAGE[id] ?? 0;
  const all = [...models, ...chatModels];
  const spentCredits = all.reduce((t, m) => t + uses(m.id) * m.creditCost, 0);
  const spentCost = all.reduce((t, m) => t + uses(m.id) * m.providerCost, 0);
  const costPerCredit = spentCredits ? spentCost / spentCredits : 0;

  const providerCost = creditsUsed * costPerCredit;
  const profit = revenue - providerCost;
  return { sold, revenue, creditsSold, creditsUsed, pricePerCredit, costPerCredit, providerCost, profit, margin: revenue ? (profit / revenue) * 100 : 0 };
}
