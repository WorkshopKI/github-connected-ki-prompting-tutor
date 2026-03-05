import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themeCategories, themePresets } from "@/components/themePresets";

export const ThemePresetPicker = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" /> Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 max-h-[70vh] overflow-auto">
        <DropdownMenuLabel>Design-Prototypen</DropdownMenuLabel>
        {themeCategories.map((category, idx) => (
          <div key={category.key}>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">{category.title}</DropdownMenuLabel>
            {themePresets
              .filter((preset) => preset.category === category.key)
              .map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onClick={() => setTheme(preset.id)}
                  className="flex flex-col items-start gap-0.5"
                >
                  <div className="flex items-center gap-2">
                    <span className={theme === preset.id ? "text-primary font-semibold" : "font-medium"}>{preset.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{preset.description}</span>
                </DropdownMenuItem>
              ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
