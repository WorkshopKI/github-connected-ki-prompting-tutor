import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FOLIEN_ANZAHL, folie, weiter as vor, zurueck as rueck } from "@/data/kurs/folien";
import { linkFuerFolie } from "@/data/kurs/fahrplan";
import { aufBefehl, setzeStand, useKursLive, type Befehl } from "@/lib/kursLive";

export interface Praesentation {
  nr: number;
  schritt: number;
  dunkel: boolean;
  /** Ziffern, die gerade für einen Sprung getippt werden („12“ + Enter). */
  eingabe: string;
  hilfe: boolean;
  weiter: () => void;
  zurueck: () => void;
  gehe: (nr: number, schritt?: number) => void;
  appOeffnen: () => void;
  schwarz: () => void;
  setHilfe: (an: boolean) => void;
  vollbild: () => void;
}

export function vollbildUmschalten() {
  if (document.fullscreenElement) void document.exitFullscreen?.();
  else void document.documentElement.requestFullscreen?.().catch(() => undefined);
}

/** Wirkt ein Befehl aus dem Leitstand, der unabhängig von der Folienansicht ist? */
export function allgemeinerBefehl(b: Befehl): boolean {
  if (b.cmd === "ansage") setzeStand({ ansage: b.ansage });
  else if (b.cmd === "dunkel") setzeStand({ dunkel: b.an });
  else return false;
  return true;
}

/**
 * Steuerung des Präsentationsmodus: Tastatur, Presenter-Fernbedienung, Klick und Leitstand.
 * Ein „Weiter“ blendet zuerst den nächsten Aufbauschritt ein, danach kommt die nächste Folie.
 */
export function usePraesentation(aktiv: boolean): Praesentation {
  const { stand } = useKursLive();
  const navigate = useNavigate();
  const nr = stand?.folie ?? 1;
  const schritt = Math.min(stand?.schritt ?? 0, (folie(nr)?.schritte ?? 1) - 1);
  const dunkel = !!stand?.dunkel;
  const [eingabe, setEingabe] = useState("");
  const [hilfe, setHilfe] = useState(false);
  const pos = useRef({ nr, schritt });
  pos.current = { nr, schritt };

  const gehe = useCallback((n: number, s = 0) => {
    const z = Math.min(FOLIEN_ANZAHL, Math.max(1, n));
    setzeStand({ folie: z, schritt: Math.min(s, (folie(z)?.schritte ?? 1) - 1), modus: "folie", pfad: undefined, dunkel: false });
  }, []);
  const weiter = useCallback(() => {
    const p = vor(pos.current.nr, pos.current.schritt);
    gehe(p.nr, p.schritt);
  }, [gehe]);
  const zurueck = useCallback(() => {
    const p = rueck(pos.current.nr, pos.current.schritt);
    gehe(p.nr, p.schritt);
  }, [gehe]);
  const appOeffnen = useCallback(() => {
    const pfad = linkFuerFolie(pos.current.nr);
    if (!pfad) return;
    setzeStand({ modus: "app", pfad });
    navigate(pfad);
  }, [navigate]);

  // Befehle aus dem Leitstand
  useEffect(() => {
    if (!aktiv) return;
    return aufBefehl((b) => {
      if (allgemeinerBefehl(b)) return;
      if (b.cmd === "weiter") weiter();
      else if (b.cmd === "zurueck") zurueck();
      else if (b.cmd === "gehe") gehe(b.folie, b.schritt ?? 0);
    });
  }, [aktiv, weiter, zurueck, gehe]);

  // Tastatur und Presenter (Presenter senden Bild auf/ab, manche B oder Punkt für „schwarz“)
  useEffect(() => {
    if (!aktiv) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (/^[0-9]$/.test(k)) {
        setEingabe((x) => (x + k).slice(-2));
        return;
      }
      if (k === "Enter" && eingabe) {
        gehe(Number(eingabe));
        setEingabe("");
        return;
      }
      setEingabe("");
      const keys: Record<string, () => void> = {
        ArrowRight: weiter, ArrowDown: weiter, PageDown: weiter, " ": weiter, Enter: weiter, n: weiter,
        ArrowLeft: zurueck, ArrowUp: zurueck, PageUp: zurueck, Backspace: zurueck, p: zurueck,
        Home: () => gehe(1), End: () => gehe(FOLIEN_ANZAHL, 99),
        b: () => setzeStand({ dunkel: !dunkel }), ".": () => setzeStand({ dunkel: !dunkel }),
        f: vollbildUmschalten, l: appOeffnen, a: appOeffnen,
        "?": () => setHilfe((x) => !x), h: () => setHilfe((x) => !x),
        Escape: () => setHilfe(false),
      };
      const f = keys[k] ?? keys[k.toLowerCase()];
      if (f) {
        e.preventDefault();
        f();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aktiv, eingabe, dunkel, weiter, zurueck, gehe, appOeffnen]);

  const schwarz = () => setzeStand({ dunkel: !dunkel });
  return { nr, schritt, dunkel, eingabe, hilfe, weiter, zurueck, gehe, appOeffnen, schwarz, setHilfe, vollbild: vollbildUmschalten };
}
