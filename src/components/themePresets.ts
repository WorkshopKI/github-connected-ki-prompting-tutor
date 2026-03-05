export interface ThemePreset {
  id: string;
  name: string;
  description: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: "muted-stone-contrast",
    name: "Stone",
    description: "Ruhiges Steingrau mit klarerer Hierarchie und Kontrast.",
  },
  {
    id: "muted-moss-light",
    name: "Moss",
    description: "Helles, nebliges Grün mit sehr subtilen Akzenten.",
  },
  {
    id: "silber",
    name: "Silber",
    description: "Kühles Aluminium-Theme in feinen Graustufen mit Sora.",
  },
];
