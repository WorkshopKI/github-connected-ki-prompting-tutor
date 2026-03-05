import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationUseCases } from "@/components/OrganizationUseCases";
import { TeamMembers } from "@/components/TeamMembers";
import { PendingReviews } from "@/components/PendingReviews";

const Workspace = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Team Workspace</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Zusammenarbeit, Use Cases und Qualitätssicherung
        </p>
      </div>

      <Tabs defaultValue="usecases">
        <TabsList>
          <TabsTrigger value="usecases">Use Cases</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="usecases" className="mt-6 space-y-8">
          <OrganizationUseCases />

          {/* Governance Block */}
          <div className="max-w-7xl mx-auto rounded-2xl border border-border bg-card/70 p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-2">Governance & Team-Qualität</h3>
            <p className="text-muted-foreground mb-5 max-w-3xl">
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
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamMembers />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <PendingReviews />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workspace;
