import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { BookOpen, GraduationCap, Map as MapIcon, PlayCircle, Users, Layers } from "lucide-react";

/**
 * Schlanker Rahmen für den öffentlichen Kursbereich (/kurs, /erklaert).
 * Bewusst ohne Auth-, Sync- und Org-Kontext: läuft auch, wenn Login oder KI-Schnittstelle ausfallen.
 * Design-System „KI-Werkstatt“: typografische Wortmarke, ruhige Navigation, eine Primäraktion.
 */
const NAV = [
  { to: "/kurs", label: "Kurs", icon: MapIcon, end: true },
  { to: "/erklaert", label: "KI erklärt", icon: PlayCircle },
  { to: "/kurs/vorlagen", label: "Vorlagen", icon: BookOpen },
  { to: "/kurs/gruppen", label: "Gruppenarbeit", icon: Users },
  { to: "/kurs/stand", label: "Aktuelle Modelle", icon: Layers },
];

export function KursLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-card print:hidden">
        <div className="mx-auto flex max-w-[70rem] flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3 lg:px-8">
          <Link to="/kurs" className="leading-tight" aria-label="KI-Werkstatt, zur Kursübersicht">
            <span className="block font-serif text-xl font-semibold">KI-Werkstatt</span>
            <span className="block text-xs text-muted-foreground">Kurs · Mit KI arbeiten</span>
          </Link>
          <nav className="flex flex-wrap gap-1" aria-label="Kursbereich">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-100 ${
                      isActive ? "bg-brand-soft text-brand-soft-ink" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  {n.label}
                </NavLink>
              );
            })}
          </nav>
          <Link
            to="/kurs/uebungen"
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-input px-3 py-1.5 text-sm font-semibold hover:bg-accent"
          >
            <GraduationCap className="h-4 w-4" strokeWidth={1.75} />
            Übungen starten
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[70rem] px-4 py-8 lg:px-8 print:max-w-none print:p-0">{children}</main>
    </div>
  );
}
