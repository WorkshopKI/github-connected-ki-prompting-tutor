import { Check, Palette } from "lucide-react";
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
import { themePresets } from "@/components/themePresets";

export const ThemePresetPicker = () => {
  const { theme, setTheme } = useTheme();

  const selectedThemeName =
    themePresets.find((preset) => preset.id === theme)?.name ?? "Theme wählen";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 max-w-[180px]">
          <Palette className="h-4 w-4 shrink-0" />
          <span className="truncate">{selectedThemeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themePresets.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => setTheme(preset.id)}
            className="flex items-center justify-between"
          >
            <span className={theme === preset.id ? "text-primary font-semibold" : "font-medium"}>{preset.name}</span>
            {theme === preset.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
