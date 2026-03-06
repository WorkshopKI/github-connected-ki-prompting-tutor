import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileContent } from "@/pages/Profile";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { RolesSettings } from "@/components/settings/RolesSettings";
import { ComplianceSettingsTab } from "@/components/settings/ComplianceSettingsTab";
import { AIRoutingSettings } from "@/components/settings/AIRoutingSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";

const Settings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Konto, Plattform-Konfiguration und Governance
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Mein Konto</TabsTrigger>
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="roles">Rollen & Rechte</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="ai">KI-Konfiguration</TabsTrigger>
          <TabsTrigger value="appearance">Darstellung</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <ProfileContent />
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesSettings />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceSettingsTab />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIRoutingSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
