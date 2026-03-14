import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PromptLibrary } from "@/components/PromptLibrary";
import { MySkills } from "@/components/MySkills";
import { promptLibrary } from "@/data/prompts";
import { useOrgContext } from "@/contexts/OrgContext";
import { useMySkills } from "@/hooks/useMySkills";
import { cn } from "@/lib/utils";
import { ConstraintLibrary } from "@/components/ConstraintLibrary";
import { loadConstraints } from "@/services/constraintService";

const Library = () => {
  const navigate = useNavigate();
  const { scope, isDepartment, scopeLabel } = useOrgContext();
  const { skills } = useMySkills();
  const [activeSection, setActiveSection] = useState<string>("prompts");

  const deptPromptCount = useMemo(() => {
    if (!isDepartment) return 0;
    return promptLibrary.filter((p) => p.targetDepartment === scope).length;
  }, [scope, isDepartment]);

  const shortLabel = scopeLabel.replace("Abteilung ", "").replace("Fachabteilung ", "");

  return (
    <div className="space-y-6">
      {/* Zeile 1: Titel + Count + Button */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {isDepartment
            ? `${deptPromptCount} ${shortLabel}-Prompts · ${promptLibrary.length} gesamt`
            : `${promptLibrary.length} Prompts`
          }
        </span>
        <div className="flex-1" />
        <Button onClick={() => navigate("/playground?new=true")}>+ Neuer Prompt</Button>
      </div>

      {/* Sections-Navigation */}
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
          Vorlagen
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
          Skills
          {skills.length > 0 && (
            <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full ml-1.5">
              {skills.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSection("constraints")}
          className={cn(
            "px-3 py-1.5 rounded-md font-medium transition-colors",
            activeSection === "constraints"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          Qualitätsregeln
          {(() => { const n = loadConstraints().length; return n > 0 ? (
            <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full ml-1.5">
              {n}
            </span>
          ) : null; })()}
        </button>
      </div>

      {/* Content je nach Section */}
      {activeSection === "prompts" && <PromptLibrary />}
      {activeSection === "skills" && <MySkills />}
      {activeSection === "constraints" && <ConstraintLibrary />}
    </div>
  );
};

export default Library;
