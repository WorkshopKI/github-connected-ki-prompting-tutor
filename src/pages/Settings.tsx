import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2 } from "lucide-react";
import { ProfileContent } from "@/pages/Profile";
import { MeinBereichSection } from "@/components/settings/MeinBereichSection";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AIRoutingSettings } from "@/components/settings/AIRoutingSettings";
import { ComplianceSettingsTab } from "@/components/settings/ComplianceSettingsTab";
import { RolesSettings } from "@/components/settings/RolesSettings";
import { useAppMode } from "@/contexts/AppModeContext";

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
          {/* Kontoinformationen + KI-Einstellungen (aus Profile.tsx) */}
          <ProfileContent>
            <MeinBereichSection />
          </ProfileContent>
        </TabsContent>

        {isWorkshop && (
          <TabsContent value="organisation" className="space-y-6">
            {/* Allgemein — Org-Name, Sprache, Toggles */}
            <GeneralSettings />

            {/* KI-Konfiguration — Endpunkte + Routing */}
            <AIRoutingSettings />

            {/* Sicherheit & Compliance */}
            <ComplianceSettingsTab />

            {/* Rollen & Rechte */}
            <RolesSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
