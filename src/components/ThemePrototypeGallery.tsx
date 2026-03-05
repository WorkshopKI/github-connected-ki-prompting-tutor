import { Brush } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { themeCategories, themePresets } from "@/components/themePresets";

export const ThemePrototypeGallery = () => {
  const { setTheme, theme } = useTheme();

  return (
    <section id="themes" className="mb-16 md:mb-20 scroll-mt-20">
      <div className="text-center mb-8">
        <span className="font-mono text-lg tracking-widest block mb-3" style={{ color: "hsl(var(--primary-deep))" }}>THEMES</span>
        <div className="w-10 h-0.5 mx-auto mb-4" style={{ backgroundColor: "hsl(var(--primary-deep))" }} />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Theme-Prototypen & Brainstorming</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          10 visuelle Vorschläge basierend auf deinen Favoriten. Klicke auf <em>Anwenden</em>, um den Prototyp direkt auf die Lern-App zu legen.
        </p>
      </div>

      <div className="space-y-8">
        {themeCategories.map((category) => (
          <div key={category.key}>
            <h3 className="text-lg font-semibold mb-3">{category.title}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {themePresets
                .filter((preset) => preset.category === category.key)
                .map((preset) => (
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
          </div>
        ))}
      </div>
    </section>
  );
};
