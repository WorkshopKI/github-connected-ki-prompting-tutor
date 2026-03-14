import { loadKIContext } from "@/services/kiContextService";
import { getActiveConstraints } from "@/services/constraintService";

export function getActiveRuleCount(): number {
  const ctx = loadKIContext();
  const activeWorkRules = ctx.workRules.filter((r) => r.active).length;
  const activeConstraints = getActiveConstraints().length;
  return activeWorkRules + activeConstraints;
}

export function buildContextPrefix(): string {
  const ctx = loadKIContext();
  const constraints = getActiveConstraints();
  const parts: string[] = [];

  // Profil-Block
  const { abteilung, fachgebiet, aufgaben, stil } = ctx.profile;
  const hasProfile = abteilung || fachgebiet || aufgaben || stil;
  if (hasProfile) {
    parts.push("## Nutzer-Kontext");
    if (abteilung) parts.push(`- Abteilung: ${abteilung}`);
    if (fachgebiet) parts.push(`- Fachgebiet: ${fachgebiet}`);
    if (aufgaben) parts.push(`- Typische Aufgaben: ${aufgaben}`);
    if (stil) parts.push(`- Bevorzugter Stil: ${stil}`);
  }

  // Arbeitsregeln
  const activeRules = ctx.workRules.filter((r) => r.active);
  if (activeRules.length > 0) {
    parts.push("");
    parts.push("## Arbeitsregeln");
    activeRules.forEach((r) => {
      parts.push(`- ${r.text}`);
    });
  }

  // Qualitätsregeln
  if (constraints.length > 0) {
    parts.push("");
    parts.push("## Qualitätsregeln");
    constraints.forEach((c) => {
      parts.push(`- ${c.title}: ${c.rule}`);
    });
  }

  return parts.join("\n");
}
