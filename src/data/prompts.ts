import type { PromptItem, PromptConstraints } from "@/types";

export type { PromptItem, PromptConstraints } from "@/types";

export const promptLibrary: PromptItem[] = [
  // Alltag - Rezepte & Kochen
  {
    category: "Rezepte & Kochen",
    title: "Vegetarisches Rezept",
    prompt: "Suche ein Rezept für ein vegetarisches Abendessen für 4 Personen mit Tomaten, Pasta und Zwiebeln, die ich zu Hause habe.",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Alltag - Reisen & Urlaub
  {
    category: "Reisen & Urlaub",
    title: "Italien-Reiseroute",
    prompt: "Erstelle eine Reiseroute für einen 7-tägigen Urlaub in Italien mit den Schwerpunkten Kultur und Natur, maximal 2 Stunden Autofahrt pro Tag.",
    level: "alltag",
    confidentiality: "open",
  },
  {
    category: "Reisen & Urlaub",
    title: "Japan Top 5",
    prompt: "Was sind die Top 5 'muss man gesehen haben' Orte in Japan für Erstbesucher?",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Alltag - Geschenke
  {
    category: "Geschenke",
    title: "Geburtstagsgeschenk Mutter",
    prompt: "Finde ein Geschenk für meine Mutter zum Geburtstag, das ihr gefällt und nicht mehr als 50 Euro kostet.",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Alltag - Gesundheit & Fitness
  {
    category: "Gesundheit & Fitness",
    title: "Home-Workout Plan",
    prompt: "Erstelle einen 30-minütigen Trainingsplan für zu Hause ohne Ausrüstung, der sich auf Rücken und Körpermitte konzentriert.",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Alltag - Hobbys
  {
    category: "Hobbys & Freizeit",
    title: "Bonsai-Pflege",
    prompt: "Wie pflege ich einen Bonsaibaum richtig? Gib mir eine Schritt-für-Schritt-Anleitung mit Bewässerung, Licht und Schnitt.",
    level: "alltag",
    confidentiality: "open",
  },
  {
    category: "Hobbys & Freizeit",
    title: "Wohnzimmer streichen",
    prompt: "Erstelle eine Schritt-für-Schritt-Anleitung zum Streichen meines Wohnzimmers, inklusive Materialien und Zeitaufwand.",
    level: "alltag",
    confidentiality: "open",
  },
  {
    category: "Hobbys & Freizeit",
    title: "Familientreffen Aktivitäten",
    prompt: "Vorschläge für unterhaltsame Aktivitäten bei einem Familientreffen mit Kindern zwischen 5 und 12 Jahren.",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Alltag - Finanzen
  {
    category: "Finanzen & Budget",
    title: "Haushaltsbudget",
    prompt: "Erstelle einen einfachen Budgetierungsplan für einen 2-Personen-Haushalt mit 3.000€ Nettoeinkommen pro Monat.",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Alltag - Sprachen
  {
    category: "Sprachen & Lernen",
    title: "Spanisch Lernplan",
    prompt: "Wie kann ich Grundkenntnisse in Spanisch in einem Monat erwerben? Erstelle einen strukturierten Lernplan mit täglichen Übungen.",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Alltag - Haustiere
  {
    category: "Haustiere",
    title: "Hundetraining",
    prompt: "Wie gewöhne ich meinen Hund an neue Menschen? Gib mir eine Trainingsmethode mit konkreten Schritten.",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Beruf - Marketing
  {
    category: "Marketing",
    title: "Kreative Kampagnenideen",
    prompt: "Liste mir 10 kreative und unkonventionelle Ideen für eine Social-Media-Marketing-Kampagne für ein neues Bio-Erfrischungsgetränk.",
    level: "beruf",
    confidentiality: "open",
  },
  {
    category: "Marketing",
    title: "Digitale Marketing-Trends",
    prompt: "Was sind die neuesten Trends in der digitalen Marketingbranche? Nutze die Websuche für aktuelle Informationen aus 2024-2025.",
    needsWeb: true,
    level: "beruf",
    confidentiality: "open",
  },
  
  // Beruf - Meetings & Kommunikation
  {
    category: "Meetings & Kommunikation",
    title: "Meeting-Agenda",
    prompt: "Erstelle eine effektive Agenda für ein Team-Meeting zum Thema 'Quartalsplanung Q2' mit Zeitangaben für jeden Punkt (insgesamt 90 Minuten).",
    level: "beruf",
    confidentiality: "open",
  },
  {
    category: "Meetings & Kommunikation",
    title: "Konstruktives Feedback",
    prompt: "Hilf mir konstruktives Feedback für einen Kollegen zu formulieren. Er liefert gute Arbeit, verpasst aber oft Deadlines. Der Ton soll wertschätzend, aber klar sein.",
    level: "beruf",
    confidentiality: "open",
  },
  
  // Beruf - Projektmanagement
  {
    category: "Projektmanagement",
    title: "Statusbericht-Vorlage",
    prompt: "Erstelle mir eine Vorlage für einen wöchentlichen Projektstatusbericht mit den Abschnitten: Fortschritt, Herausforderungen, nächste Schritte, Budget-Status.",
    level: "beruf",
    confidentiality: "open",
  },
  
  // Beruf - Sicherheit
  {
    category: "IT & Sicherheit",
    title: "Datensicherheit-Checkliste",
    prompt: "Erstelle eine Checkliste für die Überprüfung der Datensicherheit in meinem kleinen Unternehmen mit 10 Mitarbeitern.",
    level: "beruf",
    confidentiality: "open",
  },
  
  // Beruf - Präsentation
  {
    category: "Präsentation & Skills",
    title: "Präsentationsfähigkeiten",
    prompt: "Wie kann ich meine Präsentationsfähigkeiten verbessern? Gib mir 5 konkrete Techniken mit Übungen.",
    level: "beruf",
    confidentiality: "open",
  },
  
  // Beruf - HR & Team
  {
    category: "HR & Team",
    title: "Konfliktmanagement",
    prompt: "Wie gehe ich mit einem Konflikt zwischen zwei Teammitgliedern um? Erstelle einen Leitfaden für ein Mediationsgespräch.",
    level: "beruf",
    confidentiality: "open",
  },
  {
    category: "HR & Team",
    title: "Virtuelles Onboarding",
    prompt: "Wie führe ich ein virtuelles Onboarding für neue Mitarbeiter durch? Erstelle einen 2-Wochen-Plan.",
    level: "beruf",
    confidentiality: "open",
  },
  
  // Beruf - Recht
  {
    category: "Recht & Verträge",
    title: "Freelancer-Vertrag",
    prompt: "Was muss ich beachten, wenn ich einen Vertrag für Freelancer aufsetze? Liste die wichtigsten Klauseln auf.",
    level: "beruf",
    confidentiality: "open",
  },
  
  // Websuche - News & Aktuelles
  {
    category: "News & Aktuelles",
    title: "Tagesnachrichten",
    prompt: "Nutze die Websuche und liste die drei wichtigsten deutschsprachigen Nachrichten des heutigen Tages (Kurzfassung + Quelle).",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  {
    category: "News & Aktuelles",
    title: "Inflationszahlen",
    prompt: "Bitte verwende die Websuche, um die neuesten Inflationszahlen für Deutschland (letzter verfügbarer Monat) zu finden, nenne Quelle und Veröffentlichungsdatum.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  
  // Websuche - Lokales
  {
    category: "Lokale Recherche",
    title: "Restaurants finden",
    prompt: "Recherchiere per Websuche drei gut bewertete italienische Restaurants in Köln – jeweils mit Adresse, Preisspanne und einem aktuellen Gäste-Kommentar.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  {
    category: "Lokale Recherche",
    title: "Veranstaltungen",
    prompt: "Welche kulturellen Highlights finden nächstes Wochenende (Fr–So) in Berlin statt? Websuche nutzen, Links angeben.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  
  // Websuche - Sport
  {
    category: "Sport",
    title: "Bundesliga-Tabelle",
    prompt: "Mit Websuche: Wer führt aktuell die Bundesliga-Tabelle an? Gib mir die Top 5 Teams + Punkte und Tordifferenz.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  
  // Websuche - Shopping
  {
    category: "Shopping & Preise",
    title: "Preisvergleich Smartphone",
    prompt: "Suche im Web nach dem günstigsten Online-Preis für ein Samsung Galaxy A55 (128 GB) und zeige die drei besten Angebote mit Datum des Angebots.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  
  // Deep Research - Produktvergleiche
  {
    category: "Produktvergleiche",
    title: "E-Auto Vergleich",
    prompt: "Erstelle einen detaillierten Vergleich zwischen dem VW ID.3, Tesla Model 3 und Renault Megane E-Tech. Berücksichtige: Reichweite im Winter, Gesamtkosten über 5 Jahre (Anschaffung, Versicherung, Wartung) und prognostizierten Restwert. Gib das Ergebnis als übersichtliche Tabelle aus und erstelle eine gewichtete Entscheidungsmatrix (Kosten 40%, Reichweite 30%, Restwert 30%). Begründe deine finale Empfehlung.",
    level: "research",
    confidentiality: "open",
  },
  
  // Deep Research - Studien
  {
    category: "Vergleichsstudien",
    title: "Windkraft Europa",
    prompt: "Vergleiche Offshore- mit Onshore-Windkraft in Europa hinsichtlich Kosten/MWh, Umweltauswirkungen, Genehmigungsdauer und Akzeptanz in der Bevölkerung. Strukturiere als Tabelle, diskutiere Vor- und Nachteile in Fließtext und zitiere mindestens vier aktuelle Studien (Jahr ≥ 2022).",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },
  
  // Deep Research - Strategien
  {
    category: "Strategiepapiere",
    title: "Digitalisierung Arztpraxis",
    prompt: "Erstelle ein detailliertes Konzept (ca. 1.200 Wörter) für die Digitalisierung der Patientenakten in einer mittelgroßen Arztpraxis: Stakeholder-Analyse, Zeitplan, Kostenabschätzung, Change-Management-Maßnahmen, Risiken & Gegenmaßnahmen. Füge am Ende eine Prioritäten-Roadmap in Stichpunkten an.",
    level: "research",
    confidentiality: "open",
  },
  
  // Deep Research - Marktanalysen
  {
    category: "Marktanalysen",
    title: "Fleischersatzprodukte",
    prompt: "Analysiere den deutschen Markt für pflanzliche Fleischersatzprodukte: Marktgröße 2024, Wachstumsprognose bis 2028, wichtigste Player, Zielgruppen-Segmentierung, Preissensitivität. Stelle die Ergebnisse in einem Executive Summary (max. 500 Wörter) + detaillierte Tabelle dar.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },
  
  // Zusätzliche Alltags-Prompts
  {
    category: "Mode & Style",
    title: "Outfit-Beratung",
    prompt: "Ich habe ein Business-Meeting in einer kreativen Agentur. Wie sollte ich mich kleiden? Gib mir 3 Outfit-Vorschläge für Frauen/Männer.",
    level: "alltag",
    confidentiality: "open",
  },
  {
    category: "Technologie",
    title: "Smartphone-Kaufberatung",
    prompt: "Ich suche ein neues Smartphone für maximal 500€. Wichtig sind mir gute Kamera und lange Akkulaufzeit. Welche 3 Modelle empfiehlst du?",
    level: "alltag",
    confidentiality: "open",
  },
  {
    category: "Bildung",
    title: "Online-Kurs finden",
    prompt: "Ich möchte meine Excel-Kenntnisse verbessern. Welche kostenlosen Online-Kurse kannst du empfehlen? Nutze Websuche für aktuelle Angebote.",
    needsWeb: true,
    level: "alltag",
    confidentiality: "open",
  },
  {
    category: "Auto & Mobilität",
    title: "Gebrauchtwagen-Check",
    prompt: "Worauf muss ich beim Kauf eines Gebrauchtwagens achten? Erstelle eine Checkliste für die Besichtigung.",
    level: "alltag",
    confidentiality: "open",
  },
  {
    category: "Wohnen",
    title: "Energiespartipps",
    prompt: "Wie kann ich in meiner Wohnung Heizkosten sparen? Gib mir 10 praktische Tipps mit geschätztem Einsparpotenzial.",
    level: "alltag",
    confidentiality: "open",
  },
  
  // Zusätzliche Berufs-Prompts
  {
    category: "Content Creation",
    title: "LinkedIn-Post",
    prompt: "Schreibe einen LinkedIn-Post über die Bedeutung von Work-Life-Balance. Max. 1300 Zeichen, professionell aber persönlich.",
    level: "beruf",
    confidentiality: "open",
  },
  {
    category: "Zeitmanagement",
    title: "Produktivitäts-System",
    prompt: "Erstelle einen Tagesplan für maximale Produktivität. Ich arbeite 8 Stunden und habe oft viele Meetings. Berücksichtige Pausen und Deep Work Phasen.",
    level: "beruf",
    confidentiality: "open",
  },
  {
    category: "Kundenkommunikation",
    title: "Beschwerdemail",
    prompt: "Formuliere eine professionelle Antwort auf eine Kundenbeschwerde. Der Kunde ist unzufrieden mit der Lieferzeit. Zeige Verständnis und biete eine Lösung.",
    level: "beruf",
    confidentiality: "open",
  },
  {
    category: "Vertrieb",
    title: "Sales Pitch",
    prompt: "Erstelle einen 2-minütigen Elevator Pitch für eine neue SaaS-Lösung im Bereich Projektmanagement. Zielgruppe: kleine bis mittelständische Unternehmen.",
    level: "beruf",
    confidentiality: "open",
  },
  {
    category: "Innovation",
    title: "Brainstorming-Session",
    prompt: "Moderiere eine virtuelle Brainstorming-Session für die Entwicklung eines neuen Produktfeatures. Gib mir Struktur, Methoden und Zeitplan für 60 Minuten.",
    level: "beruf",
    confidentiality: "open",
  },
  
  // Zusätzliche Websuche-Prompts
  {
    category: "Gesundheit",
    title: "Gesundheitsnews",
    prompt: "Nutze Websuche: Was sind die neuesten Erkenntnisse zu gesunder Ernährung aus 2024? Fasse 3 wichtige Studien zusammen.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  {
    category: "Technologie-News",
    title: "KI-Entwicklungen",
    prompt: "Recherchiere die wichtigsten KI-Entwicklungen der letzten 3 Monate. Websuche nutzen und mindestens 5 Entwicklungen mit Quelle nennen.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  {
    category: "Wirtschaft",
    title: "Börsen-Update",
    prompt: "Mit Websuche: Wie haben sich die wichtigsten deutschen Aktienindizes (DAX, MDAX) heute entwickelt? Gib mir die Top 3 Gewinner und Verlierer.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  {
    category: "Immobilien",
    title: "Mietpreise",
    prompt: "Recherchiere per Websuche die durchschnittlichen Mietpreise für eine 2-Zimmer-Wohnung in München, Hamburg und Berlin. Vergleiche die Städte.",
    needsWeb: true,
    level: "websuche",
    confidentiality: "open",
  },
  
  // Zusätzliche Research-Prompts
  {
    category: "Bildungspolitik",
    title: "Digitale Bildung",
    prompt: "Analysiere den Stand der digitalen Bildung in deutschen Schulen im internationalen Vergleich. Berücksichtige: Ausstattung, Lehrerfortbildung, Lernplattformen. Nutze aktuelle Studien (≥2023) und erstelle einen Bericht mit Handlungsempfehlungen (1000 Wörter).",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Nachhaltigkeit",
    title: "CO2-Bilanz Unternehmen",
    prompt: "Erstelle einen detaillierten Leitfaden zur Berechnung und Reduzierung der CO2-Bilanz für ein mittelständisches Produktionsunternehmen (100 Mitarbeiter). Inkl. Methodik, Tools, Quick Wins und Langfriststrategie.",
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Gesundheitswesen",
    title: "Telemedizin-Strategie",
    prompt: "Entwickle ein Konzept für die Implementierung von Telemedizin in einer Hausarztpraxis: Technische Anforderungen, rechtliche Aspekte, Patientenakzeptanz, Abrechnung, Risiken. Ca. 1500 Wörter mit konkreter Umsetzungsroadmap.",
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Stadtentwicklung",
    title: "Smart City Konzept",
    prompt: "Entwirf ein Smart City Konzept für eine deutsche Mittelstadt (50.000 Einwohner) mit Fokus auf: Mobilität, Energie, Bürgerbeteiligung. Recherchiere Best Practices aus Europa, erstelle Phasenplan (5 Jahre) und Kostenübersicht.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },

  // Deep Research - Wissenschaftliche Recherche
  {
    category: "Wissenschaftliche Recherche",
    title: "Forschungsstand KI in Bildung",
    prompt: "Recherchiere den aktuellen Forschungsstand zum Einsatz von KI in der schulischen Bildung. Berücksichtige Studien ab 2022, differenziere nach Primar- und Sekundarstufe, und erstelle eine Synopse mit Chancen, Risiken und Forschungslücken. Zitiere mindestens 5 Quellen.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Wissenschaftliche Recherche",
    title: "Metaanalyse Homeoffice",
    prompt: "Führe eine strukturierte Literaturrecherche zum Thema 'Produktivität im Homeoffice vs. Büro' durch. Fasse die Ergebnisse von mindestens 6 Studien (≥2021) zusammen, identifiziere Widersprüche zwischen den Studien und leite daraus eine differenzierte Handlungsempfehlung für HR-Abteilungen ab.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },

  // Deep Research - Zukunftsszenarien
  {
    category: "Zukunftsszenarien",
    title: "Zukunft der Arbeit 2035",
    prompt: "Entwickle drei unterschiedliche Zukunftsszenarien für den deutschen Arbeitsmarkt im Jahr 2035. Berücksichtige KI-Automatisierung, demografischen Wandel und Fachkräftemangel. Jedes Szenario soll enthalten: Annahmen, Auswirkungen auf 5 Branchen, Gewinner/Verlierer, politische Handlungsempfehlungen.",
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Zukunftsszenarien",
    title: "Wasserstoff-Wirtschaft",
    prompt: "Analysiere die Perspektiven einer Wasserstoff-basierten Wirtschaft in Deutschland bis 2040. Untersuche: Produktionskapazitäten (grün vs. blau vs. grau), Infrastrukturbedarf, Kosten pro kg über die Zeit, internationale Wettbewerbsposition. Erstelle eine SWOT-Analyse und vergleiche mit der Strategie von Japan und Südkorea.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },

  // Deep Research - Rechtliche Analysen
  {
    category: "Rechtliche Analysen",
    title: "DSGVO vs. AI Act",
    prompt: "Erstelle eine juristische Vergleichsanalyse zwischen DSGVO und EU AI Act hinsichtlich: Schutzzweck, Risikoklassifizierung, Sanktionsmechanismen, Auswirkungen auf KMUs. Strukturiere als Vergleichstabelle + erläuternden Fließtext (800 Wörter). Benenne drei potenzielle Konflikte zwischen beiden Regelwerken.",
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Rechtliche Analysen",
    title: "Urheberrecht KI-Inhalte",
    prompt: "Recherchiere die aktuelle Rechtslage zu urheberrechtlich geschützten Inhalten, die von KI generiert wurden – in Deutschland, der EU und den USA. Vergleiche aktuelle Gerichtsurteile, identifiziere offene Rechtsfragen und erstelle eine Risikoeinschätzung für Unternehmen, die KI-generierte Inhalte kommerziell nutzen.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },

  // Deep Research - Ethische Analysen
  {
    category: "Ethische Analysen",
    title: "Ethik autonomer Fahrzeuge",
    prompt: "Führe eine umfassende ethische Analyse zum Einsatz autonomer Fahrzeuge durch. Berücksichtige: Trolley-Problem-Varianten, Haftungsfragen, algorithmische Bias-Risiken, gesellschaftliche Akzeptanz. Strukturiere nach den ethischen Frameworks: Utilitarismus, Deontologie, Tugendethik. Formuliere ein abschließendes ethisches Leitlinienpapier (800 Wörter).",
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Ethische Analysen",
    title: "KI in der Medizin",
    prompt: "Analysiere die ethischen Implikationen von KI-gestützter Diagnostik in der Medizin. Untersuche: Genauigkeit vs. Erklärbarkeit, Arzt-Patient-Beziehung, Datenschutz, Zugang und Gerechtigkeit (Global North vs. South). Erstelle ein Ethik-Framework mit 10 Leitprinzipien und konkreten Anwendungsbeispielen.",
    level: "research",
    confidentiality: "open",
  },

  // Deep Research - Gesellschaftliche Analysen
  {
    category: "Gesellschaftliche Analysen",
    title: "Social Media & Demokratie",
    prompt: "Untersuche den Einfluss von Social-Media-Algorithmen auf demokratische Meinungsbildung. Analysiere: Filterblasen, Desinformation, Polarisierung, Einfluss auf Wahlen. Berücksichtige Fallstudien aus mindestens 3 Ländern (2020–2024) und entwickle einen Policy-Vorschlag für die EU-Ebene.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Gesellschaftliche Analysen",
    title: "Vier-Tage-Woche",
    prompt: "Erstelle eine evidenzbasierte Analyse zur Einführung der 4-Tage-Woche in Deutschland. Berücksichtige: Pilotprojekte aus UK, Island und Belgien, Auswirkungen auf Produktivität, Mitarbeiterzufriedenheit, Branchenunterschiede, volkswirtschaftliche Effekte. Erstelle ein Pro/Contra-Papier mit finaler Empfehlung.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },

  // Deep Research - Technische Analysen
  {
    category: "Technische Analysen",
    title: "Cloud-Migration",
    prompt: "Erstelle einen detaillierten Migrationsleitfaden für die Verlagerung einer On-Premise-IT-Infrastruktur in die Cloud (AWS vs. Azure vs. GCP) für ein mittelständisches Unternehmen (200 MA). Berücksichtige: Kostenvergleich (TCO 5 Jahre), Sicherheitsaspekte, Compliance (DSGVO), Migrationsphasen, Risiken. Output: Executive Summary + detaillierte Entscheidungsmatrix.",
    level: "research",
    confidentiality: "open",
  },
  {
    category: "Technische Analysen",
    title: "Programmiersprachen 2025",
    prompt: "Vergleiche die Programmiersprachen Python, Rust und Go hinsichtlich: Performance-Benchmarks, Ökosystem, Lernkurve, Einsatzgebiete, Arbeitsmarkt-Nachfrage 2024/25. Nutze aktuelle Quellen (Stack Overflow Survey, TIOBE Index, GitHub Octoverse). Erstelle eine gewichtete Bewertungsmatrix und sprich eine differenzierte Empfehlung nach Use Case aus.",
    needsWeb: true,
    level: "research",
    confidentiality: "open",
  },

  // === BLUEPRINTS: Self-Contained Agenten-Spezifikationen ===

  {
    category: "Marktrecherche",
    title: "Wettbewerbsanalyse SaaS-Produkt",
    type: "blueprint",
    level: "blueprint",
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
    confidentiality: "internal",
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
  },
  {
    category: "Organisation",
    title: "Support-Standardantworten",
    prompt: "Erstelle 5 standardisierte Antwortvorlagen für Support-Tickets der Kategorie {{Kategorie}}. Struktur: Empathie, Lösungsschritte, Nächste Aktion, Abschluss. Ton: professionell und klar.",
    level: "organisation",
    confidentiality: "internal",
    department: "Support",
    riskLevel: "mittel",
    official: true
  },
  {
    category: "Organisation",
    title: "Sales Discovery Call Briefing",
    prompt: "Erstelle ein Discovery-Call-Briefing für {{Kundensegment}} mit Ziel: {{Ziel}}. Liefere 8 Fragen, 3 Qualifizierungskriterien und ein Follow-up-Template.",
    level: "organisation",
    confidentiality: "internal",
    department: "Vertrieb",
    riskLevel: "niedrig",
    official: false
  },
  {
    category: "Organisation",
    title: "Legal Review Check",
    prompt: "Erzeuge eine Vorprüfungsliste für {{Vertragsart}} mit Bereichen: Laufzeit, Haftung, Datenschutz, Kündigung, Haftungsbegrenzung. Markiere Punkte, die Legal final prüfen muss.",
    level: "organisation",
    confidentiality: "confidential",
    department: "Legal",
    riskLevel: "hoch",
    official: true
  },

  // ═══ ABTEILUNG LEGAL ═══
  {
    category: "Vertragsrecht",
    title: "Vertragsentwurf strukturieren",
    prompt: "Erstelle eine Gliederung für einen {{Vertragstyp}} zwischen {{Partei A}} und {{Partei B}}. Pflichtabschnitte: Vertragsgegenstand, Leistungsumfang, Vergütung, Laufzeit/Kündigung, Haftung, Datenschutz (DSGVO-Verweis), Gerichtsstand, Schlussbestimmungen. Markiere jeden Abschnitt der besondere rechtliche Prüfung erfordert mit [JURIST:IN PRÜFEN]. Format: Nummerierte Gliederung mit Kurzbeschreibung pro Abschnitt. HINWEIS: Dies ist ein Strukturierungsentwurf, keine Rechtsberatung.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "Vertragsentwürfe können vertrauliche Konditionen enthalten",
  },
  {
    category: "Rechtsanalyse",
    title: "Rechtsänderung zusammenfassen",
    prompt: "Fasse die wesentlichen Änderungen durch {{Gesetz/Verordnung}} zusammen. Gliedere in: 1) Was ändert sich konkret? 2) Welche Abteilungen sind betroffen? 3) Welche Fristen gelten? 4) Welcher Handlungsbedarf besteht? Zielgruppe: Nicht-Juristen in der Geschäftsleitung. Sprache: verständlich, keine Fachbegriffe ohne Erklärung. Max. 1 Seite.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "mittel",
    confidentiality: "open",
    confidentialityReason: "Allgemeine Rechtsanalyse ohne interne Daten",
  },
  {
    category: "Datenschutz",
    title: "DSGVO-Prüfung Checkliste",
    prompt: "Erstelle eine Checkliste für die datenschutzrechtliche Prüfung von {{Verarbeitungsvorgang}}. Prüfpunkte: Rechtsgrundlage (Art. 6 DSGVO), Zweckbindung, Datenminimierung, Speicherdauer, Betroffenenrechte, TOM, Auftragsverarbeitung, DSFA erforderlich? Format: Checkliste mit ☐ pro Punkt, Spalte für Bewertung und Maßnahme.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "Kann konkrete Verarbeitungsvorgänge mit personenbezogenen Daten enthalten",
  },
  {
    category: "Verwaltungsrecht",
    title: "Widerspruchsbescheid-Entwurf",
    prompt: "Formuliere einen Entwurf für einen {{Abhilfe-/Zurückweisungsbescheid}} zum Widerspruch gegen {{Ausgangsbescheid}}. Struktur: Tenor, Sachverhalt (kurz), Begründung mit Rechtsgrundlage {{relevante Norm}}, Rechtsbehelfsbelehrung, Kostenentscheidung. Sprache: verwaltungsrechtlich korrekt, sachlich. [JURIST:IN PRÜFEN] vor Versand. Alle Angaben sind Entwürfe.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "Bescheide mit Rechtswirkung, können personenbezogene Daten enthalten",
  },
  {
    category: "Vertragsrecht",
    title: "Klausel-Vergleich",
    prompt: "Vergleiche die folgenden zwei Klausel-Varianten für {{Vertragsabschnitt}}: Variante A: {{Text A}} / Variante B: {{Text B}}. Analysiere: Welche ist für unsere Organisation vorteilhafter? Welche Risiken birgt jede? Gibt es AGB-rechtliche Probleme (§§ 305ff. BGB)? Empfehlung mit Begründung.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "hoch",
    confidentiality: "confidential",
  },
  {
    category: "Compliance",
    title: "Compliance-Bericht strukturieren",
    prompt: "Erstelle eine Gliederung für einen Compliance-Bericht zum Thema {{Compliance-Bereich}}. Abschnitte: Zusammenfassung, Prüfungsgegenstand, Methodik, Feststellungen (kategorisiert nach Schwere), Empfehlungen, Maßnahmenplan mit Fristen, Verantwortlichkeiten. Max. 5 Seiten.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "mittel",
    confidentiality: "internal",
    confidentialityReason: "Interne Compliance-Informationen",
  },
  {
    category: "Verwaltungsrecht",
    title: "Fristenübersicht erstellen",
    prompt: "Erstelle eine Fristenübersicht für {{Verfahren/Vorgang}}. Pro Frist: Was, Rechtsgrundlage, Fristbeginn, Fristende, Konsequenz bei Versäumnis, Verantwortliche Stelle. Format: Tabelle, chronologisch sortiert. Markiere Fristen unter 14 Tagen als dringend.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Vergaberecht",
    title: "Vergaberecht-Prüfung",
    prompt: "Prüfe ob der geplante Auftrag {{Beschreibung}} mit geschätztem Volumen {{Betrag}} vergaberechtlich ausschreibungspflichtig ist. Prüfschema: EU-Schwellenwerte, nationale Schwellenwerte, Ausnahmetatbestände. Empfehlung: Verfahrensart und nächste Schritte.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Datenschutz",
    title: "DSFA Vorprüfung",
    prompt: "Führe eine Vorprüfung durch, ob für {{Verarbeitungsvorgang}} eine Datenschutz-Folgenabschätzung (DSFA) nach Art. 35 DSGVO erforderlich ist. Prüfe die Blacklist-Kriterien der DSK. Ergebnis: Ja/Nein mit Begründung. Falls ja: Gliederung für die DSFA.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "hoch",
    confidentiality: "confidential",
  },
  {
    category: "Organisationsrecht",
    title: "Interne Richtlinie strukturieren",
    prompt: "Erstelle die Struktur für eine interne Richtlinie zum Thema {{Thema}}. Abschnitte: Zweck und Geltungsbereich, Definitionen, Grundsätze, Verantwortlichkeiten, Verfahren, Dokumentationspflichten, Inkrafttreten, Änderungshistorie. Verständliche Sprache, max. 5 Seiten.",
    level: "organisation",
    targetDepartment: "legal",
    riskLevel: "niedrig",
    confidentiality: "internal",
  },

  // ═══ ABTEILUNG ÖFFENTLICHKEITSARBEIT ═══
  {
    category: "Pressearbeit",
    title: "Pressemitteilung erstellen",
    prompt: "Erstelle eine Pressemitteilung zum Thema {{Anlass/Beschluss}}. Struktur: Headline (max. 10 Wörter), Lead-Absatz (Wer, Was, Wann, Wo), Platzhalter für Zitat der Organisationsleitung [ZITAT LEITUNG], Hintergrund-Absatz, Kontaktdaten Pressestelle. Sprache: sachlich-informativ, barrierefrei (Sprachniveau B1), gendersensibel. Länge: 250–350 Wörter. [LEITUNG PRÜFEN] vor Veröffentlichung.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "mittel",
    confidentiality: "internal",
    confidentialityReason: "Pressemitteilungen vor Veröffentlichung sind intern",
  },
  {
    category: "Social Media",
    title: "Behörden-Social-Media-Post",
    prompt: "Erstelle einen Social-Media-Post für {{Plattform}} zum Thema {{Thema}}. Zielgruppe: {{Zielgruppe}}. Ton: sachlich-nahbar, keine Übertreibungen. Zeichenlimit: {{Limit}}. Inkludiere 2–3 Hashtags. Barrierefrei: Alternativtext für Bild vorschlagen. Gendersensible Sprache. Keine personenbezogenen Daten. Keine verbindlichen Zusagen.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "niedrig",
    confidentiality: "open",
  },
  {
    category: "Bürgerinformation",
    title: "Bürgerinformation verfassen",
    prompt: "Erstelle eine Bürgerinformation zum Thema {{Thema/Verfahren}}. Zielgruppe: Bürger:innen ohne Fachkenntnisse. Sprachniveau: B1 (einfache Sprache). Format: FAQ mit 5–8 Fragen und Antworten. Gendersensible Sprache. Keine Fachbegriffe ohne Erklärung. Inkludiere Kontaktmöglichkeiten und nächste Schritte für Bürger:innen.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "niedrig",
    confidentiality: "open",
  },
  {
    category: "Krisenkommunikation",
    title: "Krisenkommunikation Erste Stellungnahme",
    prompt: "Erstelle eine erste Stellungnahme zu {{Krisenereignis}}. Regeln: NUR gesicherte Fakten verwenden. Keine Schuldzuweisungen, keine Spekulationen. Struktur: 1) Was ist passiert (bestätigte Fakten), 2) Welche Maßnahmen wurden ergriffen, 3) Nächste Schritte, 4) Ansprechpartner. Max. 200 Wörter. Ton: sachlich, empathisch, handlungsorientiert. [LEITUNG PRÜFEN] — MUSS vor Veröffentlichung freigegeben werden.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "Krisenrelevante Informationen vor Freigabe streng vertraulich",
  },
  {
    category: "Jahresbericht",
    title: "Jahresbericht-Kapitel erstellen",
    prompt: "Erstelle ein Kapitel für den Jahresbericht zum Thema {{Thema/Abteilung}}. Struktur: Einleitung (3 Sätze), Highlights des Jahres (3–5 Bullet Points), Kennzahlen-Tabelle (Platzhalter), Ausblick auf kommendes Jahr. Sprache: sachlich-positiv, ohne Übertreibungen. Länge: 400–600 Wörter. Gendersensibel.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "niedrig",
    confidentiality: "internal",
  },
  {
    category: "Website",
    title: "FAQ für Website erstellen",
    prompt: "Erstelle eine FAQ-Seite zum Thema {{Thema}} für die Organisationswebsite. 8–10 Fragen und Antworten. Zielgruppe: Bürger:innen. Sprache: Sprachniveau B1, barrierefrei, gendersensibel. Jede Antwort max. 100 Wörter. Inkludiere Verlinkungen zu weiterführenden Informationen (als Platzhalter [LINK: ...]). Keine personenbezogenen Daten.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "niedrig",
    confidentiality: "open",
  },
  {
    category: "Interner Newsletter",
    title: "Newsletter intern verfassen",
    prompt: "Erstelle einen internen Newsletter für Mitarbeitende zum Thema {{Thema}}. Abschnitte: Begrüßung, Hauptnachricht (max. 200 Wörter), 2–3 Kurzmeldungen (je 50 Wörter), Termine, Kontakt für Rückfragen. Ton: informativ, wertschätzend, kollegial. Keine externen vertraulichen Informationen.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "niedrig",
    confidentiality: "internal",
  },
  {
    category: "Rede",
    title: "Rede-Entwurf erstellen",
    prompt: "Erstelle einen Rede-Entwurf für {{Anlass}} durch {{Redner:in/Funktion}}. Dauer: {{Minuten}} Minuten. Struktur: Begrüßung, Einleitung mit Anknüpfungspunkt, 2–3 Kernbotschaften, Zusammenfassung, Ausblick/Appell. Platzhalter für persönliche Anekdoten [PERSÖNLICH ERGÄNZEN]. Ton: {{sachlich/motivierend/feierlich}}. [LEITUNG PRÜFEN].",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Barrierefreiheit",
    title: "Barrierefreie Zusammenfassung",
    prompt: "Erstelle eine barrierefreie Zusammenfassung des Textes: {{Text oder Thema}}. Anforderungen: Sprachniveau A2/B1 (Leichte Sprache), kurze Sätze (max. 12 Wörter), ein Gedanke pro Satz, keine Fremdwörter, keine Abkürzungen ohne Erklärung. Format: Überschrift + 5–8 kurze Absätze. Gendersensibel.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "niedrig",
    confidentiality: "open",
  },
  {
    category: "Social Media",
    title: "Social-Media-Antwort Bürgeranfrage",
    prompt: "Formuliere eine Antwort auf folgende Bürgeranfrage auf {{Plattform}}: '{{Anfrage-Text}}'. Ton: sachlich-nahbar, empathisch. KEINE verbindlichen Zusagen machen. Verweise auf offizielle Kontaktwege (E-Mail, Telefon). Max. 280 Zeichen. Falls die Anfrage personenbezogene Daten enthält: Hinweis auf private Nachricht geben. Keine Schuldzuweisungen an Dritte.",
    level: "organisation",
    targetDepartment: "oeffentlichkeitsarbeit",
    riskLevel: "niedrig",
    confidentiality: "open",
  },

  // ═══ ABTEILUNG HR ═══
  {
    category: "Stellenausschreibung",
    title: "AGG-konforme Stellenausschreibung",
    prompt: "Erstelle eine Stellenausschreibung für die Position {{Stellenbezeichnung}} ({{Entgeltgruppe TVöD}}). Abschnitte: Aufgabenbeschreibung (5–7 Punkte), Anforderungsprofil (fachlich + persönlich), Wir bieten (Benefits, TVöD, Zusatzversorgung), Bewerbungshinweise. AGG-konform: gendersensible Sprache, keine diskriminierenden Anforderungen. Besonderheiten: {{Teilzeitfähig/Homeoffice/Sicherheitsüberprüfung}}. Max. 1 Seite.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Arbeitszeugnis",
    title: "Arbeitszeugnis-Entwurf",
    prompt: "Erstelle einen Entwurf für ein qualifiziertes Arbeitszeugnis. Position: {{Position}}, Beschäftigungsdauer: {{Zeitraum}}, Leistungsbewertung: Stufe {{1-5}} (1=sehr gut, 5=mangelhaft). Verwende übliche Zeugnissprache nach §109 GewO. Abschnitte: Einleitung, Aufgabenbeschreibung, Leistungsbeurteilung, Sozialverhalten, Schlussformel. Wohlwollend formulieren, keine versteckten Negativcodes. KEINE echten Namen verwenden — nur Platzhalter {{Name}}. [HR-LEITUNG PRÜFEN] vor Aushändigung.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "Arbeitszeugnisse enthalten personenbezogene Leistungsdaten",
  },
  {
    category: "Interview",
    title: "Interview-Leitfaden STAR-Methode",
    prompt: "Erstelle einen strukturierten Interview-Leitfaden für die Position {{Position}}. Methode: STAR (Situation, Task, Action, Result). 8 Fragen: 4 fachliche, 2 Kultur-Fit, 2 Stressfragen. Pro Frage: Erwartete Antwortstruktur, Follow-up-Frage, Red Flags. Zeitplan: 45 Minuten gesamt. AGG-konform: KEINE Fragen zu Familienplanung, Religion, Gesundheit, Herkunft. Bewertungsraster 1–5 pro Frage.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Fortbildung",
    title: "Fortbildungsplan erstellen",
    prompt: "Erstelle einen Fortbildungsplan für {{Abteilung/Rolle}} für das Jahr {{Jahr}}. Pro Quartal: 1–2 Maßnahmen mit Thema, Format (Präsenz/Online/Blended), geschätzter Dauer, geschätzten Kosten, Lernziel. Berücksichtige: Pflichtfortbildungen (Datenschutz, Arbeitssicherheit), fachliche Weiterbildung, Soft Skills. Format: Tabelle mit Spalten Quartal, Thema, Format, Dauer, Kosten, Priorität.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "niedrig",
    confidentiality: "open",
  },
  {
    category: "Onboarding",
    title: "Onboarding-Checkliste",
    prompt: "Erstelle eine Onboarding-Checkliste für neue Mitarbeitende in der Abteilung {{Abteilung}}. Phasen: Vor dem ersten Tag (5 Punkte), Erste Woche (10 Punkte), Erster Monat (5 Punkte), Probezeit-Ende (3 Punkte). Pro Punkt: Aufgabe, Verantwortliche Person, Frist. Inkludiere: IT-Ausstattung, Zugänge, Einführungsgespräche, Buddy-System, Pflichtunterweisungen.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "niedrig",
    confidentiality: "internal",
  },
  {
    category: "Mitarbeitergespräch",
    title: "Mitarbeitergespräch vorbereiten",
    prompt: "Erstelle einen Leitfaden für ein {{jährliches/halbjährliches}} Mitarbeitergespräch. Struktur: Rückblick (Zielerreichung, besondere Leistungen), Feedback (bidirektional), Entwicklungswünsche, Zielvereinbarung für nächste Periode (SMART-Kriterien), offene Punkte. Dauer: 60 Minuten. Hinweis: KEINE echten Mitarbeiternamen in KI-Prompts eingeben. Verwende Platzhalter.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Konfliktmanagement",
    title: "Konflikt-Gesprächsleitfaden",
    prompt: "Erstelle einen Gesprächsleitfaden für ein Konfliktgespräch zwischen {{Rolle A}} und {{Rolle B}} zum Thema {{Konfliktthema}}. Phasen: 1) Eröffnung (neutral, wertschätzend), 2) Perspektiven beider Seiten hören, 3) Gemeinsame Interessen identifizieren, 4) Lösungsoptionen erarbeiten, 5) Vereinbarung festhalten. Dauer: 45 Minuten. Hinweise: Keine Schuldzuweisungen, Ich-Botschaften, Vertraulichkeit betonen. KEINE echten Namen verwenden.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Abwesenheit",
    title: "Abwesenheitsregelung erstellen",
    prompt: "Erstelle eine Abwesenheitsregelung für die Abteilung {{Abteilung}} mit {{Anzahl}} Mitarbeitenden. Inhalte: Vertretungsplan (wer vertritt wen), Mindestbesetzung pro Bereich, Genehmigungsprozess für Urlaub/Gleittage, Sperrzeiten, Dokumentation der Vertretung, Erreichbarkeit im Krankheitsfall. Format: Übersichtliche Regelung, max. 2 Seiten.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "niedrig",
    confidentiality: "internal",
  },
  {
    category: "Dienstvereinbarung",
    title: "Dienstvereinbarung KI-Nutzung",
    prompt: "Erstelle einen Entwurf für eine Dienstvereinbarung zur KI-Nutzung am Arbeitsplatz. Abschnitte: Geltungsbereich, zugelassene KI-Tools, verbotene Nutzungen (personenbezogene Daten, Entscheidungsautomatisierung), Datenschutzauflagen, Kennzeichnungspflicht KI-generierter Inhalte, Schulungspflicht, Mitbestimmung des Personalrats, Evaluierung nach 12 Monaten. [HR-LEITUNG PRÜFEN]. Hinweis: Entwurf, keine Rechtsberatung.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "Interne Vereinbarung mit arbeitsrechtlicher Relevanz",
  },
  {
    category: "Personalplanung",
    title: "Personalbedarfsplanung",
    prompt: "Erstelle eine Personalbedarfsplanung für {{Abteilung/Bereich}} für den Zeitraum {{Zeitraum}}. Analyse: Aktueller Personalbestand (Platzhalter), geplante Abgänge (Ruhestand, Fluktuation), neue Aufgaben/Projekte, Qualifikationsbedarf. Format: Tabelle mit Spalten Stelle, aktuell besetzt, Bedarf, Delta, Priorität, Maßnahme (Ausschreibung/Fortbildung/Umverteilung). KEINE echten Personalnummern oder Namen.",
    level: "organisation",
    targetDepartment: "hr",
    riskLevel: "mittel",
    confidentiality: "internal",
  },

  // ═══ ABTEILUNG IT ═══
  {
    category: "Incident Management",
    title: "Störungsmeldung strukturieren",
    prompt: "Erstelle eine strukturierte Störungsmeldung. Betroffenes System: {{Systemname}}. Fehlerbild: {{Beschreibung}}. Ersterkennung: {{Zeitpunkt}}. Auswirkung: {{Nutzeranzahl}} Nutzer betroffen, {{Prozess}} eingeschränkt. Format: Störungsmeldung mit Abschnitten Symptom, Auswirkung, Erste Maßnahmen, Nächste Schritte. Priorität: {{P1-P4}}. KEINE echten Servernamen, IP-Adressen oder Passwörter verwenden — nur Platzhalter.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "niedrig",
    confidentiality: "internal",
  },
  {
    category: "Anforderungsmanagement",
    title: "Anforderungsdokument User Stories",
    prompt: "Erstelle ein Anforderungsdokument für {{Projektname/System}}. Format: User Stories nach Schema 'Als [Rolle] möchte ich [Funktionalität], damit [Nutzen]'. Priorisierung: MoSCoW (Must/Should/Could/Won't). Mindestens 10 User Stories. Pro Story: Akzeptanzkriterien (3 Stück), Abhängigkeiten, Aufwandsschätzung (S/M/L). Berücksichtige BITV 2.0 (Barrierefreiheit). Nicht-funktionale Anforderungen: Performance, Sicherheit, Skalierbarkeit.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "niedrig",
    confidentiality: "internal",
  },
  {
    category: "IT-Sicherheit",
    title: "IT-Sicherheitskonzept BSI-Grundschutz",
    prompt: "Erstelle eine Gliederung für ein IT-Sicherheitskonzept nach BSI IT-Grundschutz für {{Systemname/Verbund}}. Abschnitte: Strukturanalyse, Schutzbedarfsfeststellung (Vertraulichkeit, Integrität, Verfügbarkeit), Modellierung (relevante BSI-Bausteine), Risikoanalyse, Maßnahmenplan. KEINE echten Systemnamen, IP-Adressen oder Netzwerktopologien in den Prompt eingeben. Verwende generische Bezeichnungen.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "IT-Sicherheitskonzepte enthalten sicherheitskritische Informationen",
  },
  {
    category: "Migration",
    title: "Migrationsleitfaden erstellen",
    prompt: "Erstelle einen Migrationsleitfaden für die Ablösung von {{Altsystem}} durch {{Neusystem}}. Phasen: 1) Bestandsaufnahme (Daten, Schnittstellen, Nutzer), 2) Migrationsplanung (Strategie: Big Bang vs. Parallel), 3) Testphase (Testszenarien), 4) Durchführung (Zeitplan), 5) Nachbereitung (Validierung, Abschaltung). Risiken und Fallback-Plan pro Phase. Format: Projektplan mit Meilensteinen.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Datenschutz",
    title: "TOM dokumentieren",
    prompt: "Erstelle eine Dokumentation der technischen und organisatorischen Maßnahmen (TOM) nach Art. 32 DSGVO für {{System/Verarbeitungsvorgang}}. Bereiche: Zutrittskontrolle, Zugangskontrolle, Zugriffskontrolle, Weitergabekontrolle, Eingabekontrolle, Verfügbarkeitskontrolle, Trennungsgebot. Pro Bereich: Maßnahme, Umsetzungsstatus, Verantwortlich. Format: Tabelle. KEINE konkreten Systeminterna oder Passwortrichtlinien-Details.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Beschaffung",
    title: "IT-Beschaffung Kriterienkatalog",
    prompt: "Erstelle einen Kriterienkatalog für die Beschaffung von {{IT-Produkt/Dienstleistung}}. Bewertungskategorien: Funktionale Anforderungen (40%), Kosten (25%), Sicherheit/Datenschutz (20%), Service/Support (15%). Pro Kategorie: 3–5 Kriterien mit Gewichtung. Format: Bewertungsmatrix zum Ausfüllen. Berücksichtige Vergaberecht bei Überschreitung von Schwellenwerten. EVB-IT Vertragstyp empfehlen.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Dokumentation",
    title: "Benutzerhandbuch erstellen",
    prompt: "Erstelle ein Benutzerhandbuch für {{Anwendung/System}}. Zielgruppe: {{Endanwender/Administratoren}}. Abschnitte: Einleitung und Systemvoraussetzungen, Erste Schritte (Login, Navigation), Kernfunktionen (je mit Screenshots-Platzhalter [SCREENSHOT: ...]), Häufige Fragen (5 Stück), Fehlerbehebung (5 typische Probleme), Kontakt IT-Support. Sprache: verständlich, keine IT-Fachbegriffe ohne Erklärung. Barrierefrei.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "niedrig",
    confidentiality: "open",
  },
  {
    category: "Patch-Management",
    title: "Patch-Management Prozess",
    prompt: "Erstelle einen Patch-Management-Prozess für {{Systemkategorie}}. Abschnitte: Patch-Erkennung (Quellen: Hersteller, BSI, CVE), Risikobewertung (CVSS-basiert), Testverfahren, Freigabeprozess, Rollout-Planung (Zeitfenster, Reihenfolge), Fallback-Plan, Dokumentation. Zeitvorgaben: Kritisch <24h, Hoch <7 Tage, Mittel <30 Tage, Niedrig nächster Wartungszyklus. KEINE echten Systemnamen.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Datenschutz",
    title: "DSFA technische Maßnahmen",
    prompt: "Erstelle den technischen Maßnahmenteil einer Datenschutz-Folgenabschätzung (DSFA) für {{Verarbeitungsvorgang}}. Risiken identifizieren und bewerten (Eintrittswahrscheinlichkeit × Schwere). Pro Risiko: Technische Maßnahme, Restrisiko nach Maßnahme, Verantwortlich. Kategorien: Verschlüsselung, Pseudonymisierung, Zugriffskontrolle, Protokollierung, Backup/Wiederherstellung. KEINE konkreten Systemdetails.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "DSFA enthält sicherheitskritische Risikobewertungen",
  },
  {
    category: "Ausschreibung",
    title: "Ausschreibungstext IT-Dienstleistung",
    prompt: "Erstelle einen Ausschreibungstext für die IT-Dienstleistung {{Leistungsbeschreibung}}. Abschnitte: Ausgangslage, Leistungsgegenstand, Anforderungen (funktional + nicht-funktional), Vertragslaufzeit, Eignungskriterien (Referenzen, Zertifizierungen), Zuschlagskriterien mit Gewichtung, Angebotsfrist, Verfahrenshinweise. Berücksichtige EVB-IT Vertragstypen. Format: Förmlich, vergaberechtskonform.",
    level: "organisation",
    targetDepartment: "it",
    riskLevel: "mittel",
    confidentiality: "internal",
  },

  // ═══ FACHABTEILUNG BAUVERFAHREN ═══
  {
    category: "Bauantragsverfahren",
    title: "Vollständigkeitsprüfung Bauantrag",
    prompt: "Erstelle eine Checkliste zur Vollständigkeitsprüfung eines Bauantrags für {{Vorhaben}} gemäß {{BauO des Landes}}. Prüfpunkte: Bauantragsformular, amtlicher Lageplan, Bauzeichnungen (Grundrisse, Schnitte, Ansichten), Baubeschreibung, Standsicherheitsnachweis, Stellplatznachweis, Entwässerungsnachweis, Wärmeschutznachweis. Format: Checkliste mit ☐ vorhanden / ☐ fehlt / ☐ mangelhaft. Ergänze typische Mängel-Hinweise pro Unterlage. Keine echten Aktenzeichen verwenden.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Bescheidwesen",
    title: "Ablehnungsbescheid-Entwurf Bauantrag",
    prompt: "Erstelle einen Entwurf für einen Ablehnungsbescheid zum Bauantrag für {{Vorhaben}}. Struktur: Tenor (Ablehnung), Sachverhalt (Antrag vom {{Datum}}, Vorhaben, Lage), Begründung (Verstoß gegen {{Norm}}, z.B. §34 BauGB Einfügungsgebot), Rechtsbehelfsbelehrung (Klage beim VG innerhalb eines Monats). [ZEICHNUNGSBEFUGT PRÜFEN] vor Versand. Keine echten Aktenzeichen oder Antragstellerdaten. Hinweis: Entwurf ohne Rechtswirkung.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "Bescheide mit Rechtswirkung, können personenbezogene Daten enthalten",
  },
  {
    category: "TÖB-Beteiligung",
    title: "TÖB-Stellungnahmen zusammenfassen",
    prompt: "Fasse die Stellungnahmen der Träger öffentlicher Belange (TÖB) zum {{Verfahren/B-Plan}} zusammen. Gruppiere nach: 1) Zustimmung ohne Auflagen, 2) Zustimmung mit Auflagen/Bedingungen, 3) Bedenken/Ablehnungen. Pro Stellungnahme: TÖB-Name, Kernaussage, geforderte Auflagen, Handlungsbedarf. Format: Synopse-Tabelle. Anonymisiere Sachbearbeiter-Namen.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Nachbarbeteiligung",
    title: "Nachbarschafts-Anhörung Anschreiben",
    prompt: "Erstelle ein Anschreiben zur Nachbarbeteiligung gemäß {{BauO-Paragraph}} für das Vorhaben {{Vorhaben}} auf dem Grundstück {{Adresse/Flurstück (Platzhalter)}}. Inhalt: Hinweis auf Bauantrag, Beschreibung des Vorhabens, Abweichungen die Nachbarrechte berühren können, Frist für Stellungnahme (üblicherweise 4 Wochen), Hinweis auf Rechtsfolge bei Nichtäußerung. Formell, sachlich. Keine echten Antragstellerdaten.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Bebauungsplanung",
    title: "B-Plan Zusammenfassung für Ausschuss",
    prompt: "Erstelle eine Zusammenfassung des Bebauungsplans {{B-Plan-Nummer}} für die Ausschussvorlage. Zielgruppe: Ausschussmitglieder (keine Fachleute). Struktur: Anlass und Ziel, Lage und Geltungsbereich, Wesentliche Festsetzungen (Art/Maß der Nutzung, Bauweise), Ergebnisse der Beteiligung, Umweltbericht-Kurzfassung, Empfehlung der Verwaltung. Max. 2 Seiten. Verständliche Sprache.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Planungsrecht",
    title: "Nutzungsänderung §34 BauGB Prüfschema",
    prompt: "Erstelle ein Prüfschema für die planungsrechtliche Zulässigkeit einer Nutzungsänderung nach §34 BauGB. Vorhaben: {{aktuelle Nutzung}} → {{geplante Nutzung}}. Prüfpunkte: 1) Innerhalb im Zusammenhang bebauter Ortsteile? 2) Art der baulichen Nutzung: Fügt sich ein? (BauNVO-Gebietskategorie der Umgebung), 3) Maß der Nutzung, 4) Bauweise, 5) Überbaubare Grundstücksfläche, 6) Gesicherte Erschließung? Format: Prüfnotiz mit Bewertung pro Kriterium.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Baulast",
    title: "Baulasten-Erklärung vorbereiten",
    prompt: "Erstelle eine Vorlage für eine Baulasterklärung nach {{BauO-Paragraph}} für {{Art der Baulast: Abstandsfläche/Stellplatz/Zufahrt}}. Erläutere: Was ist eine Baulast? Welche Rechte/Pflichten entstehen? Verfahrensablauf (Antrag, Eintragung ins Baulastenverzeichnis). Muster-Text für die Erklärung mit Platzhaltern. Hinweis: Keine Rechtsberatung, [JURIST:IN PRÜFEN].",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Abweichung",
    title: "Abweichungsantrag Begründung",
    prompt: "Erstelle eine Begründungsstruktur für einen Antrag auf Abweichung/Befreiung von {{Festsetzung des B-Plans / Bauordnungsrechtliche Vorschrift}}. Prüfschema: 1) Worauf wird die Abweichung gestützt (§31 BauGB / §67 BauO)? 2) Städtebauliche Vertretbarkeit, 3) Nachbarrechtliche Würdigung, 4) Besondere Umstände. Format: Strukturierte Begründung mit Platzhaltern. Hinweis: KI-Text hat KEINE Rechtswirkung.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "mittel",
    confidentiality: "internal",
  },
  {
    category: "Bauordnungsrecht",
    title: "Bauordnungsverfügung Schwarzbau",
    prompt: "Erstelle einen Entwurf für eine Bauordnungsverfügung (Nutzungsuntersagung/Beseitigungsanordnung) wegen {{ungenehmigtes Vorhaben}}. Struktur: Tenor (Anordnung mit Frist), Sachverhalt, Ermessensausübung (Opportunitätsprinzip), Rechtsgrundlage ({{BauO-Paragraph}}), Rechtsbehelfsbelehrung, Androhung von Zwangsmitteln. [ZEICHNUNGSBEFUGT PRÜFEN]. Keine echten Daten. Entwurf ohne Rechtswirkung.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "hoch",
    confidentiality: "confidential",
    confidentialityReason: "Ordnungsverfügung mit Rechtswirkung",
  },
  {
    category: "Erschließung",
    title: "Erschließungsbeitrag erklären",
    prompt: "Erstelle eine verständliche Erklärung des Erschließungsbeitrags nach §§ 127ff. BauGB für Grundstückseigentümer:innen. Inhalt: Was ist ein Erschließungsbeitrag? Wer muss zahlen? Wie wird der Beitrag berechnet (beitragsfähiger Aufwand, Verteilungsmaßstab)? Welche Erschließungsanlagen sind betroffen? Rechtsbehelfe und Fristen. Sprache: Bürgerfreundlich, Sprachniveau B1. Format: Info-Blatt, 1 Seite.",
    level: "organisation",
    targetDepartment: "bauverfahren",
    riskLevel: "niedrig",
    confidentiality: "open",
  },
];
