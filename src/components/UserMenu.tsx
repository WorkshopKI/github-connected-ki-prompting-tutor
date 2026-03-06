import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { LogOut, Users, Mail, Coins, Settings } from "lucide-react";
import { CreditsDialog } from "@/components/CreditsDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const UserMenu = () => {
  const { isLoggedIn, isLoading, profile, user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [creditsOpen, setCreditsOpen] = useState(false);

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
  const initials = displayName.slice(0, 2).toUpperCase();
  const courseId = profile?.course_id;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs"
          >
            {initials}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">
                {isGuest ? `${displayName} (Gast)` : user?.email}
              </p>
              {courseId && (
                <p className="text-xs text-muted-foreground">{courseId}</p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreditsOpen(true)}>
            <Coins className="mr-2 h-4 w-4" />
            Credits
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </DropdownMenuItem>
          {profile?.is_admin && (
            <DropdownMenuItem onClick={() => navigate("/admin/teilnehmer")}>
              <Users className="mr-2 h-4 w-4" />
              Teilnehmer
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreditsDialog open={creditsOpen} onOpenChange={setCreditsOpen} />
    </>
  );
};
