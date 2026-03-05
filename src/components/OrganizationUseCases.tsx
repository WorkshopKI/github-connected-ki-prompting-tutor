import { useMemo, useState } from "react";
import { BadgeCheck, Briefcase, Building2, Copy, Filter, ShieldCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface OrgUseCase {
  title: string;
  department: "HR" | "Vertrieb" | "Support" | "Produkt" | "Legal";
  role: "Mitarbeitende" | "Teamlead" | "Admin";
  risk: "niedrig" | "mittel" | "hoch";
  goal: string;
  template: string;
  qualityCriteria: string[];
}

const orgUseCases: OrgUseCase[] = [
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

const riskStyles = {
  niedrig: "bg-emerald-100 text-emerald-700",
  mittel: "bg-amber-100 text-amber-700",
  hoch: "bg-rose-100 text-rose-700",
};

export const OrganizationUseCases = () => {
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("Alle");
  const [riskFilter, setRiskFilter] = useState<string>("Alle");

  const departments = ["Alle", "HR", "Vertrieb", "Support", "Produkt", "Legal"];
  const riskLevels = ["Alle", "niedrig", "mittel", "hoch"];

  const filtered = useMemo(
    () =>
      orgUseCases.filter((item) => {
        const q = query.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.goal.toLowerCase().includes(q) ||
          item.template.toLowerCase().includes(q);
        const matchesDepartment = departmentFilter === "Alle" || item.department === departmentFilter;
        const matchesRisk = riskFilter === "Alle" || item.risk === riskFilter;
        return matchesQuery && matchesDepartment && matchesRisk;
      }),
    [query, departmentFilter, riskFilter],
  );

  const copyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Use-Case-Template kopiert");
  };

  return (
    <section className="mb-16 md:mb-20" id="organisation">
      <div className="text-center mb-8">
        <span className="font-mono text-lg tracking-widest block mb-3" style={{ color: "hsl(var(--primary-deep))" }}>05</span>
        <div className="w-10 h-0.5 mx-auto mb-4" style={{ backgroundColor: "hsl(var(--primary-deep))" }} />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Use Cases im Unternehmenskontext</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Wähle Abteilung, Risiko-Level und Rolle. Nutze freigegebene Templates als Startpunkt für wiederholbare Team-Qualität.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card/80 p-4 md:p-6 mb-6 space-y-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Use Case suchen (z. B. Interview, Support, Vertragsklauseln)..."
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {departments.map((department) => (
            <Button
              key={department}
              size="sm"
              variant={departmentFilter === department ? "default" : "outline"}
              onClick={() => setDepartmentFilter(department)}
            >
              {department}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {riskLevels.map((risk) => (
            <Button
              key={risk}
              size="sm"
              variant={riskFilter === risk ? "default" : "outline"}
              onClick={() => setRiskFilter(risk)}
            >
              Risiko: {risk}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((useCase) => (
          <Card key={useCase.title} className="p-5 rounded-2xl border border-border/80">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-semibold text-base mb-1">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.goal}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${riskStyles[useCase.risk]}`}>
                {useCase.risk}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3 text-xs">
              <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded"><Building2 className="w-3 h-3" /> {useCase.department}</span>
              <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded"><Users className="w-3 h-3" /> {useCase.role}</span>
              <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded"><ShieldCheck className="w-3 h-3" /> Governance</span>
            </div>

            <div className="bg-muted/40 rounded-lg p-3 text-sm font-mono leading-relaxed mb-3 line-clamp-4">
              {useCase.template}
            </div>

            <div className="mb-4">
              <div className="text-xs font-semibold mb-2">Qualitätskriterien</div>
              <ul className="space-y-1">
                {useCase.qualityCriteria.map((criterion) => (
                  <li key={criterion} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5 mt-0.5 text-primary" />
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => copyTemplate(useCase.template)} size="sm" className="gap-2">
                <Copy className="w-4 h-4" /> Template kopieren
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Briefcase className="w-4 h-4" /> Als Team-Standard markieren
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-10">Keine Use Cases gefunden.</div>
      )}
    </section>
  );
};
