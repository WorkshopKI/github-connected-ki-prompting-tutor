import { useState, useCallback } from "react";
import { Heart, AlertTriangle, Lightbulb, HelpCircle, Star, ChevronDown, Check, ArrowLeft, Crosshair } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthContext } from "@/contexts/AuthContext";
import { captureFeedbackContext } from "@/lib/feedbackContext";
import { submitFeedback } from "@/services/feedbackService";
import { FEEDBACK_CATEGORY_COLORS } from "@/lib/constants";
import { FEEDBACK_CATEGORY_LABELS } from "@/types";
import type { FeedbackCategory, FeedbackContext as FeedbackContextType } from "@/types";
import { toast } from "sonner";
import { FeedbackChatbot } from "./FeedbackChatbot";
import { ScreenRefMode } from "./ScreenRefMode";

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedCategory?: FeedbackCategory;
}

const CATEGORIES: { key: FeedbackCategory; icon: typeof Heart; }[] = [
  { key: "praise", icon: Heart },
  { key: "problem", icon: AlertTriangle },
  { key: "idea", icon: Lightbulb },
  { key: "question", icon: HelpCircle },
];

export function FeedbackPanel({ open, onClose, preselectedCategory }: Props) {
  const isMobile = useIsMobile();
  const { profile } = useAuthContext();
  const [step, setStep] = useState<1 | 2 | 3 | "chatbot">(preselectedCategory ? 2 : 1);
  const [category, setCategory] = useState<FeedbackCategory | undefined>(preselectedCategory);
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);
  const [context, setContext] = useState<FeedbackContextType | null>(null);
  const [screenRef, setScreenRef] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | undefined>();
  const [showRefMode, setShowRefMode] = useState(false);

  const reset = useCallback(() => {
    setStep(1);
    setCategory(undefined);
    setText("");
    setStars(0);
    setContext(null);
    setScreenRef(undefined);
    setSubmitting(false);
    setSubmittedId(undefined);
  }, []);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      setTimeout(reset, 300);
    }
  }, [onClose, reset]);

  const handleCategorySelect = useCallback((cat: FeedbackCategory) => {
    setCategory(cat);
    setContext(captureFeedbackContext());
    setStep(2);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!category || !context) return;
    setSubmitting(true);
    try {
      const item = await submitFeedback({
        category,
        stars: category === "praise" && stars > 0 ? stars : undefined,
        text,
        context,
        screen_ref: screenRef,
        user_id: profile?.id ?? "anonymous",
        user_display_name: profile?.display_name ?? undefined,
      });
      setSubmittedId(item.id);
      setStep(3);
      toast.success("Feedback gesendet!");
    } catch {
      toast.error("Feedback konnte nicht gespeichert werden.");
    } finally {
      setSubmitting(false);
    }
  }, [category, context, text, stars, screenRef, profile]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[85vh]" : "w-[400px]"}>
        <SheetHeader>
          <SheetTitle>Feedback geben</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex-col-layout">
          {step === 1 && (
            <CategoryStep categories={CATEGORIES} onSelect={handleCategorySelect} />
          )}

          {step === 2 && category && (
            <DetailsStep
              category={category}
              text={text}
              stars={stars}
              context={context}
              screenRef={screenRef}
              submitting={submitting}
              onBack={() => setStep(1)}
              onTextChange={setText}
              onStarsChange={setStars}
              onSubmit={handleSubmit}
              onMarkArea={() => setShowRefMode(true)}
            />
          )}

          {showRefMode && (
            <ScreenRefMode
              onSelect={({ ref }) => {
                setScreenRef(ref);
                setShowRefMode(false);
              }}
              onCancel={() => setShowRefMode(false)}
            />
          )}

          {step === 3 && (
            <ConfirmStep
              onClose={() => handleOpenChange(false)}
              onChatbot={() => setStep("chatbot")}
            />
          )}

          {step === "chatbot" && submittedId && context && (
            <FeedbackChatbot
              feedbackId={submittedId}
              initialText={text}
              context={context}
              onClose={() => handleOpenChange(false)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ═══ Sub-Komponenten ═══

function CategoryStep({
  categories,
  onSelect,
}: {
  categories: typeof CATEGORIES;
  onSelect: (cat: FeedbackCategory) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map(({ key, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-accent ${FEEDBACK_CATEGORY_COLORS[key] ? "" : ""}`}
        >
          <Icon className="h-6 w-6" />
          <span className="text-sm font-medium">{FEEDBACK_CATEGORY_LABELS[key]}</span>
        </button>
      ))}
    </div>
  );
}

function DetailsStep({
  category,
  text,
  stars,
  context,
  screenRef,
  submitting,
  onBack,
  onTextChange,
  onStarsChange,
  onSubmit,
  onMarkArea,
}: {
  category: FeedbackCategory;
  text: string;
  stars: number;
  context: FeedbackContextType | null;
  screenRef?: string;
  submitting: boolean;
  onBack: () => void;
  onTextChange: (v: string) => void;
  onStarsChange: (v: number) => void;
  onSubmit: () => void;
  onMarkArea: () => void;
}) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" />
        <Badge className={FEEDBACK_CATEGORY_COLORS[category]}>
          {FEEDBACK_CATEGORY_LABELS[category]}
        </Badge>
      </button>

      {category === "praise" && (
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground mr-2">Bewertung:</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => onStarsChange(n === stars ? 0 : n)}>
              <Star
                className={`h-5 w-5 transition-colors ${
                  n <= stars ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      <Textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Beschreibe kurz, was dir aufgefallen ist..."
        rows={4}
        className="resize-none"
      />

      {screenRef && (
        <div className="text-xs text-muted-foreground">
          Bereich: <code className="rounded bg-muted px-1">{screenRef}</code>
        </div>
      )}

      {context && (
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ChevronDown className="h-3 w-3" />
            App-Kontext wird automatisch erfasst
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded-md bg-muted p-2 text-xs space-y-1">
            <div>Seite: {context.page}</div>
            <div>Modus: {context.mode}</div>
            <div>Gerät: {context.device} ({context.viewport})</div>
            <div>Letzte Aktion: {context.lastAction || "–"}</div>
            <div>Session: {Math.round(context.sessionDuration / 60)} Min.</div>
            {context.errors.length > 0 && (
              <div className="text-destructive">Fehler: {context.errors.join(", ")}</div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      <Button variant="outline" size="sm" onClick={onMarkArea} className="gap-1.5">
        <Crosshair className="h-3 w-3" />
        Bereich markieren
      </Button>

      <div className="flex gap-2 pt-2">
        <Button onClick={onSubmit} disabled={submitting || !text.trim()}>
          {submitting ? "Sende..." : "Absenden"}
        </Button>
        <Button variant="outline" onClick={onBack}>
          Zurück
        </Button>
      </div>
    </div>
  );
}

function ConfirmStep({ onClose, onChatbot }: { onClose: () => void; onChatbot: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-7 w-7 text-primary" />
      </div>
      <p className="text-lg font-medium">Danke für dein Feedback!</p>
      <p className="text-sm text-muted-foreground text-center">
        Dein Feedback hilft uns, die App zu verbessern.
      </p>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onChatbot}>
          KI-Assistent fragen
        </Button>
        <Button onClick={onClose}>Schließen</Button>
      </div>
    </div>
  );
}
