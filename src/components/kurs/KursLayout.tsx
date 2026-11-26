import { useEffect, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BookOpen, GraduationCap, LayoutDashboard, Map as MapIcon, MonitorPlay, PlayCircle, Users, Layers, Wrench } from "lucide-react";
import { FahrplanLeiste } from "@/components/kurs/live/FahrplanLeiste";
import { LeitungZurueck } from "@/components/kurs/live/LeitungZurueck";
import { isKursEdition } from "@/lib/edition";
import { ROUTES } from "@/lib/constants";
import { tabBenennen } from "@/lib/kursPosition";

/**
 * Schlanker Rahmen für den öffentlichen Kursbereich (/kurs, /erklaert).
 * Bewusst ohne Auth-, Sync- und Org-Kontext: läuft auch, wenn Login oder KI-Schnittstelle ausfallen.
 * Design-System „KI-Werkstatt“: typografische Wortmarke, ruhige Navigation, eine Primäraktion.
 */
const KURS = isKursEdition();

/* Im Organisations-Auftritt kommt man aus der App hierher (z. B. über „KI erklärt“):
 * „Start“ führt zurück zur App-Startseite. Die Werkstatt ist in beiden Auftritten verlinkt. */
const NAV = [
  ...(KURS ? [] : [{ to: "/", label: "Start", icon: LayoutDashboard, end: true }]),
  { to: ROUTES.KURS, label: "Kurs", icon: MapIcon, end: true },
  { to: ROUTES.KURS_FOLIEN, label: "Folien", icon: MonitorPlay },
  { to: "/erklaert", label: "KI erklärt", icon: PlayCircle },
  { to: ROUTES.KURS_VORLAGEN, label: "Prompt-Vorlagen", icon: BookOpen },
  { to: ROUTES.KURS_GRUPPEN, label: "Gruppenarbeit", icon: Users },
  { to: "/kurs/stand", label: "Aktuelle Modelle", icon: Layers },
  { to: "/playground", label: "Werkstatt", icon: Wrench },
];

export function KursLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  // App-Tab und Folien-Tab finden sich über ihren Fensternamen (siehe TabLink).
  useEffect(() => tabBenennen(pathname), [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LeitungZurueck />
      <header className="z-20 border-b border-border bg-card md:sticky md:top-0 print:hidden">
        <div className="mx-auto flex max-w-[70rem] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 max-md:gap-x-3 lg:px-8">
          <Link to={KURS ? ROUTES.KURS : "/"} className="leading-tight" aria-label={KURS ? "KI-Werkstatt, zur Kursübersicht" : "KI-Werkstatt, zur Startseite"}>
            <span className="block font-serif text-xl font-semibold">KI-Werkstatt</span>
            <span className="block text-xs text-muted-foreground">Kurs · Mit KI arbeiten</span>
          </Link>
          <nav className="-mx-1 flex gap-0.5 overflow-x-auto whitespace-nowrap max-md:order-last max-md:w-full md:flex-wrap" aria-label="Kursbereich">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors duration-100 ${
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
            <span className="max-sm:hidden">Übungen</span>
            <span className="sm:hidden">Üben</span>
          </Link>
        </div>
        {/* Du bist hier: im mitlaufenden Kopf, damit Thema und Übung beim Scrollen sichtbar bleiben */}
        <FahrplanLeiste />
      </header>
      <main className="mx-auto max-w-[70rem] px-4 py-6 lg:px-8 print:max-w-none print:p-0">{children}</main>
    </div>
  );
}
