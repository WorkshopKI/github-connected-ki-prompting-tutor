import { useState } from "react";
import { BookOpen, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { SyncStatusIcon } from "@/components/SyncStatusIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/#" + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "Überblick", id: "hero", type: "scroll" as const },
    { label: "Methoden", id: "acta", type: "scroll" as const },
    { label: "Sammlung", id: "bibliothek", type: "scroll" as const },
    { label: "Übungen", id: "uebungen", type: "scroll" as const },
  ];

  const handleNavClick = (item: typeof navItems[number]) => {
    scrollToSection(item.id);
    setMobileOpen(false);
  };

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-gradient-primary p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-base hidden sm:inline">Prompting Tutor</span>
          </button>

          <div className="hidden md:flex items-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="px-2 md:px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                {item.label}
              </button>
            ))}
            <Button
              size="sm"
              onClick={() => navigate("/playground")}
              className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              Prompt-Labor
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <SyncStatusIcon />
            <UserMenu />
            <ThemeToggle />

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 overflow-y-auto">
                <SheetTitle className="text-lg font-bold mb-4">Navigation</SheetTitle>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className="text-left px-4 py-3 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      {item.label}
                    </button>
                  ))}
                  <Separator className="my-2" />
                  <Button
                    onClick={() => { navigate("/playground"); setMobileOpen(false); }}
                    className="mx-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Prompt-Labor
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
