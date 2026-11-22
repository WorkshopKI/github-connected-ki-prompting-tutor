import { type ComponentType, type LazyExoticComponent } from "react";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

/* ── Register der Erklär-Animationen ──
 * Jede Animation ist ein eigenständiger Baustein unter /erklaert/<slug>:
 * ohne Login, ohne Live-KI, Schritt-Steuerung per Pfeiltaste.
 * Nummern entsprechen der Planung im Überarbeitungsdokument.
 */

export interface ErklaerEintrag {
  slug: string;
  nr: number;
  titel: string;
  frage: string;
  gruppe: "Wie KI rechnet" | "Sicher arbeiten" | "Arbeiten mit Agenten";
  komponente?: LazyExoticComponent<ComponentType>;
}

export const ERKLAERT: ErklaerEintrag[] = [
  { slug: "naechstes-wort", nr: 1, titel: "Das nächste Wort", frage: "Wie schreibt ein Sprachmodell?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/NaechstesWort")) },
  { slug: "tokens", nr: 2, titel: "Tokens", frage: "Wie sieht ein Modell Text?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/Tokens")) },
  { slug: "aufmerksamkeit", nr: 3, titel: "Aufmerksamkeit", frage: "Woher weiß das Modell, welche „Bank“ gemeint ist?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/Aufmerksamkeit")) },
  { slug: "kontext-stapel", nr: 11, titel: "Was das Modell sieht", frage: "Was liest die KI außer meiner Frage?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/KontextStapel")) },
  { slug: "halluzination", nr: 12, titel: "Halluzination", frage: "Warum klingt auch Falsches so überzeugend?", gruppe: "Sicher arbeiten", komponente: lazy(() => import("@/components/erklaert/animations/Halluzination")) },
  { slug: "daten", nr: 15, titel: "Wohin gehen meine Daten?", frage: "Was passiert mit dem, was ich eintippe?", gruppe: "Sicher arbeiten", komponente: lazy(() => import("@/components/erklaert/animations/DatenWeg")) },
  { slug: "agenten-schleife", nr: 9, titel: "Agenten und Prompt-Injection", frage: "Wie arbeitet ein Agent, und wie kann man ihn austricksen?", gruppe: "Arbeiten mit Agenten", komponente: lazy(() => import("@/components/erklaert/animations/AgentenSchleife")) },
  { slug: "temperatur", nr: 4, titel: "Temperatur", frage: "Warum gibt es verschiedene Antworten auf dieselbe Frage?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/Temperatur")) },
  { slug: "training", nr: 5, titel: "Training in Phasen", frage: "Wie wird aus Text ein Assistent?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/Training")) },
  { slug: "kontextfenster", nr: 6, titel: "Kontextfenster und Gedächtnis", frage: "Was vergisst die KI?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/Kontextfenster")) },
  { slug: "reasoning", nr: 7, titel: "Reasoning", frage: "Was passiert, wenn ein Modell „nachdenkt“?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/Reasoning")) },
  { slug: "websuche", nr: 8, titel: "Websuche und Quellen", frage: "Wie kommt die KI an aktuelles Wissen?", gruppe: "Sicher arbeiten", komponente: lazy(() => import("@/components/erklaert/animations/Websuche")) },
  { slug: "diffusion", nr: 10, titel: "Wie Bilder entstehen", frage: "Wie wird aus Rauschen ein Bild?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/Diffusion")) },
  { slug: "bedeutungsraum", nr: 13, titel: "Bedeutungsraum", frage: "Wie ordnet ein Modell Begriffe?", gruppe: "Wie KI rechnet", komponente: lazy(() => import("@/components/erklaert/animations/Bedeutungsraum")) },
  { slug: "bias", nr: 16, titel: "Verzerrungen", frage: "Warum sind KI-Bilder von Ärzten meist Männer?", gruppe: "Sicher arbeiten", komponente: lazy(() => import("@/components/erklaert/animations/Bias")) },
  { slug: "kennzeichnung", nr: 17, titel: "KI-Inhalte erkennen", frage: "Wie erkennt man KI-Inhalte, und was muss gekennzeichnet werden?", gruppe: "Sicher arbeiten", komponente: lazy(() => import("@/components/erklaert/animations/Kennzeichnung")) },
];

export const erklaertBySlug = (slug: string) => ERKLAERT.find((e) => e.slug === slug);
