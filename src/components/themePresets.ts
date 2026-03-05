export type ThemeCategory = "minimalistisch" | "clean" | "wenig-farbe" | "elegant";

export interface ThemePreset {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
}

export const themePresets: ThemePreset[] = [
  { id: "minimal-pure", name: "Minimal Pure", category: "minimalistisch", description: "Nahezu monochrom, maximaler Weißraum." },
  { id: "minimal-grid", name: "Minimal Grid", category: "minimalistisch", description: "Feine Rasterlinien, sachlicher Editorial-Look." },
  { id: "minimal-ink", name: "Minimal Ink", category: "minimalistisch", description: "Klarer Schwarz-Weiß-Kontrast mit ruhigem Orange-Akzent." },
  { id: "clean-soft", name: "Clean Soft", category: "clean", description: "Sanfte Oberflächen und klare Kanten für Lernfokus." },
  { id: "clean-crisp", name: "Clean Crisp", category: "clean", description: "Hohe Lesbarkeit und präzise Konturen." },
  { id: "clean-air", name: "Clean Air", category: "clean", description: "Sehr luftiges Layout mit reduzierten Schatten." },
  { id: "muted-sand", name: "Muted Sand", category: "wenig-farbe", description: "Warmer Beigeton mit sehr dezenten Highlights." },
  { id: "muted-stone", name: "Muted Stone", category: "wenig-farbe", description: "Steingraue Fläche, ideal für lange Lesewege." },
  { id: "muted-moss", name: "Muted Moss", category: "wenig-farbe", description: "Sehr zurückhaltender Grünakzent (wie Screen2 inspiriert)." },
  { id: "elegant-serif", name: "Elegant Serif", category: "elegant", description: "Hochwertiger, ruhiger Premium-Look." },
  { id: "elegant-contrast", name: "Elegant Contrast", category: "elegant", description: "Edler Kontrast mit feinen Gold-ähnlichen Primärtönen." },
  { id: "elegant-noir", name: "Elegant Noir", category: "elegant", description: "Dunkel-eleganter Auftritt für fokussiertes Arbeiten." },
];

export const themeCategories: { key: ThemeCategory; title: string }[] = [
  { key: "minimalistisch", title: "Sehr minimalistisch" },
  { key: "clean", title: "Sehr clean" },
  { key: "wenig-farbe", title: "Ganz wenig Farbe" },
  { key: "elegant", title: "Elegant" },
];
