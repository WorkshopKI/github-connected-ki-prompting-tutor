import { LS_KEYS } from "@/lib/constants";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import type { KIContext, WorkRule } from "@/types";

const DEFAULT_CONTEXT: KIContext = {
  profile: { abteilung: "", fachgebiet: "", aufgaben: "", stil: "" },
  workRules: [],
};

export function loadKIContext(): KIContext {
  return loadFromStorage<KIContext>(LS_KEYS.KI_CONTEXT, DEFAULT_CONTEXT);
}

export function saveKIContext(ctx: KIContext): void {
  saveToStorage(LS_KEYS.KI_CONTEXT, ctx);
}

export function updateKIContextProfile(
  field: keyof KIContext["profile"],
  value: string
): KIContext {
  const ctx = loadKIContext();
  ctx.profile[field] = value;
  saveKIContext(ctx);
  return ctx;
}

export function addWorkRule(text: string, domain: string): KIContext {
  const ctx = loadKIContext();
  const rule: WorkRule = {
    id: crypto.randomUUID(),
    text,
    domain,
    active: true,
    createdAt: new Date().toISOString(),
  };
  ctx.workRules.push(rule);
  saveKIContext(ctx);
  return ctx;
}

export function updateWorkRule(
  id: string,
  updates: Partial<Pick<WorkRule, "text" | "domain">>
): KIContext {
  const ctx = loadKIContext();
  const rule = ctx.workRules.find((r) => r.id === id);
  if (rule) {
    if (updates.text !== undefined) rule.text = updates.text;
    if (updates.domain !== undefined) rule.domain = updates.domain;
    saveKIContext(ctx);
  }
  return ctx;
}

export function deleteWorkRule(id: string): KIContext {
  const ctx = loadKIContext();
  ctx.workRules = ctx.workRules.filter((r) => r.id !== id);
  saveKIContext(ctx);
  return ctx;
}

export function toggleWorkRuleActive(id: string): KIContext {
  const ctx = loadKIContext();
  const rule = ctx.workRules.find((r) => r.id === id);
  if (rule) {
    rule.active = !rule.active;
    saveKIContext(ctx);
  }
  return ctx;
}
