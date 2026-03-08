import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useOrgContext, ORG_SCOPE_LABELS } from "@/contexts/OrgContext";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { LS_KEYS } from "@/lib/constants";
import type { OrgScope, PlatformSettings } from "@/types";

const defaultPlatform: PlatformSettings = {
  orgName: "Meine Organisation",
  language: "de",
  requireReview: true,
  autoQualityScoring: true,
  mandatoryOnboarding: true,
};

export function GeneralSettings() {
  const { scope, setScope } = useOrgContext();
  const [platform, setPlatform] = useState<PlatformSettings>(() => loadFromStorage(LS_KEYS.PLATFORM_SETTINGS, defaultPlatform));

  useEffect(() => {
    saveToStorage(LS_KEYS.PLATFORM_SETTINGS, platform);
  }, [platform]);

  return (
    <div className="space-y-6">
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
    </div>
  );
}
