import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50 mt-20 overflow-hidden">
    <div className="container mx-auto px-4 max-w-7xl py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <Logo size="sm" />
      <p className="text-xs text-muted-foreground text-center">
        Ein interaktiver Kurs von KiLab · Für Workshops und Selbstlerner
      </p>
      <div className="flex items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}
        </p>
        <ThemeToggle />
      </div>
    </div>
  </footer>
);
