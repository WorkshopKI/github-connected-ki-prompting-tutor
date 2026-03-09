import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { History, Wand2, Sparkles, Wrench, Blocks, Bot, Scale, ChevronDown, ChevronUp } from "lucide-react";
import { ConversationHistory } from "@/components/playground/ConversationHistory";
import { ACTABuilder } from "@/components/playground/ACTABuilder";
import { TechniquePanel } from "@/components/playground/TechniquePanel";
import { PromptEvaluation } from "@/components/playground/PromptEvaluation";
import { JudgePanel } from "@/components/playground/JudgePanel";
import { AgentKnobs, type AgentConfig } from "@/components/playground/AgentKnobs";
import type { ACTAFields } from "@/components/playground/ACTATemplates";
import type { SavedConversation, Msg } from "@/types";
import { cn } from "@/lib/utils";

interface PlaygroundSidebarProps {
  conversations: SavedConversation[];
  activeConversationId: string | null;
  onSelectConversation: (conv: SavedConversation) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  actaFields: ACTAFields;
  onActaFieldsChange: (fields: ACTAFields) => void;
  onSendFromACTA: (prompt: string) => void;
  onApplyTechnique: (prompt: string) => void;
  agentConfig: AgentConfig;
  onAgentConfigChange: (config: AgentConfig) => void;
  onStartAgent: (prompt: string) => void;
  lastUserPrompt: string;
  selectedModel: string;
  messages: Msg[];
  mode?: "einsteiger" | "experte";
}

interface SectionProps {
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SidebarSection({ icon, label, badge, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-border bg-card">
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-accent/50 rounded-t-lg transition-colors">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-semibold text-sm">{label}</span>
            {badge}
          </div>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {children}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function SidebarSections({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  actaFields,
  onActaFieldsChange,
  onSendFromACTA,
  onApplyTechnique,
  agentConfig,
  onAgentConfigChange,
  onStartAgent,
  lastUserPrompt,
  selectedModel,
  messages,
  mode = "experte",
}: PlaygroundSidebarProps) {
  const isExperte = mode === "experte";
  const hasMessages = messages.length >= 2 && messages[messages.length - 1].role === "assistant";
  const lastAssistantContent = hasMessages ? messages[messages.length - 1].content : "";

  return (
    <div className="flex flex-col h-full">
      {/* ⚠️ scroll-container: Sidebar-Sektionen scrollen hier vertikal, overflow-x-hidden verhindert Stepper-Überlauf */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3">
        {/* ACTA-Baukasten — always visible, default open */}
        <SidebarSection
          icon={<Blocks className="w-4 h-4 text-primary" />}
          label="ACTA-Baukasten"
          defaultOpen
        >
          <ACTABuilder
            fields={actaFields}
            onFieldsChange={onActaFieldsChange}
            onSendToPlayground={onSendFromACTA}
            bare
            mode={mode}
            selectedModel={selectedModel}
          />
        </SidebarSection>

        {/* Prompt-Check — only when lastUserPrompt exists */}
        {lastUserPrompt && (
          <SidebarSection
            icon={<Sparkles className="w-4 h-4 text-primary" />}
            label="Prompt-Check"
          >
            <div className="px-4 pb-4">
              <PromptEvaluation prompt={lastUserPrompt} model={selectedModel} />
            </div>
          </SidebarSection>
        )}

        {/* Experte-only sections */}
        {isExperte && (
          <>
            <SidebarSection
              icon={<Bot className="w-4 h-4 text-primary" />}
              label="Agenten-Modus"
            >
              <AgentKnobs
                config={agentConfig}
                onConfigChange={onAgentConfigChange}
                onStartAgent={onStartAgent}
                bare
              />
            </SidebarSection>

            {hasMessages && (
              <SidebarSection
                icon={<Scale className="w-4 h-4 text-primary" />}
                label="KI-Bewertung"
              >
                <div className="px-4 pb-4">
                  <JudgePanel
                    prompt={lastUserPrompt}
                    output={lastAssistantContent}
                    model={selectedModel}
                  />
                </div>
              </SidebarSection>
            )}

            <SidebarSection
              icon={<Wand2 className="w-4 h-4 text-muted-foreground" />}
              label="Technik-Vorlagen"
            >
              <TechniquePanel
                onApplyToChat={onApplyTechnique}
                bare
              />
            </SidebarSection>
          </>
        )}

        {/* Meine Versuche — collapsible, default closed for more ACTA space */}
        <SidebarSection
          icon={<History className="w-4 h-4 text-primary" />}
          label="Meine Versuche"
          badge={<span className="text-xs text-muted-foreground">({conversations.length})</span>}
        >
          <ConversationHistory
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={onSelectConversation}
            onNew={onNewConversation}
            onDelete={onDeleteConversation}
            onRename={onRenameConversation}
            bare
          />
        </SidebarSection>
      </div>
    </div>
  );
}

export function PlaygroundSidebar(props: PlaygroundSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const wrapWithClose = <T extends (...args: unknown[]) => unknown>(fn: T) =>
    ((...args: Parameters<T>) => { fn(...args); setSidebarOpen(false); }) as T;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full">
        <SidebarSections {...props} />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden fixed bottom-4 left-4 z-40">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full shadow-lg h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90">
              <Wrench className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetTitle className="text-lg font-bold mb-4">Werkzeuge</SheetTitle>
            <SidebarSections
              {...props}
              onSelectConversation={wrapWithClose(props.onSelectConversation)}
              onNewConversation={wrapWithClose(props.onNewConversation)}
              onSendFromACTA={wrapWithClose(props.onSendFromACTA)}
              onApplyTechnique={wrapWithClose(props.onApplyTechnique)}
              onStartAgent={wrapWithClose(props.onStartAgent)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
