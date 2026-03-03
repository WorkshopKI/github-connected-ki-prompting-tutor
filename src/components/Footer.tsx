import { BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Footer = () => (
  <footer className="bg-card border-t border-border overflow-hidden">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Prompting Tutor</span>
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Erstellt für interaktives KI-Lernen
        </p>
        <ThemeToggle />
      </div>
    </div>
  </footer>
);
