import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PromptLibrary } from "@/components/PromptLibrary";
import { promptLibrary } from "@/data/prompts";
import { useOrgContext } from "@/contexts/OrgContext";

const Library = () => {
  const { scope, isDepartment, scopeLabel } = useOrgContext();

  const uniqueCategories = useMemo(() => {
    return new Set(promptLibrary.map((p) => p.category)).size;
  }, []);

  const deptPromptCount = useMemo(() => {
    if (!isDepartment) return 0;
    return promptLibrary.filter((p) => p.targetDepartment === scope).length;
  }, [scope, isDepartment]);

  const shortLabel = scopeLabel.replace("Abteilung ", "").replace("Fachabteilung ", "");

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">Prompt Library</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isDepartment
              ? `${deptPromptCount} ${shortLabel}-Prompts · ${promptLibrary.length} gesamt`
              : `${promptLibrary.length} Prompts in ${uniqueCategories} Kategorien`
            }
          </p>
        </div>
        <Button>+ Neuer Prompt</Button>
      </div>
      <PromptLibrary />
    </div>
  );
};

export default Library;
