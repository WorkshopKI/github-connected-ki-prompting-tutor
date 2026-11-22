import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { folie, folienBild, weiter } from "@/data/kurs/folien";

/** Bilder vorladen, damit der nächste Klick ohne Flackern kommt. */
export function useVorladen(nr: number, schritt: number, anzahl = 2) {
  useEffect(() => {
    let pos = { nr, schritt };
    for (let i = 0; i < anzahl; i++) {
      pos = weiter(pos.nr, pos.schritt);
      const img = new Image();
      img.src = folienBild(pos.nr, pos.schritt);
    }
  }, [nr, schritt, anzahl]);
}

interface FolieBildProps {
  nr: number;
  /** Aufbauschritt (0-basiert); weglassen = vollständige Folie. */
  schritt?: number;
  className?: string;
  /** Bild darf beim ersten Laden Vorrang haben (Beamer). */
  wichtig?: boolean;
}

/** Eine Folie als Bild im Format 16:9, mit Titel als Alternativtext. */
export function FolieBild({ nr, schritt, className, wichtig }: FolieBildProps) {
  const f = folie(nr);
  return (
    <img
      src={folienBild(nr, schritt)}
      alt={f ? `Folie ${nr}: ${f.titel}` : `Folie ${nr}`}
      width={1600}
      height={900}
      decoding="async"
      loading={wichtig ? "eager" : "lazy"}
      className={cn("aspect-video h-auto w-full select-none bg-card object-contain", className)}
      draggable={false}
    />
  );
}
