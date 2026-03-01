import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { LogOut, User, Users, Mail, Ticket } from "lucide-react";

export const UserMenu = () => {
  const { isLoggedIn, isLoading, profile, user, signOut } = useAuthContext();
  const navigate = useNavigate();

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
      >
        Anmelden →
      </button>
    );
  }

  const isGuest = profile?.auth_method === "guest";
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const courseId = profile?.course_id;

  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex items-center gap-2">
        {isGuest ? <Ticket className="w-4 h-4 text-muted-foreground" /> : <User className="w-4 h-4 text-muted-foreground" />}
        <span className="font-medium text-foreground truncate">
          {isGuest ? `${displayName} (Gast)` : user?.email}
        </span>
      </div>
      {courseId && <span className="text-xs text-muted-foreground ml-6">{courseId}</span>}
      <div className="flex flex-col gap-0.5 ml-6 mt-1">
        {isGuest && (
          <button
            onClick={() => navigate("/profil")}
            className="text-xs text-primary hover:underline text-left flex items-center gap-1"
          >
            <Mail className="w-3 h-3" /> E-Mail hinterlegen
          </button>
        )}
        {profile?.is_admin && (
          <button
            onClick={() => navigate("/admin/teilnehmer")}
            className="text-xs text-muted-foreground hover:text-foreground text-left flex items-center gap-1"
          >
            <Users className="w-3 h-3" /> Teilnehmer
          </button>
        )}
        <button
          onClick={signOut}
          className="text-xs text-muted-foreground hover:text-foreground text-left flex items-center gap-1"
        >
          <LogOut className="w-3 h-3" /> Abmelden
        </button>
      </div>
    </div>
  );
};
