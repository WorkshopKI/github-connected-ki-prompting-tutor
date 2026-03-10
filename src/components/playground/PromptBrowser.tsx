import { useState, useMemo } from "react";
import { Search, ChevronDown, Plus, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { promptLibrary } from "@/data/prompts";
import { useOrgContext } from "@/contexts/OrgContext";
import { useMySkills } from "@/hooks/useMySkills";
import { ConfidentialityBadge } from "@/components/ConfidentialityBadge";
import { ConversationHistory } from "./ConversationHistory";
import type { SavedConversation } from "@/types";

export interface PromptBrowserProps {
  onSelectPrompt: (title: string) => void;
  activePromptTitle: string | null;
  conversations: SavedConversation[];
  activeConversationId: string | null;
  onSelectConversation: (conv: SavedConversation) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
}

type TabKey = "dept" | "all" | "skills";

export const PromptBrowser = ({
  onSelectPrompt,
  activePromptTitle,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
}: PromptBrowserProps) => {
  const { scope, isDepartment, scopeLabel } = useOrgContext();
  const { skills } = useMySkills();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>(isDepartment ? "dept" : "all");
  const [historyOpen, setHistoryOpen] = useState(false);

  const deptPrompts = useMemo(
    () => promptLibrary.filter((p) => p.targetDepartment === scope),
    [scope]
  );

  const filteredPrompts = useMemo(() => {
    const q = search.toLowerCase().trim();
    const source = activeTab === "dept" ? deptPrompts : promptLibrary;
    if (!q) return source;
    return source.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [activeTab, search, deptPrompts]);

  const filteredSkills = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q))
    );
  }, [search, skills]);

  const tabs: { key: TabKey; label: string }[] = useMemo(() => {
    const t: { key: TabKey; label: string }[] = [];
    if (isDepartment) {
      t.push({ key: "dept", label: scopeLabel });
    }
    t.push({ key: "all", label: "Alle" });
    t.push({ key: "skills", label: "Skills" });
    return t;
  }, [isDepartment, scopeLabel]);

  return (
    <div className="h-full flex flex-col bg-card/50">
      {/* Header + Search */}
      <div className="px-3 pt-3 pb-2 space-y-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs font-semibold">Vorlagen</span>
        </div>
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche..."
            className="w-full h-7 text-[11px] pl-6 pr-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        {/* Tab Segmented Control */}
        <div className="flex rounded-md border border-border overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 text-[10px] font-medium py-1 transition-colors truncate px-1",
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-1.5 py-1">
          {activeTab === "skills" ? (
            filteredSkills.length === 0 ? (
              <p className="text-[10px] text-muted-foreground text-center py-4">
                Noch keine Skills gespeichert.
              </p>
            ) : (
              filteredSkills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectPrompt(s.title)}
                  className={cn(
                    "w-full text-left px-2 py-1 rounded-md transition-colors flex items-center gap-1.5 min-w-0",
                    activePromptTitle === s.title
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  )}
                >
                  <span className="text-[11px] font-medium truncate flex-1">
                    {s.title}
                  </span>
                  {s.confidentiality && (
                    <ConfidentialityBadge
                      level={s.confidentiality as "open" | "internal" | "confidential"}
                      compact
                    />
                  )}
                </button>
              ))
            )
          ) : filteredPrompts.length === 0 ? (
            <p className="text-[10px] text-muted-foreground text-center py-4">
              Keine Vorlagen gefunden.
            </p>
          ) : (
            filteredPrompts.map((p, i) => (
              <button
                key={`${p.title}-${i}`}
                onClick={() => onSelectPrompt(p.title)}
                className={cn(
                  "w-full text-left px-2 py-1 rounded-md transition-colors flex items-center gap-1.5 min-w-0",
                  activePromptTitle === p.title
                    ? "bg-primary/10"
                    : "hover:bg-muted/50"
                )}
              >
                <span className="text-[11px] font-medium truncate flex-1">
                  {p.title}
                </span>
                <span className="text-[9px] text-muted-foreground shrink-0">
                  {p.category}
                </span>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer: New Prompt + Conversations */}
      <div className="border-t border-border">
        <button
          onClick={onNewConversation}
          className="w-full px-3 py-1.5 text-[11px] font-medium text-primary hover:bg-muted/50 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3 h-3" />
          Leerer Prompt
        </button>
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
          <CollapsibleTrigger className="w-full px-3 py-1.5 text-[11px] font-semibold text-muted-foreground flex items-center justify-between border-t border-border hover:bg-muted/50 transition-colors">
            <span>Meine Versuche ({conversations.length})</span>
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform",
                historyOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ConversationHistory
              conversations={conversations}
              activeId={activeConversationId}
              onSelect={onSelectConversation}
              onNew={onNewConversation}
              onDelete={onDeleteConversation}
              onRename={onRenameConversation}
              bare
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
