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

function getBaseTheme(theme: string | undefined) {
  if (!theme) return "muted-stone-contrast";
  return theme.replace(/-dark$/, "");
}

export const ThemePresetPicker = () => {
  const { theme, setTheme } = useTheme();

  const baseTheme = getBaseTheme(theme);

  const handlePresetClick = (presetId: string) => {
    const preset = themePresets.find((p) => p.id === presetId);
    if (!preset) return;
    setTheme(preset.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Theme wählen</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themePresets.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => handlePresetClick(preset.id)}
            className="flex items-center justify-between"
          >
            <span className={baseTheme === preset.id ? "text-primary font-semibold" : "font-medium"}>{preset.name}</span>
            {baseTheme === preset.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
