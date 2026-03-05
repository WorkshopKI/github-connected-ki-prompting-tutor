import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md";
  className?: string;
}

export const Logo = ({ size = "md", className }: LogoProps) => {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-1.5 select-none", className)}>
      <span className={cn("font-mono font-bold text-primary", sizes[size])}>
        ⟨P⟩
      </span>
      <span className={cn("font-bold tracking-tight", sizes[size])}>
        <span className="text-foreground">prompting</span>
        <span className="text-primary">.</span>
        <span className="text-muted-foreground font-normal">studio</span>
      </span>
    </div>
  );
};
