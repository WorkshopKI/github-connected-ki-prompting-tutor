import { useState, useMemo } from "react";
import { Bot, User, List, AlignJustify } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

/** Markdown-Prose-Styling für KI-Antworten. Als Konstante extrahiert damit Agenten
 *  den langen className-String nicht versehentlich kürzen oder duplizieren. */
const PROSE_CLASSES = [
  "prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
  "[&_pre]:bg-background/80 [&_pre]:rounded-lg [&_pre]:p-3",
  "[&_code]:text-xs [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5",
  "[&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_table]:text-xs",
].join(" ");

// ── Parse ACTA fields from assembled prompt ──

interface ACTAFields {
  rolle: string;
  kontext: string;
  aufgabe: string;
  format: string;
  extras: string[];
}

function parseACTAPrompt(content: string): ACTAFields | null {
  const hasRolle = content.startsWith("Du bist ");
  const hasKontext = content.includes("\nKontext: ");
  const hasAufgabe = content.includes("\nAufgabe: ");

  if (!hasRolle && !hasAufgabe) return null;

  const lines = content.split("\n");
  const fields: ACTAFields = { rolle: "", kontext: "", aufgabe: "", format: "", extras: [] };
  let currentField: keyof ACTAFields | "extra" = "rolle";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("Du bist ")) {
      fields.rolle = trimmed.replace("Du bist ", "").replace(/\.$/, "");
      currentField = "rolle";
    } else if (trimmed.startsWith("Kontext: ")) {
      fields.kontext = trimmed.replace("Kontext: ", "");
      currentField = "kontext";
    } else if (trimmed.startsWith("Aufgabe: ")) {
      fields.aufgabe = trimmed.replace("Aufgabe: ", "");
      currentField = "aufgabe";
    } else if (trimmed.startsWith("Ausgabeformat: ")) {
      fields.format = trimmed.replace("Ausgabeformat: ", "");
      currentField = "format";
    } else if (
      trimmed.startsWith("Denkweise: ") ||
      trimmed.startsWith("Selbstprüfung: ") ||
      trimmed.startsWith("Wichtige Regeln:") ||
      trimmed.startsWith("WICHTIG — NICHT:") ||
      trimmed.startsWith("Beispiele zur Orientierung:")
    ) {
      fields.extras.push(trimmed);
      currentField = "extra";
    } else if (currentField === "kontext" && !fields.aufgabe) {
      fields.kontext += " " + trimmed;
    } else if (currentField === "aufgabe" && !fields.format) {
      fields.aufgabe += " " + trimmed;
    } else if (currentField === "format") {
      fields.format += " " + trimmed;
    }
  }

  // Only use structured display if at least 2 fields are filled
  const filledCount = [fields.rolle, fields.kontext, fields.aufgabe, fields.format].filter(f => f.trim()).length;
  return filledCount >= 2 ? fields : null;
}

// ── Parse sections from assistant response ──

interface Section {
  title: string;
  content: string;
  level: number;
}

function parseSections(content: string): Section[] | null {
  const lines = content.split("\n");
  const sections: Section[] = [];
  let currentTitle = "";
  let currentContent: string[] = [];
  let currentLevel = 2;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    const boldMatch = !headingMatch && line.match(/^\*\*([^*]+)\*\*\s*$/);

    const isHeading = headingMatch || boldMatch;
    const title = headingMatch ? headingMatch[2] : boldMatch ? boldMatch[1] : null;
    const level = headingMatch ? headingMatch[1].length : 2;

    if (isHeading && title) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentContent.join("\n").trim(), level: currentLevel });
      }
      currentTitle = title;
      currentContent = [];
      currentLevel = level;
    } else {
      currentContent.push(line);
    }
  }

  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentContent.join("\n").trim(), level: currentLevel });
  }

  // Only use sections if there are 3+ headings
  return sections.length >= 3 ? sections : null;
}

// ── ACTA Mini-Cards (User Prompt) ──

function ACTAMiniCards({ fields }: { fields: ACTAFields }) {
  const cards = [
    { icon: "👤", label: "ROLLE", text: fields.rolle },
    { icon: "📋", label: "KONTEXT", text: fields.kontext },
    { icon: "🎯", label: "AUFGABE", text: fields.aufgabe },
    { icon: "📄", label: "FORMAT", text: fields.format },
  ].filter(c => c.text.trim());

  return (
    <div className="grid grid-cols-2 gap-1.5 max-w-[90%]">
      {cards.map(card => (
        <div key={card.label} className="bg-primary/8 rounded-lg px-2.5 py-2 border border-primary/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs">{card.icon}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{card.label}</span>
          </div>
          <div className="text-[11px] text-foreground leading-relaxed line-clamp-3">
            {card.text}
          </div>
        </div>
      ))}
      {fields.extras.length > 0 && (
        <div className="col-span-2 text-[10px] text-muted-foreground flex flex-wrap gap-1.5">
          {fields.extras.map((e, i) => {
            const label = e.split(":")[0];
            return (
              <span key={i} className="bg-muted px-2 py-0.5 rounded-full">
                ✓ {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Sectioned Response (TOC + Viewer) ──

function SectionedResponse({ sections, fullContent, isStreaming }: { sections: Section[]; fullContent: string; isStreaming?: boolean }) {
  const [activeSection, setActiveSection] = useState(0);
  const [viewAll, setViewAll] = useState(false);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setViewAll(!viewAll)}
          className={cn(
            "text-[10px] px-2 py-0.5 rounded-md border font-medium transition-colors flex items-center gap-1",
            viewAll
              ? "bg-primary/10 border-primary/30 text-primary"
              : "border-border text-muted-foreground hover:border-primary/30"
          )}
        >
          {viewAll ? (
            <><List className="w-3 h-3" /> Abschnitte</>
          ) : (
            <><AlignJustify className="w-3 h-3" /> Alles anzeigen</>
          )}
        </button>
      </div>

      {viewAll ? (
        /* ═══ ALLE ANZEIGEN — normales Markdown ═══ */
        <div className={cn("bg-muted/30 rounded-lg p-4", PROSE_CLASSES)}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullContent}</ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-foreground/60 animate-pulse rounded-sm" />
          )}
        </div>
      ) : (
        /* ═══ TOC + VIEWER ═══ */
        <div className="flex gap-3 min-h-[200px]">
          {/* TOC links */}
          <div className="w-[140px] shrink-0">
            <div className="text-[10px] font-semibold text-muted-foreground mb-1.5">INHALT</div>
            <div className="space-y-0.5">
              {sections.map((s, i) => {
                const hasWarning = s.content.includes("[JURIST:IN PRÜFEN]") || s.content.includes("[PRÜFEN]");
                return (
                  <button
                    key={i}
                    onClick={() => setActiveSection(i)}
                    className={cn(
                      "block w-full text-left px-1.5 py-1 text-[11px] leading-tight rounded-sm border-l-2 transition-all",
                      activeSection === i
                        ? "border-l-primary text-primary font-semibold bg-primary/5"
                        : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="flex items-center gap-1">
                      <span className="text-[10px] opacity-50">{i + 1}.</span>
                      <span className="truncate">{s.title.split(" / ")[0]}</span>
                      {hasWarning && <span className="text-[8px] text-amber-600">⚠</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content rechts */}
          <div className="flex-1 bg-muted/30 rounded-lg p-3 flex flex-col min-w-0">
            <div className="text-sm font-bold text-foreground mb-2">
              {activeSection + 1}. {sections[activeSection].title}
            </div>
            <div className={cn("flex-1", PROSE_CLASSES)}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sections[activeSection].content}
              </ReactMarkdown>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
              <button
                onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
                className={cn("text-[11px] font-medium", activeSection === 0 ? "text-muted-foreground/30" : "text-primary hover:underline")}
              >
                ← Zurück
              </button>
              <span className="text-[10px] text-muted-foreground">{activeSection + 1} / {sections.length}</span>
              <button
                onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                disabled={activeSection === sections.length - 1}
                className={cn("text-[11px] font-medium", activeSection === sections.length - 1 ? "text-muted-foreground/30" : "text-primary hover:underline")}
              >
                Weiter →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ──

export const ChatMessage = ({ role, content, isStreaming }: ChatMessageProps) => {
  const isUser = role === "user";

  const actaFields = useMemo(() => {
    if (!isUser) return null;
    return parseACTAPrompt(content);
  }, [content, isUser]);

  const sections = useMemo(() => {
    if (isUser || isStreaming) return null;
    return parseSections(content);
  }, [content, isUser, isStreaming]);

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary/10" : "bg-muted"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary" />
        ) : (
          <Bot className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className={`max-w-[85%] ${isUser ? "" : "flex-1 min-w-0"}`}>
        {isUser ? (
          // ═══ USER MESSAGE ═══
          actaFields ? (
            <ACTAMiniCards fields={actaFields} />
          ) : (
            <div className="bg-primary/10 rounded-2xl rounded-br-sm px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
            </div>
          )
        ) : (
          // ═══ ASSISTANT MESSAGE ═══
          sections ? (
            <SectionedResponse sections={sections} fullContent={content} isStreaming={isStreaming} />
          ) : (
            <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className={PROSE_CLASSES}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-foreground/60 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
