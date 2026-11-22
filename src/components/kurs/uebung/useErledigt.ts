import { useCallback, useState } from "react";
import { LS_KEYS } from "@/lib/constants";
import { loadArrayFromStorage, saveToStorage } from "@/lib/storage";

export interface ErledigtState {
  erledigt: string[];
  istErledigt: (id: string) => boolean;
  markiere: (id: string) => void;
}

/** Erledigte Kurs-Übungen, nur im Browser gespeichert (kein Login nötig). */
export function useErledigt(): ErledigtState {
  const [erledigt, setErledigt] = useState<string[]>(() => loadArrayFromStorage<string>(LS_KEYS.KURS_UEBUNGEN));
  const markiere = useCallback((id: string) => {
    setErledigt((alt) => {
      if (alt.includes(id)) return alt;
      const neu = [...alt, id];
      saveToStorage(LS_KEYS.KURS_UEBUNGEN, neu);
      return neu;
    });
  }, []);
  return { erledigt, istErledigt: (id) => erledigt.includes(id), markiere };
}
