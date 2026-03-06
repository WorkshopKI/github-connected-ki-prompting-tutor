import { Card } from "@/components/ui/card";
import { ThemePresetPicker } from "@/components/ThemePresetPicker";

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-5 rounded-xl border border-border shadow-sm">
        <h3 className="font-semibold mb-4">Theme</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Aktuelles Theme wählen:</span>
          <ThemePresetPicker />
        </div>
      </Card>

      <Card className="p-5 rounded-xl border border-border shadow-sm">
        <h3 className="font-semibold mb-2">Logo</h3>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
          Logo hochladen — kommt in v2
        </div>
      </Card>
    </div>
  );
}
