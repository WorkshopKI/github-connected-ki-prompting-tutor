import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md";
  variant?: "default" | "sidebar";
  className?: string;
}

export const Logo = ({ size = "md", variant = "default", className }: LogoProps) => {
  const monoSizes = {
    sm: "text-2xl",
    md: "text-3xl",
  };
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
  };

  const isSidebar = variant === "sidebar";

  return (
    <div className={cn("flex items-center gap-1.5 select-none", className)}>
      <span className={cn("font-mono font-bold", isSidebar ? "text-sidebar-primary" : "text-primary", monoSizes[size])}>
        ⟨P⟩
      </span>
      <span className={cn("font-bold tracking-tight", textSizes[size])}>
        <span className={cn("font-normal", isSidebar ? "text-sidebar-foreground/60" : "text-muted-foreground")}>KI</span>
        <span className={isSidebar ? "text-sidebar-primary" : "text-primary"}>-</span>
        <span className={isSidebar ? "text-sidebar-foreground" : "text-foreground"}>Praxis</span>
      </span>
    </div>
  );
};
