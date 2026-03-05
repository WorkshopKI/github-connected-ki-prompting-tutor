export type ThemeCategory = "muted-stone" | "muted-moss" | "elegant-serif" | "orange-muted";

export interface ThemePreset {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
}

export const themePresets: ThemePreset[] = [
  { id: "muted-stone", name: "Muted Stone", category: "muted-stone", description: "Original-Favorit: ruhige Stein-Töne, sehr neutral." },
  { id: "muted-stone-soft", name: "Muted Stone Soft", category: "muted-stone", description: "Heller, luftiger und besonders lesefreundlich." },
  { id: "muted-stone-contrast", name: "Muted Stone Contrast", category: "muted-stone", description: "Etwas mehr Kontrast für klarere Content-Hierarchie." },

  { id: "muted-moss", name: "Muted Moss", category: "muted-moss", description: "Original-Favorit: dezent-grüner, ruhiger Enterprise-Look." },
  { id: "muted-moss-light", name: "Muted Moss Light", category: "muted-moss", description: "Heller Moss-Look mit sehr subtilen Akzenten." },
  { id: "muted-moss-rich", name: "Muted Moss Rich", category: "muted-moss", description: "Etwas kräftigeres Moss für stärkere Buttons." },

  { id: "elegant-serif", name: "Elegant Serif", category: "elegant-serif", description: "Original-Favorit: hochwertige, ruhige Premium-Wirkung." },
  { id: "elegant-serif-warm", name: "Elegant Serif Warm", category: "elegant-serif", description: "Wärmeres Premium-Theme mit sanfter Eleganz." },
  { id: "elegant-serif-noir", name: "Elegant Serif Noir", category: "elegant-serif", description: "Dunkle elegante Variante für fokussierte Sessions." },

  { id: "orange-muted", name: "Orange Muted", category: "orange-muted", description: "Original-Orange, aber gedämpft und professioneller." },
];

export const themeCategories: { key: ThemeCategory; title: string }[] = [
  { key: "muted-stone", title: "Muted Stone – Varianten" },
  { key: "muted-moss", title: "Muted Moss – Varianten" },
  { key: "elegant-serif", title: "Elegant Serif – Varianten" },
  { key: "orange-muted", title: "Original Orange – Muted Variante" },
];
