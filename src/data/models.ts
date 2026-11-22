import type { ModelOption, AIRoutingConfig } from "@/types";
import { loadFromStorage, loadArrayFromStorage, saveToStorage } from "@/lib/storage";
import { LS_KEYS } from "@/lib/constants";

export type { ModelOption, AIRoutingConfig } from "@/types";

export const DEFAULT_AI_ROUTING: AIRoutingConfig = {
  internalEndpoint: "",
  internalModel: "",
  externalProvider: "Externer Anbieter",
  externalModel: "",
  confidentialRouting: "internal-only",
  internalRouting: "prefer-internal",
  openRouting: "prefer-external",
  warnOnExternal: true,
  auditLog: true,
};

export function loadAIRouting(): AIRoutingConfig {
  return loadFromStorage(LS_KEYS.AI_ROUTING, DEFAULT_AI_ROUTING);
}

export function saveAIRouting(config: AIRoutingConfig) {
  saveToStorage(LS_KEYS.AI_ROUTING, config);
}

/**
 * Modellklassen (Stand: 22.11.2026, IDs geprüft gegen openrouter.ai/api/v1/models).
 * Im Kurs werden Klassen gelehrt, nicht Namen: schnell & günstig · ausgewogen · stark.
 * Bei neuen Releases hier die Model-IDs aktualisieren und MODEL_COSTS in
 * supabase/functions/llm-proxy/index.ts mitziehen.
 */

/** Schnell & günstig — Standard für Übungen und Alltagsaufgaben. */
export const STANDARD_MODELS: ModelOption[] = [
  { value: "openai/gpt-6-luna", label: "GPT-6 Luna (schnell)", isLatest: true, tier: "external" },
  { value: "anthropic/claude-haiku-5.5", label: "Claude Haiku 5.5 (schnell)", isLatest: true, tier: "external" },
  { value: "google/gemini-3.8-flash", label: "Gemini 3.8 Flash (schnell)", isLatest: true, tier: "external" },
];

/** Ausgewogen und stark — für anspruchsvolle Aufgaben, Modellvergleich und Judge. */
export const PREMIUM_MODELS: ModelOption[] = [
  { value: "openai/gpt-6.2-sol", label: "GPT-6.2 Sol (ausgewogen)", isPremium: true, isLatest: true, tier: "external" },
  { value: "anthropic/claude-sonnet-5.5", label: "Claude Sonnet 5.5 (ausgewogen)", isPremium: true, isLatest: true, tier: "external" },
  { value: "google/gemini-4-hydrogen", label: "Gemini 4 Hydrogen (ausgewogen)", isPremium: true, isLatest: true, tier: "external" },
  { value: "mistralai/mistral-medium-3-5", label: "Mistral Medium 3.5 (ausgewogen, EU)", isPremium: true, tier: "external" },
  { value: "openai/gpt-6.2-astra", label: "GPT-6.2 Astra (stark)", isPremium: true, isLatest: true, tier: "external" },
  { value: "anthropic/claude-opus-5.5", label: "Claude Opus 5.5 (stark)", isPremium: true, isLatest: true, tier: "external" },
  { value: "google/gemini-4-neon", label: "Gemini 4 Neon (stark)", isPremium: true, isLatest: true, tier: "external" },
];

/** Offene und europäische Modelle — günstig, teils selbst betreibbar. */
export const OPEN_SOURCE_MODELS: ModelOption[] = [
  { value: "openai/gpt-oss-120b", label: "GPT-OSS 120B (Open Weights)", isOpenSource: true, tier: "external" },
  { value: "mistralai/mistral-large-4-0", label: "Mistral Large 4 (Open Weights, EU)", isOpenSource: true, tier: "external" },
  { value: "mistralai/mistral-small-2603", label: "Mistral Small 4 (EU)", isOpenSource: true, tier: "external" },
  { value: "deepseek/deepseek-v4.1-flash", label: "DeepSeek V4.1 Flash", isOpenSource: true, tier: "external" },
];

export { DEFAULT_MODEL } from "@/lib/constants";

const LS_CUSTOM_MODELS = LS_KEYS.CUSTOM_MODELS;

export function loadCustomModels(): ModelOption[] {
  return loadArrayFromStorage<ModelOption>(LS_CUSTOM_MODELS);
}

export function saveCustomModels(models: ModelOption[]): void {
  saveToStorage(LS_CUSTOM_MODELS, models);
}

export function addCustomModel(modelId: string): ModelOption[] {
  const current = loadCustomModels();
  const allKnown = [...STANDARD_MODELS, ...PREMIUM_MODELS, ...OPEN_SOURCE_MODELS, ...current];
  if (allKnown.some((m) => m.value === modelId)) return current;

  const label = modelId.includes("/")
    ? modelId.split("/").slice(1).join("/").replace(/[-_]/g, " ")
    : modelId;
  const updated = [...current, { value: modelId, label, isCustom: true }];
  saveCustomModels(updated);
  return updated;
}

export function removeCustomModel(modelId: string): ModelOption[] {
  const updated = loadCustomModels().filter((m) => m.value !== modelId);
  saveCustomModels(updated);
  return updated;
}

/** Alle verfügbaren Modelle: Standard + Premium + Eigene */
export function getAllModels(): ModelOption[] {
  return [...STANDARD_MODELS, ...PREMIUM_MODELS, ...OPEN_SOURCE_MODELS, ...loadCustomModels()];
}

/** Model-ID zu Display-Label auflösen */
export function getModelLabel(value: string): string {
  return getAllModels().find((m) => m.value === value)?.label ?? value;
}
