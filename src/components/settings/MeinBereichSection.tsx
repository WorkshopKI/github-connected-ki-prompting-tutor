import { Card } from "@/components/ui/card";
import { useOrgContext, ORG_SCOPE_LABELS } from "@/contexts/OrgContext";
import type { OrgScope } from "@/types";

export function MeinBereichSection() {
  const { scope, setScope } = useOrgContext();

  return (
    <Card className="card-section space-y-4">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        🏷️ Mein Bereich
      </h3>
      <p className="text-xs text-muted-foreground -mt-2">
        Bestimmt welche Prompts, Beispiele und Use Cases dir angezeigt werden.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
    </Card>
  );
}
