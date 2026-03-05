export type ThemeCategory = "favoriten" | "neu";

export interface ThemePreset {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: "muted-stone-contrast",
    name: "Muted Stone Contrast",
    category: "favoriten",
    description: "Ruhiges Steingrau mit klarerer Hierarchie und Kontrast.",
  },
  {
    id: "muted-moss-light",
    name: "Muted Moss Light",
    category: "favoriten",
    description: "Helles, nebliges Grün mit sehr subtilen Akzenten.",
  },
  {
    id: "silber",
    name: "Silber",
    category: "neu",
    description: "Kühles Aluminium-Theme in feinen Graustufen mit Sora.",
  },
];

export const themeCategories: { key: ThemeCategory; title: string }[] = [
  { key: "favoriten", title: "Deine Favoriten" },
  { key: "neu", title: "Neue Varianten" },
];
