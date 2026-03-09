import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PromptLibrary } from "@/components/PromptLibrary";
import { MySkills } from "@/components/MySkills";
import { OrganizationUseCases } from "@/components/OrganizationUseCases";
import { TeamMembers } from "@/components/TeamMembers";
import { PendingReviews } from "@/components/PendingReviews";
import { promptLibrary } from "@/data/prompts";
import { useOrgContext } from "@/contexts/OrgContext";
import { useAppMode } from "@/contexts/AppModeContext";
import { useMySkills } from "@/hooks/useMySkills";
import { cn } from "@/lib/utils";

const Library = () => {
  const navigate = useNavigate();
  const { scope, isDepartment, scopeLabel } = useOrgContext();
  const { skills } = useMySkills();
  const { isWorkshop } = useAppMode();
  const [activeSection, setActiveSection] = useState<string>("prompts");

  const deptPromptCount = useMemo(() => {
    if (!isDepartment) return 0;
    return promptLibrary.filter((p) => p.targetDepartment === scope).length;
  }, [scope, isDepartment]);

  const shortLabel = scopeLabel.replace("Abteilung ", "").replace("Fachabteilung ", "");

  return (
    <div className="space-y-6">
      {/* Zeile 1: Titel + Neuer Prompt */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="page-title">Prompt Sammlung</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isDepartment
              ? `${deptPromptCount} ${shortLabel}-Prompts · ${promptLibrary.length} gesamt`
              : `${promptLibrary.length} Prompts`
            }
          </p>
        </div>
        <Button onClick={() => navigate("/playground")}>+ Neuer Prompt</Button>
      </div>

      {/* Sections-Navigation als dezente Inline-Links */}
      <div className="flex items-center gap-1 text-sm border-b border-border pb-2">
        <button
          onClick={() => setActiveSection("prompts")}
          className={cn(
            "px-3 py-1.5 rounded-md font-medium transition-colors",
            activeSection === "prompts"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          Prompts
        </button>
        <button
          onClick={() => setActiveSection("skills")}
          className={cn(
            "px-3 py-1.5 rounded-md font-medium transition-colors",
            activeSection === "skills"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          Meine Skills
          {skills.length > 0 && (
            <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full ml-1.5">
              {skills.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSection("usecases")}
          className={cn(
            "px-3 py-1.5 rounded-md font-medium transition-colors",
            activeSection === "usecases"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          Use Cases
        </button>
        {isWorkshop && (
          <>
            <button
              onClick={() => setActiveSection("team")}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-colors",
                activeSection === "team"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              Team
            </button>
            <button
              onClick={() => setActiveSection("reviews")}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-colors",
                activeSection === "reviews"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              Reviews
            </button>
          </>
        )}
      </div>

      {/* Content je nach Section */}
      {activeSection === "prompts" && <PromptLibrary />}
      {activeSection === "skills" && <MySkills />}
      {activeSection === "usecases" && (
        <div className="space-y-8">
          <OrganizationUseCases />
          {/* Governance Block */}
          <div className="max-w-7xl mx-auto rounded-2xl border border-border bg-card/70 p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-2">Governance & Team-Qualität</h3>
            <p className="text-muted-foreground text-sm mb-5 max-w-3xl">
              Definiert gemeinsam, welche Templates offiziell freigegeben sind, welche Risiko-Level eine Review erfordern
              und welche Kriterien für gute Antworten in eurer Organisation gelten.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="font-semibold mb-1">1) Freigaben</div>
                <p className="text-muted-foreground">Teamlead/Admin markieren validierte Prompts als Standards.</p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="font-semibold mb-1">2) Review</div>
                <p className="text-muted-foreground">Prompts mit Risiko „hoch" erhalten verpflichtend eine zweite Prüfung.</p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="font-semibold mb-1">3) KPI</div>
                <p className="text-muted-foreground">Messung von Nutzung, Antwortqualität und Zeitersparnis pro Team.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSection === "team" && <TeamMembers />}
      {activeSection === "reviews" && <PendingReviews />}
    </div>
  );
};

export default Library;
