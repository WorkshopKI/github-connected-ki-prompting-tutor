import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Lightbulb } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

const STORAGE_KEY = "guest_banner_dismissed";

export const GuestBanner = () => {
  const { isLoggedIn, authMethod, profile } = useAuthContext();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === "true");

  if (!isLoggedIn || authMethod !== "guest" || profile?.auth_method !== "guest" || dismissed) {
    return null;
  }

  return (
    <div className="bg-accent/30 border-b border-accent/50 px-4 py-2 flex items-center justify-center gap-2 text-sm">
      <Lightbulb className="w-4 h-4 text-accent-foreground shrink-0" />
      <span className="text-foreground">
        Hinterlege eine E-Mail-Adresse für dauerhaften Zugriff auf deine Daten.{" "}
        <button
          onClick={() => navigate("/profil")}
          className="text-primary font-medium hover:underline"
        >
          E-Mail hinterlegen →
        </button>
      </span>
      <button
        onClick={() => { setDismissed(true); localStorage.setItem(STORAGE_KEY, "true"); }}
        className="ml-2 text-muted-foreground hover:text-foreground shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
