import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md";
  variant?: "default" | "sidebar";
  className?: string;
}

export const Logo = ({ size = "md", variant = "default", className }: LogoProps) => {
  const isSidebar = variant === "sidebar";

  const textSize = size === "sm" ? "text-[15px]" : "text-[17px]";
  const subSize = size === "sm" ? "text-[8.5px]" : "text-[9.5px]";

  return (
    <div className={cn("select-none", className)}>
      <span className={cn("leading-none", textSize)}>
        <span className={cn("font-extrabold tracking-wide", isSidebar ? "text-sidebar-foreground" : "text-foreground")}>
          KI
        </span>
        <span className={cn("font-light tracking-normal", isSidebar ? "text-sidebar-foreground" : "text-foreground")}>
          -Werkstatt
        </span>
      </span>
      <div className={cn("mt-0.5 tracking-wide", subSize, isSidebar ? "text-sidebar-foreground/60" : "text-muted-foreground/60")}>
        Souverän arbeiten mit KI
      </div>
    </div>
  );
};
