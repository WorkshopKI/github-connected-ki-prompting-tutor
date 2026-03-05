import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Globe, Search, ExternalLink, ChevronDown, ChevronUp, Shield, Clock, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PromptConstraints {
  musts: string[];
  mustNots: string[];
  escalationTriggers: string[];
}

interface PromptItem {
  category: string;
  title: string;
  prompt: string;
  needsWeb?: boolean;
  level?: "alltag" | "beruf" | "websuche" | "research" | "blueprint";
  type?: "prompt" | "blueprint";
  constraints?: PromptConstraints;
  acceptanceCriteria?: string;
  estimatedAgentTime?: string;
  requiredTools?: string[];
}

const promptLibrary: PromptItem[] = [
  // Alltag - Rezepte & Kochen
  {
    category: "Rezepte & Kochen",
    title: "Vegetarisches Rezept",
    prompt: "Suche ein Rezept für ein vegetarisches Abendessen für 4 Personen mit Tomaten, Pasta und Zwiebeln, die ich zu Hause habe.",
    level: "alltag"
  },
  
  // Alltag - Reisen & Urlaub
  {
    category: "Reisen & Urlaub",
    title: "Italien-Reiseroute",
    prompt: "Erstelle eine Reiseroute für einen 7-tägigen Urlaub in Italien mit den Schwerpunkten Kultur und Natur, maximal 2 Stunden Autofahrt pro Tag.",
    level: "alltag"
  },
  {
    category: "Reisen & Urlaub",
    title: "Japan Top 5",
    prompt: "Was sind die Top 5 'muss man gesehen haben' Orte in Japan für Erstbesucher?",
    level: "alltag"
  },
  
  // Alltag - Geschenke
  {
    category: "Geschenke",
    title: "Geburtstagsgeschenk Mutter",
    prompt: "Finde ein Geschenk für meine Mutter zum Geburtstag, das ihr gefällt und nicht mehr als 50 Euro kostet.",
    level: "alltag"
  },
  
  // Alltag - Gesundheit & Fitness
  {
    category: "Gesundheit & Fitness",
    title: "Home-Workout Plan",
    prompt: "Erstelle einen 30-minütigen Trainingsplan für zu Hause ohne Ausrüstung, der sich auf Rücken und Körpermitte konzentriert.",
    level: "alltag"
  },
  
  // Alltag - Hobbys
  {
    category: "Hobbys & Freizeit",
    title: "Bonsai-Pflege",
    prompt: "Wie pflege ich einen Bonsaibaum richtig? Gib mir eine Schritt-für-Schritt-Anleitung mit Bewässerung, Licht und Schnitt.",
    level: "alltag"
  },
  {
    category: "Hobbys & Freizeit",
    title: "Wohnzimmer streichen",
    prompt: "Erstelle eine Schritt-für-Schritt-Anleitung zum Streichen meines Wohnzimmers, inklusive Materialien und Zeitaufwand.",
    level: "alltag"
  },
  {
    category: "Hobbys & Freizeit",
    title: "Familientreffen Aktivitäten",
    prompt: "Vorschläge für unterhaltsame Aktivitäten bei einem Familientreffen mit Kindern zwischen 5 und 12 Jahren.",
    level: "alltag"
  },
  
  // Alltag - Finanzen
  {
    category: "Finanzen & Budget",
    title: "Haushaltsbudget",
    prompt: "Erstelle einen einfachen Budgetierungsplan für einen 2-Personen-Haushalt mit 3.000€ Nettoeinkommen pro Monat.",
    level: "alltag"
  },
  
  // Alltag - Sprachen
  {
    category: "Sprachen & Lernen",
    title: "Spanisch Lernplan",
    prompt: "Wie kann ich Grundkenntnisse in Spanisch in einem Monat erwerben? Erstelle einen strukturierten Lernplan mit täglichen Übungen.",
    level: "alltag"
  },
  
  // Alltag - Haustiere
  {
    category: "Haustiere",
    title: "Hundetraining",
    prompt: "Wie gewöhne ich meinen Hund an neue Menschen? Gib mir eine Trainingsmethode mit konkreten Schritten.",
    level: "alltag"
  },
  
  // Beruf - Marketing
  {
    category: "Marketing",
    title: "Kreative Kampagnenideen",
    prompt: "Liste mir 10 kreative und unkonventionelle Ideen für eine Social-Media-Marketing-Kampagne für ein neues Bio-Erfrischungsgetränk.",
    level: "beruf"
  },
  {
    category: "Marketing",
    title: "Digitale Marketing-Trends",
    prompt: "Was sind die neuesten Trends in der digitalen Marketingbranche? Nutze die Websuche für aktuelle Informationen aus 2024-2025.",
    needsWeb: true,
    level: "beruf"
  },
  
  // Beruf - Meetings & Kommunikation
  {
    category: "Meetings & Kommunikation",
    title: "Meeting-Agenda",
    prompt: "Erstelle eine effektive Agenda für ein Team-Meeting zum Thema 'Quartalsplanung Q2' mit Zeitangaben für jeden Punkt (insgesamt 90 Minuten).",
    level: "beruf"
  },
  {
    category: "Meetings & Kommunikation",
    title: "Konstruktives Feedback",
    prompt: "Hilf mir konstruktives Feedback für einen Kollegen zu formulieren. Er liefert gute Arbeit, verpasst aber oft Deadlines. Der Ton soll wertschätzend, aber klar sein.",
    level: "beruf"
  },
  
  // Beruf - Projektmanagement
  {
    category: "Projektmanagement",
    title: "Statusbericht-Vorlage",
    prompt: "Erstelle mir eine Vorlage für einen wöchentlichen Projektstatusbericht mit den Abschnitten: Fortschritt, Herausforderungen, nächste Schritte, Budget-Status.",
    level: "beruf"
  },
  
  // Beruf - Sicherheit
  {
    category: "IT & Sicherheit",
    title: "Datensicherheit-Checkliste",
    prompt: "Erstelle eine Checkliste für die Überprüfung der Datensicherheit in meinem kleinen Unternehmen mit 10 Mitarbeitern.",
    level: "beruf"
  },
  
  // Beruf - Präsentation
  {
    category: "Präsentation & Skills",
    title: "Präsentationsfähigkeiten",
    prompt: "Wie kann ich meine Präsentationsfähigkeiten verbessern? Gib mir 5 konkrete Techniken mit Übungen.",
    level: "beruf"
  },
  
  // Beruf - HR & Team
  {
    category: "HR & Team",
    title: "Konfliktmanagement",
    prompt: "Wie gehe ich mit einem Konflikt zwischen zwei Teammitgliedern um? Erstelle einen Leitfaden für ein Mediationsgespräch.",
    level: "beruf"
  },
  {
    category: "HR & Team",
    title: "Virtuelles Onboarding",
    prompt: "Wie führe ich ein virtuelles Onboarding für neue Mitarbeiter durch? Erstelle einen 2-Wochen-Plan.",
    level: "beruf"
  },
  
  // Beruf - Recht
  {
    category: "Recht & Verträge",
    title: "Freelancer-Vertrag",
    prompt: "Was muss ich beachten, wenn ich einen Vertrag für Freelancer aufsetze? Liste die wichtigsten Klauseln auf.",
    level: "beruf"
  },
  
  // Websuche - News & Aktuelles
  {
    category: "News & Aktuelles",
    title: "Tagesnachrichten",
    prompt: "Nutze die Websuche und liste die drei wichtigsten deutschsprachigen Nachrichten des heutigen Tages (Kurzfassung + Quelle).",
    needsWeb: true,
    level: "websuche"
  },
  {
    category: "News & Aktuelles",
    title: "Inflationszahlen",
    prompt: "Bitte verwende die Websuche, um die neuesten Inflationszahlen für Deutschland (letzter verfügbarer Monat) zu finden, nenne Quelle und Veröffentlichungsdatum.",
    needsWeb: true,
    level: "websuche"
  },
  
  // Websuche - Lokales
  {
    category: "Lokale Recherche",
    title: "Restaurants finden",
    prompt: "Recherchiere per Websuche drei gut bewertete italienische Restaurants in Köln – jeweils mit Adresse, Preisspanne und einem aktuellen Gäste-Kommentar.",
    needsWeb: true,
    level: "websuche"
  },
  {
    category: "Lokale Recherche",
    title: "Veranstaltungen",
    prompt: "Welche kulturellen Highlights finden nächstes Wochenende (Fr–So) in Berlin statt? Websuche nutzen, Links angeben.",
    needsWeb: true,
    level: "websuche"
  },
  
  // Websuche - Sport
  {
    category: "Sport",
    title: "Bundesliga-Tabelle",
    prompt: "Mit Websuche: Wer führt aktuell die Bundesliga-Tabelle an? Gib mir die Top 5 Teams + Punkte und Tordifferenz.",
    needsWeb: true,
    level: "websuche"
  },
  
  // Websuche - Shopping
  {
    category: "Shopping & Preise",
    title: "Preisvergleich Smartphone",
    prompt: "Suche im Web nach dem günstigsten Online-Preis für ein Samsung Galaxy A55 (128 GB) und zeige die drei besten Angebote mit Datum des Angebots.",
    needsWeb: true,
    level: "websuche"
  },
  
  // Deep Research - Produktvergleiche
  {
    category: "Produktvergleiche",
    title: "E-Auto Vergleich",
    prompt: "Erstelle einen detaillierten Vergleich zwischen dem VW ID.3, Tesla Model 3 und Renault Megane E-Tech. Berücksichtige: Reichweite im Winter, Gesamtkosten über 5 Jahre (Anschaffung, Versicherung, Wartung) und prognostizierten Restwert. Gib das Ergebnis als übersichtliche Tabelle aus und erstelle eine gewichtete Entscheidungsmatrix (Kosten 40%, Reichweite 30%, Restwert 30%). Begründe deine finale Empfehlung.",
    level: "research"
  },
  
  // Deep Research - Studien
  {
    category: "Vergleichsstudien",
    title: "Windkraft Europa",
    prompt: "Vergleiche Offshore- mit Onshore-Windkraft in Europa hinsichtlich Kosten/MWh, Umweltauswirkungen, Genehmigungsdauer und Akzeptanz in der Bevölkerung. Strukturiere als Tabelle, diskutiere Vor- und Nachteile in Fließtext und zitiere mindestens vier aktuelle Studien (Jahr ≥ 2022).",
    needsWeb: true,
    level: "research"
  },
  
  // Deep Research - Strategien
  {
    category: "Strategiepapiere",
    title: "Digitalisierung Arztpraxis",
    prompt: "Erstelle ein detailliertes Konzept (ca. 1.200 Wörter) für die Digitalisierung der Patientenakten in einer mittelgroßen Arztpraxis: Stakeholder-Analyse, Zeitplan, Kostenabschätzung, Change-Management-Maßnahmen, Risiken & Gegenmaßnahmen. Füge am Ende eine Prioritäten-Roadmap in Stichpunkten an.",
    level: "research"
  },
  
  // Deep Research - Marktanalysen
  {
    category: "Marktanalysen",
    title: "Fleischersatzprodukte",
    prompt: "Analysiere den deutschen Markt für pflanzliche Fleischersatzprodukte: Marktgröße 2024, Wachstumsprognose bis 2028, wichtigste Player, Zielgruppen-Segmentierung, Preissensitivität. Stelle die Ergebnisse in einem Executive Summary (max. 500 Wörter) + detaillierte Tabelle dar.",
    needsWeb: true,
    level: "research"
  },
  
  // Zusätzliche Alltags-Prompts
  {
    category: "Mode & Style",
    title: "Outfit-Beratung",
    prompt: "Ich habe ein Business-Meeting in einer kreativen Agentur. Wie sollte ich mich kleiden? Gib mir 3 Outfit-Vorschläge für Frauen/Männer.",
    level: "alltag"
  },
  {
    category: "Technologie",
    title: "Smartphone-Kaufberatung",
    prompt: "Ich suche ein neues Smartphone für maximal 500€. Wichtig sind mir gute Kamera und lange Akkulaufzeit. Welche 3 Modelle empfiehlst du?",
    level: "alltag"
  },
  {
    category: "Bildung",
    title: "Online-Kurs finden",
    prompt: "Ich möchte meine Excel-Kenntnisse verbessern. Welche kostenlosen Online-Kurse kannst du empfehlen? Nutze Websuche für aktuelle Angebote.",
    needsWeb: true,
    level: "alltag"
  },
  {
    category: "Auto & Mobilität",
    title: "Gebrauchtwagen-Check",
    prompt: "Worauf muss ich beim Kauf eines Gebrauchtwagens achten? Erstelle eine Checkliste für die Besichtigung.",
    level: "alltag"
  },
  {
    category: "Wohnen",
    title: "Energiespartipps",
    prompt: "Wie kann ich in meiner Wohnung Heizkosten sparen? Gib mir 10 praktische Tipps mit geschätztem Einsparpotenzial.",
    level: "alltag"
  },
  
  // Zusätzliche Berufs-Prompts
  {
    category: "Content Creation",
    title: "LinkedIn-Post",
    prompt: "Schreibe einen LinkedIn-Post über die Bedeutung von Work-Life-Balance. Max. 1300 Zeichen, professionell aber persönlich.",
    level: "beruf"
  },
  {
    category: "Zeitmanagement",
    title: "Produktivitäts-System",
    prompt: "Erstelle einen Tagesplan für maximale Produktivität. Ich arbeite 8 Stunden und habe oft viele Meetings. Berücksichtige Pausen und Deep Work Phasen.",
    level: "beruf"
  },
  {
    category: "Kundenkommunikation",
    title: "Beschwerdemail",
    prompt: "Formuliere eine professionelle Antwort auf eine Kundenbeschwerde. Der Kunde ist unzufrieden mit der Lieferzeit. Zeige Verständnis und biete eine Lösung.",
    level: "beruf"
  },
  {
    category: "Vertrieb",
    title: "Sales Pitch",
    prompt: "Erstelle einen 2-minütigen Elevator Pitch für eine neue SaaS-Lösung im Bereich Projektmanagement. Zielgruppe: kleine bis mittelständische Unternehmen.",
    level: "beruf"
  },
  {
    category: "Innovation",
    title: "Brainstorming-Session",
    prompt: "Moderiere eine virtuelle Brainstorming-Session für die Entwicklung eines neuen Produktfeatures. Gib mir Struktur, Methoden und Zeitplan für 60 Minuten.",
    level: "beruf"
  },
  
  // Zusätzliche Websuche-Prompts
  {
    category: "Gesundheit",
    title: "Gesundheitsnews",
    prompt: "Nutze Websuche: Was sind die neuesten Erkenntnisse zu gesunder Ernährung aus 2024? Fasse 3 wichtige Studien zusammen.",
    needsWeb: true,
    level: "websuche"
  },
  {
    category: "Technologie-News",
    title: "KI-Entwicklungen",
    prompt: "Recherchiere die wichtigsten KI-Entwicklungen der letzten 3 Monate. Websuche nutzen und mindestens 5 Entwicklungen mit Quelle nennen.",
    needsWeb: true,
    level: "websuche"
  },
  {
    category: "Wirtschaft",
    title: "Börsen-Update",
    prompt: "Mit Websuche: Wie haben sich die wichtigsten deutschen Aktienindizes (DAX, MDAX) heute entwickelt? Gib mir die Top 3 Gewinner und Verlierer.",
    needsWeb: true,
    level: "websuche"
  },
  {
    category: "Immobilien",
    title: "Mietpreise",
    prompt: "Recherchiere per Websuche die durchschnittlichen Mietpreise für eine 2-Zimmer-Wohnung in München, Hamburg und Berlin. Vergleiche die Städte.",
    needsWeb: true,
    level: "websuche"
  },
  
  // Zusätzliche Research-Prompts
  {
    category: "Bildungspolitik",
    title: "Digitale Bildung",
    prompt: "Analysiere den Stand der digitalen Bildung in deutschen Schulen im internationalen Vergleich. Berücksichtige: Ausstattung, Lehrerfortbildung, Lernplattformen. Nutze aktuelle Studien (≥2023) und erstelle einen Bericht mit Handlungsempfehlungen (1000 Wörter).",
    needsWeb: true,
    level: "research"
  },
  {
    category: "Nachhaltigkeit",
    title: "CO2-Bilanz Unternehmen",
    prompt: "Erstelle einen detaillierten Leitfaden zur Berechnung und Reduzierung der CO2-Bilanz für ein mittelständisches Produktionsunternehmen (100 Mitarbeiter). Inkl. Methodik, Tools, Quick Wins und Langfriststrategie.",
    level: "research"
  },
  {
    category: "Gesundheitswesen",
    title: "Telemedizin-Strategie",
    prompt: "Entwickle ein Konzept für die Implementierung von Telemedizin in einer Hausarztpraxis: Technische Anforderungen, rechtliche Aspekte, Patientenakzeptanz, Abrechnung, Risiken. Ca. 1500 Wörter mit konkreter Umsetzungsroadmap.",
    level: "research"
  },
  {
    category: "Stadtentwicklung",
    title: "Smart City Konzept",
    prompt: "Entwirf ein Smart City Konzept für eine deutsche Mittelstadt (50.000 Einwohner) mit Fokus auf: Mobilität, Energie, Bürgerbeteiligung. Recherchiere Best Practices aus Europa, erstelle Phasenplan (5 Jahre) und Kostenübersicht.",
    needsWeb: true,
    level: "research"
  },

  // Deep Research - Wissenschaftliche Recherche
  {
    category: "Wissenschaftliche Recherche",
    title: "Forschungsstand KI in Bildung",
    prompt: "Recherchiere den aktuellen Forschungsstand zum Einsatz von KI in der schulischen Bildung. Berücksichtige Studien ab 2022, differenziere nach Primar- und Sekundarstufe, und erstelle eine Synopse mit Chancen, Risiken und Forschungslücken. Zitiere mindestens 5 Quellen.",
    needsWeb: true,
    level: "research"
  },
  {
    category: "Wissenschaftliche Recherche",
    title: "Metaanalyse Homeoffice",
    prompt: "Führe eine strukturierte Literaturrecherche zum Thema 'Produktivität im Homeoffice vs. Büro' durch. Fasse die Ergebnisse von mindestens 6 Studien (≥2021) zusammen, identifiziere Widersprüche zwischen den Studien und leite daraus eine differenzierte Handlungsempfehlung für HR-Abteilungen ab.",
    needsWeb: true,
    level: "research"
  },

  // Deep Research - Zukunftsszenarien
  {
    category: "Zukunftsszenarien",
    title: "Zukunft der Arbeit 2035",
    prompt: "Entwickle drei unterschiedliche Zukunftsszenarien für den deutschen Arbeitsmarkt im Jahr 2035. Berücksichtige KI-Automatisierung, demografischen Wandel und Fachkräftemangel. Jedes Szenario soll enthalten: Annahmen, Auswirkungen auf 5 Branchen, Gewinner/Verlierer, politische Handlungsempfehlungen.",
    level: "research"
  },
  {
    category: "Zukunftsszenarien",
    title: "Wasserstoff-Wirtschaft",
    prompt: "Analysiere die Perspektiven einer Wasserstoff-basierten Wirtschaft in Deutschland bis 2040. Untersuche: Produktionskapazitäten (grün vs. blau vs. grau), Infrastrukturbedarf, Kosten pro kg über die Zeit, internationale Wettbewerbsposition. Erstelle eine SWOT-Analyse und vergleiche mit der Strategie von Japan und Südkorea.",
    needsWeb: true,
    level: "research"
  },

  // Deep Research - Rechtliche Analysen
  {
    category: "Rechtliche Analysen",
    title: "DSGVO vs. AI Act",
    prompt: "Erstelle eine juristische Vergleichsanalyse zwischen DSGVO und EU AI Act hinsichtlich: Schutzzweck, Risikoklassifizierung, Sanktionsmechanismen, Auswirkungen auf KMUs. Strukturiere als Vergleichstabelle + erläuternden Fließtext (800 Wörter). Benenne drei potenzielle Konflikte zwischen beiden Regelwerken.",
    level: "research"
  },
  {
    category: "Rechtliche Analysen",
    title: "Urheberrecht KI-Inhalte",
    prompt: "Recherchiere die aktuelle Rechtslage zu urheberrechtlich geschützten Inhalten, die von KI generiert wurden – in Deutschland, der EU und den USA. Vergleiche aktuelle Gerichtsurteile, identifiziere offene Rechtsfragen und erstelle eine Risikoeinschätzung für Unternehmen, die KI-generierte Inhalte kommerziell nutzen.",
    needsWeb: true,
    level: "research"
  },

  // Deep Research - Ethische Analysen
  {
    category: "Ethische Analysen",
    title: "Ethik autonomer Fahrzeuge",
    prompt: "Führe eine umfassende ethische Analyse zum Einsatz autonomer Fahrzeuge durch. Berücksichtige: Trolley-Problem-Varianten, Haftungsfragen, algorithmische Bias-Risiken, gesellschaftliche Akzeptanz. Strukturiere nach den ethischen Frameworks: Utilitarismus, Deontologie, Tugendethik. Formuliere ein abschließendes ethisches Leitlinienpapier (800 Wörter).",
    level: "research"
  },
  {
    category: "Ethische Analysen",
    title: "KI in der Medizin",
    prompt: "Analysiere die ethischen Implikationen von KI-gestützter Diagnostik in der Medizin. Untersuche: Genauigkeit vs. Erklärbarkeit, Arzt-Patient-Beziehung, Datenschutz, Zugang und Gerechtigkeit (Global North vs. South). Erstelle ein Ethik-Framework mit 10 Leitprinzipien und konkreten Anwendungsbeispielen.",
    level: "research"
  },

  // Deep Research - Gesellschaftliche Analysen
  {
    category: "Gesellschaftliche Analysen",
    title: "Social Media & Demokratie",
    prompt: "Untersuche den Einfluss von Social-Media-Algorithmen auf demokratische Meinungsbildung. Analysiere: Filterblasen, Desinformation, Polarisierung, Einfluss auf Wahlen. Berücksichtige Fallstudien aus mindestens 3 Ländern (2020–2024) und entwickle einen Policy-Vorschlag für die EU-Ebene.",
    needsWeb: true,
    level: "research"
  },
  {
    category: "Gesellschaftliche Analysen",
    title: "Vier-Tage-Woche",
    prompt: "Erstelle eine evidenzbasierte Analyse zur Einführung der 4-Tage-Woche in Deutschland. Berücksichtige: Pilotprojekte aus UK, Island und Belgien, Auswirkungen auf Produktivität, Mitarbeiterzufriedenheit, Branchenunterschiede, volkswirtschaftliche Effekte. Erstelle ein Pro/Contra-Papier mit finaler Empfehlung.",
    needsWeb: true,
    level: "research"
  },

  // Deep Research - Technische Analysen
  {
    category: "Technische Analysen",
    title: "Cloud-Migration",
    prompt: "Erstelle einen detaillierten Migrationsleitfaden für die Verlagerung einer On-Premise-IT-Infrastruktur in die Cloud (AWS vs. Azure vs. GCP) für ein mittelständisches Unternehmen (200 MA). Berücksichtige: Kostenvergleich (TCO 5 Jahre), Sicherheitsaspekte, Compliance (DSGVO), Migrationsphasen, Risiken. Output: Executive Summary + detaillierte Entscheidungsmatrix.",
    level: "research"
  },
  {
    category: "Technische Analysen",
    title: "Programmiersprachen 2025",
    prompt: "Vergleiche die Programmiersprachen Python, Rust und Go hinsichtlich: Performance-Benchmarks, Ökosystem, Lernkurve, Einsatzgebiete, Arbeitsmarkt-Nachfrage 2024/25. Nutze aktuelle Quellen (Stack Overflow Survey, TIOBE Index, GitHub Octoverse). Erstelle eine gewichtete Bewertungsmatrix und sprich eine differenzierte Empfehlung nach Use Case aus.",
    needsWeb: true,
    level: "research"
  },

  // === BLUEPRINTS: Self-Contained Agenten-Spezifikationen ===

  {
    category: "Marktrecherche",
    title: "Wettbewerbsanalyse SaaS-Produkt",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein erfahrener Marktanalyst. Erstelle eine vollständige Wettbewerbsanalyse für ein B2B-SaaS-Projektmanagement-Tool. Untersuche die 5 wichtigsten Wettbewerber (Asana, Monday.com, Jira, ClickUp, Notion). Für jeden Wettbewerber: Preismodell, Kernfeatures, Zielgruppe, Schwächen. Erstelle eine Feature-Vergleichsmatrix, identifiziere 3 unbesetzte Nischen und formuliere eine Go-to-Market-Empfehlung.",
    needsWeb: true,
    constraints: {
      musts: [
        "Mindestens 5 Wettbewerber mit aktuellen Preisen analysieren",
        "Feature-Vergleichsmatrix als Tabelle ausgeben",
        "Quellenangaben für alle Preise und Marktdaten"
      ],
      mustNots: [
        "Keine Empfehlungen ohne Datengrundlage",
        "Keine veralteten Preise (vor 2024) verwenden",
        "Keine Bewertung eigener Stärken ohne Wettbewerbskontext"
      ],
      escalationTriggers: [
        "Wenn Preisdaten nicht öffentlich verfügbar sind",
        "Wenn ein Wettbewerber kürzlich akquiriert wurde",
        "Wenn der Markt sich in den letzten 6 Monaten grundlegend verändert hat"
      ]
    },
    acceptanceCriteria: "Die Analyse enthält eine vollständige Vergleichsmatrix mit mindestens 10 Feature-Kategorien, aktuelle Preisdaten aller 5 Wettbewerber, und 3 konkrete, datengestützte Nischen-Empfehlungen mit geschätztem Marktpotenzial.",
    estimatedAgentTime: "~90 Minuten",
    requiredTools: ["Web-Suche", "Dokument-Analyse"]
  },
  {
    category: "Content-Strategie",
    title: "Redaktionsplan Q2",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Content-Stratege für ein Tech-Startup. Erstelle einen vollständigen Redaktionsplan für Q2 2026 (April-Juni). Das Startup entwickelt KI-gestützte HR-Software. Zielgruppe: HR-Leiter in Unternehmen mit 100-500 Mitarbeitern. Kanäle: Blog, LinkedIn, Newsletter. Pro Woche: 2 Blog-Posts, 3 LinkedIn-Posts, 1 Newsletter. Für jeden Inhalt: Titel, Kernbotschaft, Keywords, CTA, geschätzte Reichweite.",
    constraints: {
      musts: [
        "13 Wochen vollständig abdecken mit allen Kanälen",
        "SEO-Keywords für jeden Blog-Post recherchieren",
        "Saisonale Anlässe und HR-Events einbeziehen"
      ],
      mustNots: [
        "Keine generischen Inhalte ohne Branchenbezug",
        "Kein Content ohne klaren Call-to-Action",
        "Keine Wiederholung von Themen innerhalb von 4 Wochen"
      ],
      escalationTriggers: [
        "Wenn wichtige Branchenevents im Zeitraum stattfinden",
        "Wenn aktuelle Gesetzesänderungen den HR-Bereich betreffen"
      ]
    },
    acceptanceCriteria: "Der Plan umfasst alle 13 Wochen mit je 6 konkreten Content-Pieces, jeder Eintrag hat Titel, Keywords und CTA, und der Plan berücksichtigt mindestens 3 saisonale Anlässe.",
    estimatedAgentTime: "~60 Minuten",
    requiredTools: ["Web-Suche", "Tabellenkalkulation"]
  },
  {
    category: "Technische Dokumentation",
    title: "API-Dokumentation erstellen",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Technical Writer. Erstelle eine vollständige API-Dokumentation für eine REST-API mit den Endpunkten: Benutzer (CRUD), Projekte (CRUD), Aufgaben (CRUD + Zuweisung), Kommentare (Create/Read/Delete). Für jeden Endpunkt: HTTP-Methode, URL, Parameter, Request/Response-Body (JSON-Schema), Fehlercodes, Beispielaufrufe mit curl. Folge dem OpenAPI 3.0 Standard.",
    constraints: {
      musts: [
        "Jeden Endpunkt mit mindestens 2 Beispielaufrufen dokumentieren",
        "Alle Fehlercodes (400, 401, 403, 404, 500) pro Endpunkt auflisten",
        "Authentifizierungsmechanismus (Bearer Token) durchgängig zeigen"
      ],
      mustNots: [
        "Keine Endpunkte ohne Fehlerbehandlung dokumentieren",
        "Keine inkonsistenten Namenskonventionen verwenden",
        "Keine Beispiele ohne gültige JSON-Syntax"
      ],
      escalationTriggers: [
        "Wenn Endpunkte zirkuläre Abhängigkeiten haben",
        "Wenn Rate-Limiting-Strategie unklar ist"
      ]
    },
    acceptanceCriteria: "Die Dokumentation enthält alle 4 Ressourcen mit vollständigen CRUD-Operationen, jeder Endpunkt hat Request/Response-Beispiele in gültigem JSON, und die Authentifizierung ist konsistent dokumentiert.",
    estimatedAgentTime: "~45 Minuten",
    requiredTools: ["Dokument-Analyse"]
  },
  {
    category: "Geschäftsstrategie",
    title: "Business Model Canvas",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Startup-Berater. Erstelle ein vollständiges Business Model Canvas für eine Online-Plattform, die Freelancer mit KMUs für kurzfristige Projektarbeit verbindet. Markt: DACH-Region. Differenzierung: KI-gestütztes Matching basierend auf Kompetenzen und Unternehmenskultur. Fülle alle 9 Canvas-Felder mit je 3-5 konkreten Punkten. Ergänze: SWOT-Analyse, Unit Economics (CAC, LTV, Break-Even), und 3 Pivotoptionen bei Nicht-Erreichen von Product-Market-Fit.",
    constraints: {
      musts: [
        "Alle 9 Canvas-Felder vollständig ausfüllen",
        "Unit Economics mit konkreten Zahlenbeispielen berechnen",
        "Mindestens 3 Revenue Streams identifizieren"
      ],
      mustNots: [
        "Keine unrealistischen Wachstumsannahmen (>100% MoM)",
        "Keine Pivot-Optionen ohne Bezug zum Kernprodukt",
        "Keine Kostenschätzungen ohne Marktvergleich"
      ],
      escalationTriggers: [
        "Wenn regulatorische Hürden den Marktstart gefährden",
        "Wenn vergleichbare Plattformen kürzlich gescheitert sind"
      ]
    },
    acceptanceCriteria: "Das Canvas ist vollständig mit allen 9 Feldern, die Unit Economics sind mit Berechnungsweg nachvollziehbar, und die SWOT-Analyse enthält mindestens 4 Punkte pro Quadrant.",
    estimatedAgentTime: "~75 Minuten",
    requiredTools: ["Web-Suche", "Dokument-Analyse"]
  },
  {
    category: "Personalwesen",
    title: "Onboarding-Programm Design",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein HR-Experte. Entwirf ein vollständiges 90-Tage-Onboarding-Programm für Software-Entwickler in einem Tech-Unternehmen (50-200 MA). Das Programm soll abdecken: Woche 1 (Orientierung), Woche 2-4 (Einarbeitung), Monat 2 (Integration), Monat 3 (Selbstständigkeit). Pro Phase: Tägliche Aktivitäten, Lernziele, Buddy-System-Aufgaben, Check-in-Meetings, Erfolgskriterien. Erstelle außerdem: Checkliste für Manager, Feedback-Fragebogen für Tag 30/60/90.",
    constraints: {
      musts: [
        "Jeden der 90 Tage mit mindestens einer Kernaktivität planen",
        "Buddy-System mit konkreten Aufgaben pro Woche definieren",
        "Messbare Erfolgskriterien für jede Phase festlegen"
      ],
      mustNots: [
        "Keine Phase ohne Feedback-Möglichkeit gestalten",
        "Keine unrealistischen Lernziele für die erste Woche",
        "Keine Isolation des neuen Mitarbeiters von Teams"
      ],
      escalationTriggers: [
        "Wenn der neue Mitarbeiter remote arbeitet",
        "Wenn das Team sich in einer Umstrukturierung befindet"
      ]
    },
    acceptanceCriteria: "Das Programm umfasst alle 90 Tage mit konkreten Aktivitäten, enthält die Manager-Checkliste und alle 3 Feedback-Fragebögen, und definiert messbare Erfolgskriterien pro Phase.",
    estimatedAgentTime: "~60 Minuten",
    requiredTools: ["Dokument-Analyse"]
  },
  {
    category: "Datenanalyse",
    title: "KPI-Dashboard Konzept",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Business-Intelligence-Analyst. Entwirf ein vollständiges KPI-Dashboard-Konzept für einen E-Commerce-Shop (Jahresumsatz 2-5 Mio. EUR). Das Dashboard soll enthalten: Executive Overview (5 Top-KPIs), Marketing (CAC, ROAS, Conversion-Funnel), Operations (Fulfillment, Retouren, Lagerumschlag), Finance (Umsatz, Marge, Cashflow). Für jede KPI: Definition, Datenquelle, Berechnungsformel, Zielwert, Alarm-Schwelle. Erstelle ein Wireframe-Konzept in ASCII-Art.",
    constraints: {
      musts: [
        "Mindestens 20 KPIs über alle 4 Bereiche definieren",
        "Jede KPI mit exakter Berechnungsformel versehen",
        "Alarm-Schwellen mit Eskalationsprozess definieren"
      ],
      mustNots: [
        "Keine Vanity-Metriken ohne Geschäftsbezug aufnehmen",
        "Keine KPIs ohne definierte Datenquelle",
        "Keine Dashboard-Seite mit mehr als 8 KPIs"
      ],
      escalationTriggers: [
        "Wenn Datenquellen nicht automatisiert abfragbar sind",
        "Wenn KPIs sich gegenseitig widersprechen"
      ]
    },
    acceptanceCriteria: "Das Konzept enthält mindestens 20 KPIs mit Formeln und Datenquellen, das ASCII-Wireframe zeigt alle 4 Dashboard-Bereiche, und jede Alarm-Schwelle hat einen definierten Eskalationsprozess.",
    estimatedAgentTime: "~50 Minuten",
    requiredTools: ["Tabellenkalkulation", "Dokument-Analyse"]
  },
  {
    category: "Rechtliche Analyse",
    title: "DSGVO-Audit Checkliste",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Datenschutzberater. Erstelle eine vollständige DSGVO-Audit-Checkliste für ein SaaS-Unternehmen, das Kundendaten verarbeitet. Die Checkliste soll abdecken: Verarbeitungsverzeichnis, Rechtsgrundlagen, Betroffenenrechte, TOMs, Auftragsverarbeitung, Datenschutz-Folgenabschätzung, Meldepflichten. Pro Bereich: Prüfpunkte, Dokumentationsanforderungen, häufige Mängel, Maßnahmen bei Nichtkonformität. Erstelle zusätzlich einen Zeitplan für die Durchführung des Audits.",
    constraints: {
      musts: [
        "Alle DSGVO-Artikel referenzieren die für SaaS relevant sind",
        "Mindestens 50 Prüfpunkte über alle Bereiche erstellen",
        "Zeitplan mit realistischen Aufwandsschätzungen pro Bereich"
      ],
      mustNots: [
        "Keine rechtlichen Garantien oder Rechtsberatung geben",
        "Keine veralteten Rechtsgrundlagen (vor Schrems II) verwenden",
        "Keine Prüfpunkte ohne konkretes Nachweisdokument"
      ],
      escalationTriggers: [
        "Wenn internationale Datentransfers stattfinden",
        "Wenn besondere Kategorien personenbezogener Daten verarbeitet werden",
        "Wenn der aktuelle Datenschutzbeauftragte extern ist"
      ]
    },
    acceptanceCriteria: "Die Checkliste umfasst mindestens 50 Prüfpunkte mit DSGVO-Artikelreferenzen, der Audit-Zeitplan enthält realistische Aufwandsschätzungen, und häufige Mängel sind mit konkreten Gegenmaßnahmen dokumentiert.",
    estimatedAgentTime: "~80 Minuten",
    requiredTools: ["Web-Suche", "Dokument-Analyse"]
  },
  {
    category: "Produktentwicklung",
    title: "Feature-Spezifikation mit User Stories",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Product Owner. Erstelle eine vollständige Feature-Spezifikation für ein 'Team-Kalender'-Feature in einer Projektmanagement-App. Die Spezifikation soll enthalten: Problem Statement, Zielgruppe, 10 User Stories (mit Akzeptanzkriterien), Wireframes (ASCII), Datenmodell, API-Endpunkte, Edge Cases, Rollout-Plan (Feature Flags). Priorisiere nach MoSCoW und plane 3 Iterationen.",
    constraints: {
      musts: [
        "Jede User Story mit mindestens 3 Akzeptanzkriterien versehen",
        "Edge Cases für Zeitzonen, Feiertage und Berechtigungen abdecken",
        "Datenmodell mit Relationen und Indizes spezifizieren"
      ],
      mustNots: [
        "Keine User Stories ohne Akzeptanzkriterien",
        "Keine Iteration mit mehr als 3 Must-Have Stories",
        "Keine API-Endpunkte ohne Fehlerbehandlung spezifizieren"
      ],
      escalationTriggers: [
        "Wenn Abhängigkeiten zu anderen Features bestehen",
        "Wenn Performance-Anforderungen (>1000 Events) relevant werden"
      ]
    },
    acceptanceCriteria: "Die Spezifikation enthält 10 User Stories mit je 3+ Akzeptanzkriterien, das Datenmodell ist vollständig, und der Rollout-Plan definiert 3 Iterationen mit MoSCoW-Priorisierung.",
    estimatedAgentTime: "~70 Minuten",
    requiredTools: ["Dokument-Analyse"]
  },
  {
    category: "Bildung & Training",
    title: "Workshop-Konzept KI-Kompetenz",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Trainings-Designer. Erstelle ein vollständiges 2-Tages-Workshop-Konzept 'KI-Kompetenz für Führungskräfte'. Zielgruppe: C-Level und Abteilungsleiter ohne technischen Hintergrund. Das Konzept soll enthalten: Lernziele, Agenda (minutengenau), Methoden-Mix (Vortrag, Übungen, Diskussion), 5 Hands-on-Übungen mit KI-Tools, Materialien-Liste, Evaluationsbogen. Berücksichtige: verschiedene Erfahrungslevel, Praxistransfer, Follow-up-Maßnahmen.",
    constraints: {
      musts: [
        "Minutengenaue Agenda für beide Tage (je 8 Stunden)",
        "Mindestens 5 Hands-on-Übungen mit konkreten KI-Tools",
        "Praxistransfer-Aufgaben für die Wochen nach dem Workshop"
      ],
      mustNots: [
        "Keine Übungen die technische Vorkenntnisse erfordern",
        "Keine Vortragsblöcke länger als 30 Minuten",
        "Keine Tools verwenden die kostenpflichtige Accounts erfordern"
      ],
      escalationTriggers: [
        "Wenn Teilnehmer sensible Unternehmensdaten in KI-Tools eingeben möchten",
        "Wenn die IT-Infrastruktur bestimmte Tools blockiert"
      ]
    },
    acceptanceCriteria: "Das Konzept umfasst 2 vollständige Tagesagenden mit Minutenangaben, alle 5 Übungen haben Anleitungen und erwartete Ergebnisse, und der Evaluationsbogen misst mindestens 5 Lernziele.",
    estimatedAgentTime: "~55 Minuten",
    requiredTools: ["Web-Suche", "Dokument-Analyse"]
  },
  {
    category: "Prozessoptimierung",
    title: "Automatisierungs-Roadmap",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Prozessberater. Erstelle eine Automatisierungs-Roadmap für die Buchhaltung eines mittelständischen Unternehmens (50 MA, 500 Rechnungen/Monat). Analysiere den Ist-Prozess (Rechnungseingang bis Zahlung), identifiziere Automatisierungspotenziale, bewerte Tools (DATEV, Lexoffice, Candis), erstelle eine ROI-Berechnung und einen 6-Monats-Implementierungsplan. Berücksichtige: GoBD-Konformität, Mitarbeiter-Schulung, Fallback-Prozesse.",
    constraints: {
      musts: [
        "Ist-Prozess als Flussdiagramm (ASCII) darstellen",
        "ROI-Berechnung mit konkreten Zahlen (Zeitersparnis, Kosten)",
        "GoBD-Konformität für jeden Automatisierungsschritt prüfen"
      ],
      mustNots: [
        "Keine Automatisierung ohne Fallback-Prozess vorschlagen",
        "Keine Tools ohne Preisvergleich empfehlen",
        "Keine Prozessschritte eliminieren die gesetzlich vorgeschrieben sind"
      ],
      escalationTriggers: [
        "Wenn bestehende ERP-Systeme inkompatibel sind",
        "Wenn Mitarbeiter-Widerstand gegen Automatisierung besteht"
      ]
    },
    acceptanceCriteria: "Die Roadmap enthält Ist- und Soll-Prozess als Flussdiagramm, die ROI-Berechnung zeigt den Break-Even-Punkt, und der 6-Monats-Plan hat Meilensteine mit konkreten Verantwortlichkeiten.",
    estimatedAgentTime: "~65 Minuten",
    requiredTools: ["Web-Suche", "Dokument-Analyse", "Tabellenkalkulation"]
  },
  {
    category: "App-Prototyp",
    title: "MVP-Spezifikation Fitness-App",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Product Manager. Erstelle eine vollständige MVP-Spezifikation für eine KI-gestützte Fitness-App. Kernfunktionen: Personalisierte Trainingspläne, Fortschrittstracking, Ernährungsvorschläge. Zielgruppe: Fitness-Anfänger 25-40 Jahre. Erstelle: User Personas (3), User Journey Map, Feature-Priorisierung (MoSCoW), Wireframes (ASCII) für 5 Hauptscreens, Tech-Stack-Empfehlung, Kostenschätzung für 3-Monats-Entwicklung.",
    constraints: {
      musts: [
        "3 detaillierte User Personas mit demografischen Daten erstellen",
        "Wireframes für alle 5 Hauptscreens in ASCII-Art",
        "Kostenschätzung aufgeschlüsselt nach Entwicklung, Design, Infrastruktur"
      ],
      mustNots: [
        "Keine medizinischen Ratschläge in der App-Logik vorsehen",
        "Keine Features planen die Wearable-Integration im MVP erfordern",
        "Keine Kostenschätzung ohne Stundensatz-Angabe"
      ],
      escalationTriggers: [
        "Wenn medizinische Haftungsfragen relevant werden",
        "Wenn Datenschutz bei Gesundheitsdaten besondere Anforderungen stellt"
      ]
    },
    acceptanceCriteria: "Die Spezifikation enthält 3 Personas, 5 ASCII-Wireframes, eine priorisierte Feature-Liste, und die Kostenschätzung liegt aufgeschlüsselt vor mit einem realistischen 3-Monats-Timeline.",
    estimatedAgentTime: "~80 Minuten",
    requiredTools: ["Web-Suche", "Dokument-Analyse"]
  },
  {
    category: "Krisenmanagement",
    title: "Kommunikationsplan Datenleck",
    type: "blueprint",
    level: "blueprint",
    prompt: "Du bist ein Krisenberater. Erstelle einen vollständigen Krisenkommunikationsplan für den Fall eines Datenlecks in einem E-Commerce-Unternehmen (100.000 Kundendaten betroffen). Der Plan soll abdecken: Sofortmaßnahmen (erste 4 Stunden), Behördenmeldung (DSGVO-konform), Kundenkommunikation (E-Mail-Template, FAQ), Presse-Statement, Social-Media-Strategie, interne Kommunikation, Post-Mortem-Prozess. Zeitstrahl: Stunde 0 bis Tag 30.",
    constraints: {
      musts: [
        "DSGVO 72-Stunden-Meldefrist berücksichtigen",
        "Alle Kommunikationsvorlagen sofort einsetzbar formulieren",
        "Eskalationskette mit konkreten Rollen und Verantwortlichkeiten"
      ],
      mustNots: [
        "Keine Schuldzuweisungen in externen Kommunikationen",
        "Keine technischen Details in der Kundenkommunikation",
        "Keine Zusagen über Schadensersatz ohne rechtliche Prüfung"
      ],
      escalationTriggers: [
        "Wenn Kreditkartendaten betroffen sind",
        "Wenn die Presse vor der offiziellen Kommunikation berichtet",
        "Wenn der Angriff noch andauert"
      ]
    },
    acceptanceCriteria: "Der Plan enthält einen minutengenauen Zeitstrahl für die ersten 72 Stunden, alle Kommunikationsvorlagen sind direkt verwendbar, und die DSGVO-Meldefrist ist korrekt eingebaut.",
    estimatedAgentTime: "~70 Minuten",
    requiredTools: ["Web-Suche", "Dokument-Analyse"]
  }
];

const categories = ["Alle", "Alltag", "Beruf", "Websuche", "Deep Research", "Blueprints"];

const BlueprintDetails = ({ prompt }: { prompt: PromptItem }) => {
  const [expanded, setExpanded] = useState(false);

  if (prompt.type !== "blueprint" || !prompt.constraints) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {prompt.estimatedAgentTime && (
          <span className="inline-flex items-center gap-1 bg-accent/10 text-accent-foreground px-2 py-1 rounded">
            <Clock className="w-3 h-3" />
            {prompt.estimatedAgentTime}
          </span>
        )}
        {prompt.requiredTools?.map((tool, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded">
            <Wrench className="w-3 h-3" />
            {tool}
          </span>
        ))}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Details ausblenden" : "Constraints & Abnahmekriterien"}
      </button>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-border">
          {prompt.constraints.musts.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Must
              </div>
              <ul className="space-y-1">
                {prompt.constraints.musts.map((m, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">+</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prompt.constraints.mustNots.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-destructive mb-1">Must NOT</div>
              <ul className="space-y-1">
                {prompt.constraints.mustNots.map((m, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">-</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prompt.constraints.escalationTriggers.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-accent-foreground mb-1">Eskalations-Trigger</div>
              <ul className="space-y-1">
                {prompt.constraints.escalationTriggers.map((m, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-accent-foreground mt-0.5">!</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prompt.acceptanceCriteria && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="text-xs font-semibold text-primary mb-1">Abnahmekriterien</div>
              <p className="text-xs text-foreground leading-relaxed">{prompt.acceptanceCriteria}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PromptLibrary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alltag");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Prompt kopiert!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredPrompts = promptLibrary.filter((prompt) => {
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "Alle" ||
      (selectedCategory === "Alltag" && prompt.level === "alltag") ||
      (selectedCategory === "Beruf" && prompt.level === "beruf") ||
      (selectedCategory === "Websuche" && prompt.level === "websuche") ||
      (selectedCategory === "Deep Research" && prompt.level === "research") ||
      (selectedCategory === "Blueprints" && prompt.type === "blueprint");

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary mb-2">Sammlung</span>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Prompt-Sammlung
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Kopiere Prompts als Startpunkt oder öffne sie direkt im Prompt-Labor
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Suche nach Prompts, Kategorien oder Themen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredPrompts.length} {filteredPrompts.length === 1 ? "Prompt" : "Prompts"} gefunden
        </p>
      </div>

      {/* Prompts Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {(showAll ? filteredPrompts : filteredPrompts.slice(0, 6)).map((prompt, index) => (
          <Card key={index} className="p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    {prompt.category}
                  </span>
                  {prompt.type === "blueprint" && (
                    <span className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary font-semibold px-2 py-1 rounded">
                      <Shield className="w-3 h-3" />
                      Blueprint
                    </span>
                  )}
                  {prompt.needsWeb && (
                    <span className="inline-flex items-center gap-1 text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                      <Globe className="w-3 h-3" />
                      Websuche
                    </span>
                  )}
                </div>
                <h4 className="font-semibold mb-2 text-sm">
                  {prompt.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  "{prompt.prompt}"
                </p>
                <BlueprintDetails prompt={prompt} />
              </div>
              
              <div className="flex flex-col gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(prompt.prompt, index)}
                  title="Prompt kopieren"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-primary animate-scale-in" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigate(`/playground?prompt=${encodeURIComponent(prompt.prompt)}`)}
                  title="Im Playground öffnen"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPrompts.length > 6 && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Weniger anzeigen" : `Alle ${filteredPrompts.length} Prompts anzeigen`}
          </Button>
        </div>
      )}

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Keine Prompts gefunden. Versuche eine andere Suche oder Kategorie.
          </p>
        </div>
      )}
    </section>
  );
};
