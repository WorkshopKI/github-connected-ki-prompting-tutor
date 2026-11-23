import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptionalBadge } from "@/components/kurs/OptionalBadge";
import { BADGE_COLORS, LS_KEYS } from "@/lib/constants";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { TYP_LABEL, blockById, blockLabel, geplanterStart, naechsteStation, stationFuerFolie } from "@/data/kurs/fahrplan";
import type { LiveStand } from "@/lib/kursLive";

/** Einstellungen des Leitstands je Gerät: Kursbeginn je Tag, Pausen des heutigen Tages. */
export interface LeitstandEinstellungen {
  beginn: Record<string, string>;
  pausen: { datum: string; minuten: number };
}

const heute = () => new Date().toISOString().slice(0, 10);
const STANDARD: LeitstandEinstellungen = { beginn: { "1": "09:00", "2": "09:00" }, pausen: { datum: heute(), minuten: 0 } };

export function ladeEinstellungen(): LeitstandEinstellungen {
  const e = loadFromStorage<LeitstandEinstellungen>(LS_KEYS.KURS_LEITSTAND, STANDARD);
  return e.pausen?.datum === heute() ? e : { ...e, pausen: { datum: heute(), minuten: 0 } };
}

export function pauseZaehlen(minuten: number) {
  const e = ladeEinstellungen();
  saveToStorage(LS_KEYS.KURS_LEITSTAND, { ...e, pausen: { datum: heute(), minuten: e.pausen.minuten + minuten } });
}

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const uhr = (d: Date) => d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

/** Zeit je Station (Soll/Ist) und Lage im Tagesplan. */
export function LeitstandZeit({ stand }: { stand: LiveStand | null }) {
  const [jetzt, setJetzt] = useState(Date.now());
  const [einst, setEinst] = useState(ladeEinstellungen);
  useEffect(() => {
    const t = window.setInterval(() => {
      setJetzt(Date.now());
      setEinst(ladeEinstellungen());
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  const station = stationFuerFolie(stand?.folie ?? 1);
  const tag = String(blockById(station.block).tag);
  const ist = stand ? jetzt - stand.stationSeit : 0;
  const soll = station.minuten * 60_000;
  const ueber = ist > soll;

  const [h, m] = (einst.beginn[tag] ?? "09:00").split(":").map(Number);
  const planStart = new Date();
  planStart.setHours(h, m + geplanterStart(station) + einst.pausen.minuten, 0, 0);
  const abweichung = stand ? Math.round((stand.stationSeit - planStart.getTime()) / 60_000) : 0;
  const naechste = naechsteStation(station);

  const setBeginn = (v: string) => {
    const e = { ...einst, beginn: { ...einst.beginn, [tag]: v } };
    setEinst(e);
    saveToStorage(LS_KEYS.KURS_LEITSTAND, e);
  };

  return (
    <section className="card-section grid gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <Clock className="h-4 w-4" strokeWidth={1.75} /> {blockLabel(station)}
        </h2>
        <span className="font-mono text-2xl tabular-nums">{uhr(new Date(jetzt))}</span>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2 font-semibold">
          {station.titel}
          {station.optional && <OptionalBadge title="Bei Zeitmangel überspringen" />}
        </div>
        <div className="text-sm text-muted-foreground">{TYP_LABEL[station.typ]} · geplant {station.minuten} Min</div>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn("font-mono text-3xl tabular-nums", ueber && "text-danger")}>{mmss(ist)}</span>
        <span className="text-sm text-muted-foreground">von {station.minuten}:00</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full", ueber ? "bg-danger" : "bg-primary")} style={{ width: `${Math.min(100, (ist / soll) * 100)}%` }} />
        </div>
      </div>
      {stand && Math.abs(abweichung) < 180 && (
        <p className="text-sm">
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", Math.abs(abweichung) <= 5 ? BADGE_COLORS.success : abweichung > 0 ? BADGE_COLORS.medium : BADGE_COLORS.low)}>
            {Math.abs(abweichung) <= 5 ? "im Plan" : abweichung > 0 ? `${abweichung} Min hinter Plan` : `${-abweichung} Min vor Plan`}
          </span>{" "}
          <span className="text-muted-foreground">
            Station geplant ab {uhr(planStart)}
            {einst.pausen.minuten > 0 && ` (inkl. ${einst.pausen.minuten} Min Pause)`}
          </span>
        </p>
      )}
      {naechste && <p className="text-sm text-muted-foreground">Danach: {naechste.titel} ({naechste.minuten} Min)</p>}
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        Kursbeginn Tag {tag}
        <input type="time" value={einst.beginn[tag] ?? "09:00"} onChange={(e) => setBeginn(e.target.value)} className="rounded-md border border-input bg-card px-2 py-1 text-foreground" />
      </label>
    </section>
  );
}
