import { LS_KEYS } from "@/lib/constants";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import type { KIContext, WorkRule } from "@/types";

const DEFAULT_CONTEXT: KIContext = {
  department: "",
  expertise: "",
  typicalTasks: "",
  style: "",
  workRules: [],
};

// ═══ LOAD ═══
export function loadKIContext(): KIContext {
  return loadFromStorage<KIContext>(LS_KEYS.KI_CONTEXT, DEFAULT_CONTEXT);
}

// ═══ SAVE ═══
export function saveKIContext(ctx: KIContext): void {
  saveToStorage(LS_KEYS.KI_CONTEXT, ctx);
}

// ═══ UPDATE PROFILE FIELDS ═══
export function updateKIContextProfile(fields: Partial<Pick<KIContext, "department" | "expertise" | "typicalTasks" | "style">>): void {
  const ctx = loadKIContext();
  saveKIContext({ ...ctx, ...fields });
}

// ═══ WORK RULES ═══
export function addWorkRule(rule: Omit<WorkRule, "id" | "createdAt" | "updatedAt">): WorkRule {
  const now = new Date().toISOString();
  const newRule: WorkRule = {
    ...rule,
    id: `wr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };
  const ctx = loadKIContext();
  ctx.workRules.unshift(newRule);
  saveKIContext(ctx);
  return newRule;
}

export function updateWorkRule(id: string, updates: Partial<WorkRule>): void {
  const ctx = loadKIContext();
  const idx = ctx.workRules.findIndex(r => r.id === id);
  if (idx === -1) return;
  ctx.workRules[idx] = { ...ctx.workRules[idx], ...updates, updatedAt: new Date().toISOString() };
  saveKIContext(ctx);
}

export function deleteWorkRule(id: string): void {
  const ctx = loadKIContext();
  ctx.workRules = ctx.workRules.filter(r => r.id !== id);
  saveKIContext(ctx);
}

export function toggleWorkRuleActive(id: string): void {
  const ctx = loadKIContext();
  const idx = ctx.workRules.findIndex(r => r.id === id);
  if (idx === -1) return;
  ctx.workRules[idx].active = !ctx.workRules[idx].active;
  ctx.workRules[idx].updatedAt = new Date().toISOString();
  saveKIContext(ctx);
}
