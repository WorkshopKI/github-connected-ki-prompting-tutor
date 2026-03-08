/* ── Zentralisierte Konstanten ──
 * Alle Magic Strings an einem Ort, damit Coding-Agenten
 * konsistent arbeiten können.
 */

/* ── Route-Pfade ── */
export const ROUTES = {
  HOME: "/",
  LIBRARY: "/library",
  PLAYGROUND: "/playground",
  ONBOARDING: "/onboarding",
  SETTINGS: "/settings",
  LOGIN: "/login",
  ADMIN_PARTICIPANTS: "/admin/teilnehmer",
} as const;

/* ── localStorage Keys ── */
export const LS_KEYS = {
  ORG_SCOPE: "org_scope",
  THINKING_ENABLED: "thinking_enabled",
  CUSTOM_MODELS: "custom_openrouter_models",
  AI_ROUTING: "ai_routing_config",
  MY_SKILLS: "my_skills",
  PROMPT_RATINGS: "prompt_ratings",
  CONVERSATIONS: "playground_conversations",
  ACTIVE_CONVERSATION: "playground_active_id",
  DAILY_CHALLENGE: "daily_challenge_history",
  NUDGE_DISMISSED: "iteration_nudge_dismissed",
  GUEST_BANNER_DISMISSED: "guest_banner_dismissed",
  PLATFORM_SETTINGS: "platform_settings",
  COMPLIANCE_SETTINGS: "compliance_settings",
  PROGRESS: "user_progress_v2",
  LEGACY_HISTORY: "playground_history",
} as const;

/* ── Badge-Farben für Prompt-Level ── */
export const LEVEL_BADGE_COLORS: Record<string, string> = {
  alltag: "bg-primary/10 text-primary",
  beruf: "bg-primary/10 text-primary",
  websuche: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-400",
  research: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-400",
  blueprint: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  organisation: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

/* ── Default-Modell ── */
export const DEFAULT_MODEL = "google/gemini-3-flash-preview";
