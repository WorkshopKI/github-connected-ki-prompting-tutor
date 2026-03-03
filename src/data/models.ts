export interface ModelOption {
  value: string;
  label: string;
  isLatest?: boolean;
  isCustom?: boolean;
}

/** Spezifische Versionen (Standard-Auswahl) */
export const BUILTIN_MODELS: ModelOption[] = [
  { value: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
  { value: "openai/gpt-5.2", label: "GPT-5.2" },
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (Standard)" },
  { value: "anthropic/claude-opus-4.6", label: "Claude Opus 4.6" },
  { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" },
];

/** "Latest" Aliase — OpenRouter löst diese auf die aktuelle Version auf */
export const LATEST_MODELS: ModelOption[] = [
  { value: "openai/chatgpt-4o-latest", label: "ChatGPT (latest)", isLatest: true },
  { value: "anthropic/claude-sonnet-4", label: "Claude Sonnet (latest)", isLatest: true },
  { value: "anthropic/claude-opus-4", label: "Claude Opus (latest)", isLatest: true },
  { value: "google/gemini-2.5-flash", label: "Gemini Flash (latest)", isLatest: true },
  { value: "google/gemini-2.5-pro", label: "Gemini Pro (latest)", isLatest: true },
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
  const allKnown = [...BUILTIN_MODELS, ...LATEST_MODELS, ...current];
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

/** Alle verfügbaren Modelle: Standard + Latest + Eigene */
export function getAllModels(): ModelOption[] {
  return [...BUILTIN_MODELS, ...LATEST_MODELS, ...loadCustomModels()];
}

/** Model-ID zu Display-Label auflösen */
export function getModelLabel(value: string): string {
  return getAllModels().find((m) => m.value === value)?.label ?? value;
}
