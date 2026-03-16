import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md";
  variant?: "default" | "sidebar";
  className?: string;
  hideSubtitle?: boolean;
}

export const Logo = ({ size = "md", variant = "default", className, hideSubtitle = false }: LogoProps) => {
  const isSidebar = variant === "sidebar";

  const textSize = size === "sm" ? "text-[15px]" : "text-[17px]";
  const subSize = size === "sm" ? "text-[9.5px]" : "text-[10.5px]";

  return (
    <div className={cn("select-none", className)}>
      <div className={cn("leading-none", textSize)}>
        <span className={cn(isSidebar ? "text-sidebar-foreground" : "text-foreground")} style={{ fontWeight: 800 }}>KI</span>
        <span className={cn(isSidebar ? "text-sidebar-foreground" : "text-foreground")} style={{ fontWeight: 300 }}>-Werkstatt</span>
      </div>
      {!hideSubtitle && (
        <div className={cn("leading-none", subSize, isSidebar ? "text-sidebar-foreground/60" : "text-muted-foreground/60")}>
          Souverän arbeiten mit KI
        </div>
      )}
    </div>
  );
};
