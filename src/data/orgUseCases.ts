export interface OrgUseCase {
  title: string;
  department: "HR" | "Vertrieb" | "Support" | "Produkt" | "Legal";
  role: "Mitarbeitende" | "Teamlead" | "Admin";
  risk: "niedrig" | "mittel" | "hoch";
  goal: string;
  template: string;
  qualityCriteria: string[];
}

export const orgUseCases: OrgUseCase[] = [
  {
    title: "Interview-Leitfaden vorbereiten",
    department: "HR",
    role: "Mitarbeitende",
    risk: "mittel",
    goal: "Ein strukturierter, fairer Leitfaden für Erstgespräche.",
    template: "Erstelle einen Interview-Leitfaden für die Rolle {{Rolle}}. Fokus: fachliche Kompetenzen, Kultur-Fit, Red Flags. Gib Fragen, Follow-ups und Bewertungsraster.",
    qualityCriteria: ["Fragen sind bias-arm", "Bewertungsraster vorhanden", "Max. 45 Minuten Ablauf"],
  },
  {
    title: "Angebotsmail personalisieren",
    department: "Vertrieb",
    role: "Mitarbeitende",
    risk: "niedrig",
    goal: "Personalisierte Erstansprache mit klarem Nutzenversprechen.",
    template: "Formuliere eine Angebotsmail für {{Branche}}. Input: {{Pain Points}}, {{Produktnutzen}}, {{Call to Action}}. Ton: professionell, präzise, max. 150 Wörter.",
    qualityCriteria: ["Klarer CTA", "Personalisierung sichtbar", "Keine unbewiesenen Claims"],
  },
  {
    title: "Support-Antworten standardisieren",
    department: "Support",
    role: "Teamlead",
    risk: "mittel",
    goal: "Einheitliche Antwortqualität für wiederkehrende Tickets.",
    template: "Erzeuge 5 Antwortvorlagen für das Thema {{Ticket-Kategorie}}. Struktur: Verständnis zeigen, Lösungsschritte, Rückfrage, Abschluss. Sprache: freundlich, lösungsorientiert.",
    qualityCriteria: ["Empathischer Einstieg", "Schritt-für-Schritt-Lösung", "Klare Abschlussfrage"],
  },
  {
    title: "Release-Zusammenfassung für Stakeholder",
    department: "Produkt",
    role: "Teamlead",
    risk: "niedrig",
    goal: "Kompakte Release Notes mit Business-Relevanz.",
    template: "Fasse das Release {{Version}} zusammen. Teile in: Was neu ist, Nutzen für Kunden, Risiken, offene Punkte, nächste Schritte. Zielgruppe: Management.",
    qualityCriteria: ["Business Impact enthalten", "Risiken transparent", "Nächste Schritte konkret"],
  },
  {
    title: "Vertragsklauseln vorstrukturieren",
    department: "Legal",
    role: "Admin",
    risk: "hoch",
    goal: "Erste Entwurfsstruktur mit Compliance-Hinweisen.",
    template: "Erstelle eine Struktur für einen {{Vertragstyp}} mit den Abschnitten: Laufzeit, Leistungsumfang, Haftung, Datenschutz, Kündigung. Markiere juristisch sensible Stellen explizit.",
    qualityCriteria: ["Keine Rechtsberatung behaupten", "Sensible Klauseln markiert", "Review-Hinweis an Legal"],
  },
];
