import { Brush } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { themePresets } from "@/components/themePresets";

export const ThemePrototypeGallery = () => {
  const { setTheme, theme } = useTheme();

  return (
    <section id="themes" className="mb-0">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Theme-Prototypen & Brainstorming</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Visuelle Vorschläge basierend auf deinen Favoriten. Klicke auf <em>Anwenden</em>, um den Prototyp direkt auf die Lern-App zu legen.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {themePresets.map((preset) => (
          <Card key={preset.id} className="p-4 rounded-xl border border-border/80">
            <div className="mb-3">
              <div className="font-semibold text-sm mb-1">{preset.name}</div>
              <p className="text-xs text-muted-foreground">{preset.description}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="h-7 rounded bg-background border border-border" />
              <div className="h-7 rounded bg-card border border-border" />
              <div className="h-7 rounded bg-muted border border-border" />
              <div className="h-7 rounded bg-primary/80" />
            </div>
            <Button
              size="sm"
              className="w-full gap-2"
              variant={theme === preset.id ? "default" : "outline"}
              onClick={() => setTheme(preset.id)}
            >
              <Brush className="w-4 h-4" />
              {theme === preset.id ? "Aktiv" : "Anwenden"}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};
