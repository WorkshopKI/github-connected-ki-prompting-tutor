import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ThemePresetPicker } from "@/components/ThemePresetPicker";
import { Separator } from "@/components/ui/separator";
import { useOrgContext, ORG_SCOPE_LABELS, type OrgScope } from "@/contexts/OrgContext";
import { loadAIRouting, saveAIRouting, type AIRoutingConfig } from "@/data/models";
import { ProfileContent } from "@/pages/Profile";

interface PlatformSettings {
  orgName: string;
  language: string;
  requireReview: boolean;
  autoQualityScoring: boolean;
  mandatoryOnboarding: boolean;
}

interface ComplianceSettings {
  detectSensitiveData: boolean;
  reviewHighRisk: boolean;
  auditLog: boolean;
  approvedModelsOnly: boolean;
}

function loadSettings<T>(key: string, defaults: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaults;
    return { ...defaults, ...JSON.parse(stored) };
  } catch {
    return defaults;
  }
}

function saveSettings(key: string, settings: object) {
  localStorage.setItem(key, JSON.stringify(settings));
}

const defaultPlatform: PlatformSettings = {
  orgName: "Meine Organisation",
  language: "de",
  requireReview: true,
  autoQualityScoring: true,
  mandatoryOnboarding: true,
};

const defaultCompliance: ComplianceSettings = {
  detectSensitiveData: false,
  reviewHighRisk: false,
  auditLog: false,
  approvedModelsOnly: false,
};

const roles = [
  {
    name: "Admin",
    description: "Vollzugriff auf alle Funktionen",
    color: "bg-primary/15 text-primary font-semibold",
    permissions: ["Prompts erstellen & bearbeiten", "Prompts verifizieren", "Rollen verwalten", "Einstellungen ändern", "Analytics einsehen", "Team verwalten"],
  },
  {
    name: "Prompt Champion",
    description: "Kann Prompts verifizieren und freigeben",
    color: "bg-primary/15 text-primary",
    permissions: ["Prompts erstellen & bearbeiten", "Prompts verifizieren", "Analytics einsehen", "Reviews durchführen"],
  },
  {
    name: "Editor",
    description: "Kann Prompts erstellen und bearbeiten",
    color: "bg-muted text-muted-foreground",
    permissions: ["Prompts erstellen & bearbeiten", "Eigene Prompts verwalten", "Onboarding absolvieren"],
  },
  {
    name: "Viewer",
    description: "Kann Prompts nutzen und bewerten",
    color: "bg-muted text-muted-foreground",
    permissions: ["Prompts ansehen & kopieren", "Prompts bewerten", "Onboarding absolvieren"],
  },
];

const Settings = () => {
  const { scope, setScope } = useOrgContext();
  const [platform, setPlatform] = useState<PlatformSettings>(() => loadSettings("platform_settings", defaultPlatform));
  const [compliance, setCompliance] = useState<ComplianceSettings>(() => loadSettings("compliance_settings", defaultCompliance));
  const [aiRouting, setAiRouting] = useState<AIRoutingConfig>(() => loadAIRouting());

  useEffect(() => {
    saveSettings("platform_settings", platform);
  }, [platform]);

  useEffect(() => {
    saveSettings("compliance_settings", compliance);
  }, [compliance]);

  useEffect(() => {
    saveAIRouting(aiRouting);
  }, [aiRouting]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Konto, Plattform-Konfiguration und Governance
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Mein Konto</TabsTrigger>
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="roles">Rollen & Rechte</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="ai">KI-Konfiguration</TabsTrigger>
          <TabsTrigger value="appearance">Darstellung</TabsTrigger>
        </TabsList>

        {/* Account */}
        <TabsContent value="account">
          <ProfileContent />
        </TabsContent>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-5 rounded-xl border border-border shadow-sm space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Mein Bereich</label>
              <p className="text-xs text-muted-foreground mb-3">
                Bestimmt welche Prompts, Beispiele und Use Cases dir angezeigt werden.
              </p>
              <div className="space-y-1.5">
                {(Object.entries(ORG_SCOPE_LABELS) as [OrgScope, string][]).map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      scope === key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orgScope"
                      value={key}
                      checked={scope === key}
                      onChange={() => setScope(key)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      scope === key ? "border-primary" : "border-muted-foreground/30"
                    }`}>
                      {scope === key && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <span className="text-sm font-medium">{label}</span>
                      {key === "privat" && (
                        <p className="text-xs text-muted-foreground">Allgemeine Prompts für den Alltag</p>
                      )}
                      {key === "organisation" && (
                        <p className="text-xs text-muted-foreground">Alle Abteilungen, Überblick für Admins</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium block mb-1">Organisationsname</label>
              <Input
                value={platform.orgName}
                onChange={(e) => setPlatform((p) => ({ ...p, orgName: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Standard-Sprache</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={platform.language}
                onChange={(e) => setPlatform((p) => ({ ...p, language: e.target.value }))}
              >
                <option value="de">Deutsch</option>
                <option value="en">Englisch</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between">
                <span className="text-sm">Prompt-Review für neue Prompts erforderlich</span>
                <Switch
                  checked={platform.requireReview}
                  onCheckedChange={(v) => setPlatform((p) => ({ ...p, requireReview: v }))}
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Automatisches Quality-Scoring</span>
                <Switch
                  checked={platform.autoQualityScoring}
                  onCheckedChange={(v) => setPlatform((p) => ({ ...p, autoQualityScoring: v }))}
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Onboarding für neue Mitglieder verpflichtend</span>
                <Switch
                  checked={platform.mandatoryOnboarding}
                  onCheckedChange={(v) => setPlatform((p) => ({ ...p, mandatoryOnboarding: v }))}
                />
              </label>
            </div>
          </Card>

        </TabsContent>

        {/* Roles */}
        <TabsContent value="roles" className="space-y-4">
          {roles.map((role) => (
            <Card key={role.name} className="p-5 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={role.color}>{role.name}</Badge>
                  <span className="text-sm text-muted-foreground">{role.description}</span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" disabled>Bearbeiten</Button>
                  </TooltipTrigger>
                  <TooltipContent>Kommt in v2</TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-1.5">
                {role.permissions.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" checked disabled className="rounded" />
                    {perm}
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="space-y-6">
          <Alert variant="destructive" className="border-amber-200 bg-amber-50 text-amber-800">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription>
              Definieren Sie Regeln für die Prompt-Erstellung in Ihrer Organisation.
            </AlertDescription>
          </Alert>

          <Card className="p-5 rounded-xl border border-border shadow-sm space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Sensible Daten in Prompts automatisch erkennen</span>
              <Switch
                checked={compliance.detectSensitiveData}
                onCheckedChange={(v) => setCompliance((c) => ({ ...c, detectSensitiveData: v }))}
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Review-Pflicht für Prompts mit Risiko „hoch"</span>
              <Switch
                checked={compliance.reviewHighRisk}
                onCheckedChange={(v) => setCompliance((c) => ({ ...c, reviewHighRisk: v }))}
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Audit-Log aktivieren</span>
              <Switch
                checked={compliance.auditLog}
                onCheckedChange={(v) => setCompliance((c) => ({ ...c, auditLog: v }))}
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Nur freigegebene LLM-Modelle erlauben</span>
              <Switch
                checked={compliance.approvedModelsOnly}
                onCheckedChange={(v) => setCompliance((c) => ({ ...c, approvedModelsOnly: v }))}
              />
            </label>
          </Card>
        </TabsContent>

        {/* AI Configuration */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="p-5 rounded-xl border border-border shadow-sm space-y-5">
            <h3 className="font-semibold text-base">KI-Endpunkte</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏢</span>
                  <span className="font-semibold text-sm">Interne KI</span>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Endpoint-URL</label>
                  <Input
                    placeholder="https://internal-llm.example.local/v1"
                    value={aiRouting.internalEndpoint}
                    onChange={(e) => setAiRouting((r) => ({ ...r, internalEndpoint: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Modell</label>
                  <Input
                    placeholder="z.B. llama-3.3-70b-instruct"
                    value={aiRouting.internalModel}
                    onChange={(e) => setAiRouting((r) => ({ ...r, internalModel: e.target.value }))}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Daten verlassen die Organisation nicht
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">☁️</span>
                  <span className="font-semibold text-sm">Externe Business-API</span>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Anbieter</label>
                  <Input
                    placeholder="z.B. Azure OpenAI, AWS Bedrock, Anthropic"
                    value={aiRouting.externalProvider}
                    onChange={(e) => setAiRouting((r) => ({ ...r, externalProvider: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Modell</label>
                  <Input
                    placeholder="z.B. gpt-4o, claude-opus-4"
                    value={aiRouting.externalModel}
                    onChange={(e) => setAiRouting((r) => ({ ...r, externalModel: e.target.value }))}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Leistungsstärker, aber Daten werden an Drittanbieter übermittelt
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 rounded-xl border border-border shadow-sm space-y-4">
            <h3 className="font-semibold text-base">Routing-Regeln</h3>
            {[
              {
                icon: "🔴",
                label: "Vertrauliche Prompts",
                field: "confidentialRouting" as const,
                options: [
                  { value: "internal-only", label: "Nur interne KI (erzwungen)" },
                  { value: "internal-with-approval", label: "Extern mit expliziter Freigabe" },
                ],
              },
              {
                icon: "🟡",
                label: "Interne Prompts",
                field: "internalRouting" as const,
                options: [
                  { value: "prefer-internal", label: "Interne KI bevorzugt, extern erlaubt" },
                  { value: "internal-only", label: "Nur interne KI" },
                ],
              },
              {
                icon: "🟢",
                label: "Offene Prompts",
                field: "openRouting" as const,
                options: [
                  { value: "prefer-external", label: "Externe API bevorzugt" },
                  { value: "prefer-internal", label: "Interne KI bevorzugt" },
                ],
              },
            ].map((rule) => (
              <div key={rule.field} className="p-3 rounded-lg bg-muted/30 space-y-2">
                <div className="text-sm font-medium">{rule.icon} {rule.label}</div>
                <div className="space-y-1 ml-6">
                  {rule.options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="radio"
                        name={rule.field}
                        checked={aiRouting[rule.field] === opt.value}
                        onChange={() => setAiRouting((r) => ({ ...r, [rule.field]: opt.value }))}
                        className="accent-primary"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="border-t border-border pt-3 space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">Warnung vor jeder externen API-Nutzung</span>
                <Switch
                  checked={aiRouting.warnOnExternal}
                  onCheckedChange={(v) => setAiRouting((r) => ({ ...r, warnOnExternal: v }))}
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Audit-Log für alle KI-Anfragen</span>
                <Switch
                  checked={aiRouting.auditLog}
                  onCheckedChange={(v) => setAiRouting((r) => ({ ...r, auditLog: v }))}
                />
              </label>
            </div>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="p-5 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold mb-4">Theme</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Aktuelles Theme wählen:</span>
              <ThemePresetPicker />
            </div>
          </Card>

          <Card className="p-5 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold mb-2">Logo</h3>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
              Logo hochladen — kommt in v2
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
