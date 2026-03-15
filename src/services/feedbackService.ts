/* ── Feedback-Service (Dual-Mode) ──
 * Workshop-Modus: Supabase-Tabelle `feedback`
 * Standalone-Modus: localStorage `ps-feedback`
 */

import { LS_KEYS } from "@/lib/constants";
import { loadArrayFromStorage, saveToStorage, loadFromStorage } from "@/lib/storage";
import type { FeedbackItem, FeedbackConfig, FeedbackStatus } from "@/types";

function isWorkshopMode(): boolean {
  return localStorage.getItem(LS_KEYS.APP_MODE) === "workshop";
}

function generateId(): string {
  return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const DEFAULT_CONFIG: FeedbackConfig = {
  llm_model: "anthropic/claude-sonnet-4.6",
  proactive_triggers: true,
  max_chatbot_turns: 6,
};

// ═══ TICKETS ═══

export async function submitFeedback(
  data: Omit<FeedbackItem, "id" | "admin_status" | "created_at">
): Promise<FeedbackItem> {
  const item: FeedbackItem = {
    ...data,
    id: generateId(),
    admin_status: "neu",
    created_at: new Date().toISOString(),
  };

  if (isWorkshopMode()) {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("feedback" as any).insert({
      id: item.id,
      category: item.category,
      stars: item.stars ?? null,
      text: item.text,
      context: item.context as any,
      user_id: item.user_id,
      user_display_name: item.user_display_name ?? null,
      screen_ref: item.screen_ref ?? null,
      admin_status: item.admin_status,
    });
    if (error) throw new Error(`Feedback speichern fehlgeschlagen: ${error.message}`);
  } else {
    const items = loadArrayFromStorage<FeedbackItem>(LS_KEYS.FEEDBACK_ITEMS);
    items.unshift(item);
    saveToStorage(LS_KEYS.FEEDBACK_ITEMS, items);
  }

  return item;
}

export interface FeedbackFilters {
  category?: string;
  status?: FeedbackStatus;
  priority?: number;
}

export async function getFeedbackList(filters?: FeedbackFilters): Promise<FeedbackItem[]> {
  let items: FeedbackItem[];

  if (isWorkshopMode()) {
    const { supabase } = await import("@/integrations/supabase/client");
    let query = supabase.from("feedback" as any).select("*").order("created_at", { ascending: false });

    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.status) query = query.eq("admin_status", filters.status);
    if (filters?.priority) query = query.eq("admin_priority", filters.priority);

    const { data, error } = await query;
    if (error) throw new Error(`Feedback laden fehlgeschlagen: ${error.message}`);
    items = (data ?? []).map(mapFromRow);
  } else {
    items = loadArrayFromStorage<FeedbackItem>(LS_KEYS.FEEDBACK_ITEMS);
    if (filters?.category) items = items.filter((i) => i.category === filters.category);
    if (filters?.status) items = items.filter((i) => i.admin_status === filters.status);
    if (filters?.priority) items = items.filter((i) => i.admin_priority === filters.priority);
  }

  return items;
}

export async function updateFeedback(
  id: string,
  updates: Partial<Pick<FeedbackItem, "admin_status" | "admin_notes" | "admin_priority" | "generated_prompt" | "llm_summary" | "llm_classification" | "user_confirmed">>
): Promise<void> {
  if (isWorkshopMode()) {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("feedback" as any).update(updates).eq("id", id);
    if (error) throw new Error(`Feedback aktualisieren fehlgeschlagen: ${error.message}`);
  } else {
    const items = loadArrayFromStorage<FeedbackItem>(LS_KEYS.FEEDBACK_ITEMS);
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates };
      saveToStorage(LS_KEYS.FEEDBACK_ITEMS, items);
    }
  }
}

// ═══ CONFIG ═══

export async function loadFeedbackConfig(): Promise<FeedbackConfig> {
  if (isWorkshopMode()) {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.from("feedback_config" as any).select("*").eq("id", 1 as any).single();
    if (data) {
      const row = data as any;
      return {
        llm_model: row.llm_model ?? DEFAULT_CONFIG.llm_model,
        proactive_triggers: row.proactive_triggers ?? DEFAULT_CONFIG.proactive_triggers,
        max_chatbot_turns: row.max_chatbot_turns ?? DEFAULT_CONFIG.max_chatbot_turns,
      };
    }
  }
  return loadFromStorage<FeedbackConfig>(LS_KEYS.FEEDBACK_CONFIG, DEFAULT_CONFIG);
}

export async function saveFeedbackConfig(config: FeedbackConfig): Promise<void> {
  if (isWorkshopMode()) {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("feedback_config").update({
      llm_model: config.llm_model,
      proactive_triggers: config.proactive_triggers,
      max_chatbot_turns: config.max_chatbot_turns,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    if (error) throw new Error(`Config speichern fehlgeschlagen: ${error.message}`);
  } else {
    saveToStorage(LS_KEYS.FEEDBACK_CONFIG, config);
  }
}

// ═══ ROW MAPPING (Supabase snake_case → camelCase) ═══

function mapFromRow(row: Record<string, unknown>): FeedbackItem {
  return {
    id: row.id as string,
    category: row.category as FeedbackItem["category"],
    stars: row.stars as number | undefined,
    text: (row.text as string) ?? "",
    context: row.context as FeedbackItem["context"],
    llm_summary: row.llm_summary as string | undefined,
    llm_classification: row.llm_classification as FeedbackItem["llm_classification"],
    user_confirmed: row.user_confirmed as boolean | undefined,
    screen_ref: row.screen_ref as string | undefined,
    admin_status: (row.admin_status as FeedbackStatus) ?? "neu",
    admin_notes: row.admin_notes as string | undefined,
    admin_priority: row.admin_priority as number | undefined,
    generated_prompt: row.generated_prompt as string | undefined,
    user_id: row.user_id as string,
    user_display_name: row.user_display_name as string | undefined,
    created_at: row.created_at as string,
  };
}
