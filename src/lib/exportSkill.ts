import type { SavedSkill } from "@/types";

const confidentialityLabels: Record<string, string> = {
  open: "🟢 Offen — Externe API erlaubt",
  internal: "🟡 Intern — Interne KI empfohlen",
  confidential: "🔴 Vertraulich — Nur interne KI",
};

export function skillToMarkdown(skill: SavedSkill): string {
  const lines: string[] = [];

  lines.push(`# ${skill.title}`);
  lines.push("");
  lines.push(`**Kategorie:** ${skill.category}`);
  if (skill.targetDepartment) {
    lines.push(`**Abteilung:** ${skill.targetDepartment}`);
  }
  if (skill.confidentiality) {
    lines.push(`**Vertraulichkeit:** ${confidentialityLabels[skill.confidentiality] || skill.confidentiality}`);
  }
  if (skill.targetModel) {
    lines.push(`**Optimiert für:** ${skill.targetModel}`);
  }
  lines.push(`**Erstellt:** ${new Date(skill.createdAt).toLocaleDateString("de-DE")}`);
  lines.push(`**Zuletzt bearbeitet:** ${new Date(skill.updatedAt).toLocaleDateString("de-DE")}`);
  lines.push("");

  // Variablen
  const vars = Object.entries(skill.variables).filter(([, v]) => v.trim());
  if (vars.length > 0) {
    lines.push("## Variablen");
    lines.push("");
    for (const [key, value] of vars) {
      lines.push(`- **${key}:** ${value}`);
    }
    lines.push("");
  }

  // Prompt
  lines.push("## Prompt");
  lines.push("");
  lines.push("```");
  let filledPrompt = skill.prompt;
  for (const [key, value] of Object.entries(skill.variables)) {
    if (value.trim()) {
      filledPrompt = filledPrompt.replaceAll(`{{${key}}}`, value);
    }
  }
  lines.push(filledPrompt);
  lines.push("```");
  lines.push("");

  // Notizen
  if (skill.notes.trim()) {
    lines.push("## Notizen");
    lines.push("");
    lines.push(skill.notes);
    lines.push("");
  }

  // Quelle
  if (skill.sourceTitle !== skill.title) {
    lines.push("---");
    lines.push(`*Basiert auf: ${skill.sourceTitle} (Prompting Studio)*`);
  } else {
    lines.push("---");
    lines.push(`*Erstellt mit Prompting Studio*`);
  }

  return lines.join("\n");
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
