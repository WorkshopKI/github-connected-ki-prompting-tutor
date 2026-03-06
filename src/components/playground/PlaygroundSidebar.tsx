import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { History, Wand2, Sparkles, Wrench } from "lucide-react";
import { ConversationHistory } from "@/components/playground/ConversationHistory";
import { ACTABuilder } from "@/components/playground/ACTABuilder";
import { TechniquePanel } from "@/components/playground/TechniquePanel";
import { PromptEvaluation } from "@/components/playground/PromptEvaluation";
import { AgentKnobs, type AgentConfig } from "@/components/playground/AgentKnobs";
import type { ACTAFields } from "@/components/playground/ACTATemplates";
import type { SavedConversation } from "@/types";

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
}

function SidebarAccordionContent({
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
}: Omit<PlaygroundSidebarProps, "lastUserPrompt" | "selectedModel">) {
  return (
    <Accordion type="single" collapsible defaultValue="acta">
      <AccordionItem value="history" className="rounded-lg border border-border bg-card">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Verlauf ({conversations.length})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <ConversationHistory
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={onSelectConversation}
            onNew={onNewConversation}
            onDelete={onDeleteConversation}
            onRename={onRenameConversation}
            bare
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="acta" className="rounded-lg border border-border bg-card">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">ACTA-Baukasten</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ACTABuilder
            fields={actaFields}
            onFieldsChange={onActaFieldsChange}
            onSendToPlayground={onSendFromACTA}
            bare
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="techniques" className="rounded-lg border border-border bg-card">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Fortgeschrittene Techniken</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniquePanel
            onApplyToChat={onApplyTechnique}
            bare
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="agent" className="rounded-lg border border-border bg-card">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Agenten-Modus</span>
            <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded-full">Fortgeschritten</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <AgentKnobs
            config={agentConfig}
            onConfigChange={onAgentConfigChange}
            onStartAgent={onStartAgent}
            bare
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function PlaygroundSidebar(props: PlaygroundSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const wrapWithClose = <T extends (...args: unknown[]) => unknown>(fn: T) =>
    ((...args: Parameters<T>) => { fn(...args); setSidebarOpen(false); }) as T;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block space-y-4">
        <SidebarAccordionContent {...props} />

        {props.lastUserPrompt && (
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Prompt-Qualität</span>
            </div>
            <PromptEvaluation prompt={props.lastUserPrompt} model={props.selectedModel} />
          </div>
        )}
      </aside>

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
            <SidebarAccordionContent
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
