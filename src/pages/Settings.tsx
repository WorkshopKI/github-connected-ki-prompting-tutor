import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2 } from "lucide-react";
import { ProfileContent } from "@/pages/Profile";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AIRoutingSettings } from "@/components/settings/AIRoutingSettings";
import { ComplianceSettingsTab } from "@/components/settings/ComplianceSettingsTab";
import { RolesSettings } from "@/components/settings/RolesSettings";
import { useAppMode } from "@/contexts/AppModeContext";
import { KIContextEditor } from "@/components/settings/KIContextEditor";

const Settings = () => {
  const { isWorkshop } = useAppMode();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profil" className="gap-1.5">
            <User className="w-3.5 h-3.5" />
            Mein Profil
          </TabsTrigger>
          {isWorkshop && (
            <TabsTrigger value="organisation" className="gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Organisation
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profil" className="space-y-6">
          {/* KI-Kontext Editor — häufig editiert, daher ganz oben */}
          <KIContextEditor />
          {/* Kontoinformationen + KI-Einstellungen (aus Profile.tsx) */}
          <ProfileContent />
        </TabsContent>

        {isWorkshop && (
          <TabsContent value="organisation" className="space-y-6">
            {/* Zeile 1: Plattform + Sicherheit & Compliance (nebeneinander) */}
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <GeneralSettings />
              <ComplianceSettingsTab />
            </div>

            {/* Zeile 2: KI-Endpunkte (volle Breite, intern schon 2-spaltig) */}
            <AIRoutingSettings />

            {/* Zeile 3: Rollen & Rechte (volle Breite) */}
            <RolesSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
