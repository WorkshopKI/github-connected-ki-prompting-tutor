import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getModelLabel } from "@/data/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Cloud, Key, ArrowRight, Bot } from "lucide-react";

export interface CreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditsDialog = ({ open, onOpenChange }: CreditsDialogProps) => {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<{
    provisioned_key_budget: number;
    custom_key_active: boolean;
    active_key_source: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    supabase
      .from("user_api_keys")
      .select("provisioned_key_budget, custom_key_active, active_key_source")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setBudget(data);
        setLoading(false);
      });
  }, [open, user]);

  const isCustom = budget?.active_key_source === "custom";
  const budgetValue = budget?.provisioned_key_budget ?? 0;
  const budgetPercent = Math.min((budgetValue / 5) * 100, 100);
  const currentModel = profile?.preferred_model ?? "google/gemini-3-flash-preview";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            KI-Credits
          </DialogTitle>
          <DialogDescription>
            Dein aktuelles KI-Kontingent und aktive Quelle.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground py-4">Wird geladen...</p>
        ) : budget ? (
          <div className="space-y-4">
            {/* Budget */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Verbleibend</span>
                <span className="font-semibold">
                  ${budgetValue.toFixed(2)} / $5.00
                </span>
              </div>
              <Progress value={budgetPercent} className="h-2" />
            </div>

            {/* KI-Quelle */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Aktive KI-Quelle</p>
              <div className="flex items-center gap-2">
                {isCustom ? (
                  <Badge variant="default" className="gap-1.5">
                    <Key className="h-3 w-3" />
                    OpenRouter (eigener Key)
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1.5">
                    <Cloud className="h-3 w-3" />
                    Cloud AI (Standard)
                  </Badge>
                )}
              </div>
            </div>

            {/* Aktuelles Modell */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Aktives Modell</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <Bot className="h-3 w-3" />
                  {getModelLabel(currentModel)}
                </Badge>
              </div>
            </div>

            {/* Link zur Profil-Seite */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                onOpenChange(false);
                navigate("/settings");
              }}
            >
              Alle Einstellungen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            Keine Budget-Daten verfügbar.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
