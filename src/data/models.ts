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
 * Standard-Modelle — empfohlene aktuelle Versionen für den Alltagsgebrauch.
 * Bei neuen Releases hier die Model-IDs aktualisieren.
 */
export const STANDARD_MODELS: ModelOption[] = [
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (latest)", isLatest: true, tier: "external" },
  { value: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6 (latest)", isLatest: true, tier: "external" },
  { value: "openai/gpt-5.2", label: "GPT-5.2 (latest)", isLatest: true, tier: "external" },
];

/**
 * Premium-Modelle — leistungsstärkere (und teurere) Modelle für anspruchsvolle Aufgaben.
 * Bei neuen Releases hier die Model-IDs aktualisieren.
 */
export const PREMIUM_MODELS: ModelOption[] = [
  { value: "anthropic/claude-opus-4.6", label: "Claude Opus 4.6 (latest)", isPremium: true, isLatest: true, tier: "external" },
  { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (latest)", isPremium: true, isLatest: true, tier: "external" },
];

/**
 * Open-Source-Modelle — leistungsfähige Modelle mit offenen Gewichten.
 */
export const OPEN_SOURCE_MODELS: ModelOption[] = [
  { value: "mistralai/mistral-large-2512", label: "Mistral Large 3 (2512)", isOpenSource: true, tier: "external" },
  { value: "openai/gpt-oss-120b", label: "GPT-OSS 120B", isOpenSource: true, tier: "external" },
  { value: "google/gemma-3-27b-it", label: "Gemma 3 27B", isOpenSource: true, tier: "external" },
  { value: "mistralai/mistral-small-3.1-24b-instruct", label: "Mistral Small 3.1 24B", isOpenSource: true, tier: "external" },
  { value: "allenai/olmo-3.1-32b-think", label: "OLMo 3.1 32B Think", isOpenSource: true, tier: "external" },
  { value: "qwen/qwen3.5-122b-a10b", label: "Qwen 3.5 122B-A10B", isOpenSource: true, tier: "external" },
  { value: "qwen/qwen3.5-397b-a17b", label: "Qwen 3.5 397B-A17B", isOpenSource: true, tier: "external" },
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
