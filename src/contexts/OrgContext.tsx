import { createContext, useContext, useState, type ReactNode } from "react";

export type OrgScope =
  | "privat"
  | "organisation"
  | "legal"
  | "oeffentlichkeitsarbeit"
  | "hr"
  | "it"
  | "bauverfahren";

export const ORG_SCOPE_LABELS: Record<OrgScope, string> = {
  privat: "Privatgebrauch",
  organisation: "Gesamte Organisation",
  legal: "Abteilung Legal",
  oeffentlichkeitsarbeit: "Abteilung Öffentlichkeitsarbeit",
  hr: "Abteilung HR",
  it: "Abteilung IT",
  bauverfahren: "Fachabteilung Bauverfahren",
};

export const DEPARTMENTS: OrgScope[] = ["legal", "oeffentlichkeitsarbeit", "hr", "it", "bauverfahren"];

interface OrgContextType {
  scope: OrgScope;
  setScope: (scope: OrgScope) => void;
  isDepartment: boolean;
  isOrg: boolean;
  scopeLabel: string;
}

const OrgContext = createContext<OrgContextType | null>(null);

const LS_KEY = "org_scope";

export const OrgProvider = ({ children }: { children: ReactNode }) => {
  const [scope, setScopeState] = useState<OrgScope>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return (stored as OrgScope) || "privat";
    } catch {
      return "privat";
    }
  });

  const setScope = (s: OrgScope) => {
    setScopeState(s);
    localStorage.setItem(LS_KEY, s);
  };

  const isDepartment = DEPARTMENTS.includes(scope);
  const isOrg = scope !== "privat";

  return (
    <OrgContext.Provider value={{ scope, setScope, isDepartment, isOrg, scopeLabel: ORG_SCOPE_LABELS[scope] }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrgContext = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrgContext must be inside OrgProvider");
  return ctx;
};
