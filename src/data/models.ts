export interface ModelOption {
  value: string;
  label: string;
  isLatest?: boolean;
  isPremium?: boolean;
  isCustom?: boolean;
}

/**
 * Standard-Modelle — empfohlene aktuelle Versionen für den Alltagsgebrauch.
 * Bei neuen Releases hier die Model-IDs aktualisieren.
 */
export const STANDARD_MODELS: ModelOption[] = [
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (latest)", isLatest: true },
  { value: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6 (latest)", isLatest: true },
  { value: "openai/gpt-5.2", label: "GPT-5.2 (latest)", isLatest: true },
];

/**
 * Premium-Modelle — leistungsstärkere (und teurere) Modelle für anspruchsvolle Aufgaben.
 * Bei neuen Releases hier die Model-IDs aktualisieren.
 */
export const PREMIUM_MODELS: ModelOption[] = [
  { value: "anthropic/claude-opus-4.6", label: "Claude Opus 4.6 (latest)", isPremium: true, isLatest: true },
  { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (latest)", isPremium: true, isLatest: true },
];

export const DEFAULT_MODEL = "google/gemini-3-flash-preview";

const LS_CUSTOM_MODELS = "custom_openrouter_models";

export function loadCustomModels(): ModelOption[] {
  try {
    const raw = localStorage.getItem(LS_CUSTOM_MODELS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomModels(models: ModelOption[]): void {
  localStorage.setItem(LS_CUSTOM_MODELS, JSON.stringify(models));
}

export function addCustomModel(modelId: string): ModelOption[] {
  const current = loadCustomModels();
  const allKnown = [...STANDARD_MODELS, ...PREMIUM_MODELS, ...current];
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
  return [...STANDARD_MODELS, ...PREMIUM_MODELS, ...loadCustomModels()];
}

/** Model-ID zu Display-Label auflösen */
export function getModelLabel(value: string): string {
  return getAllModels().find((m) => m.value === value)?.label ?? value;
}
