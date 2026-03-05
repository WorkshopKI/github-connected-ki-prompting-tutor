import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { ThemePresetPicker } from "@/components/ThemePresetPicker";

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
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<PlatformSettings>(() => loadSettings("platform_settings", defaultPlatform));
  const [compliance, setCompliance] = useState<ComplianceSettings>(() => loadSettings("compliance_settings", defaultCompliance));

  useEffect(() => {
    saveSettings("platform_settings", platform);
  }, [platform]);

  useEffect(() => {
    saveSettings("compliance_settings", compliance);
  }, [compliance]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Plattform-Konfiguration und Governance
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="roles">Rollen & Rechte</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="appearance">Darstellung</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-5 rounded-xl border border-border shadow-sm space-y-4">
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

          <div className="pt-2">
            <Button variant="link" className="gap-1.5 p-0" onClick={() => navigate("/profil")}>
              Persönliche Einstellungen <ExternalLink className="w-3.5 h-3.5" /> Profil
            </Button>
          </div>
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
