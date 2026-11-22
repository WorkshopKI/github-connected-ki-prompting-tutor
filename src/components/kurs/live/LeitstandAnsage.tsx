import { useState, type FormEvent } from "react";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stationFuerFolie } from "@/data/kurs/fahrplan";
import { sendeBefehl, type LiveStand } from "@/lib/kursLive";
import { pauseZaehlen } from "@/components/kurs/live/LeitstandZeit";

const inMinuten = (min: number) => {
  const d = new Date(Date.now() + min * 60_000);
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
};

/** Ansagen an Beamer und Teilnehmende: Pause, Gruppenarbeit, freier Text. */
export function LeitstandAnsage({ stand }: { stand: LiveStand | null }) {
  const [text, setText] = useState("");
  const station = stationFuerFolie(stand?.folie ?? 1);
  const aktiv = stand?.ansage?.text;

  const pause = (min: number) => {
    pauseZaehlen(min);
    sendeBefehl({ cmd: "ansage", ansage: { text: "Pause", bis: inMinuten(min) } });
  };
  const frei = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendeBefehl({ cmd: "ansage", ansage: { text: text.trim() } });
    setText("");
  };

  return (
    <section className="card-section grid gap-3">
      <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold">
        <Megaphone className="h-4 w-4" strokeWidth={1.75} /> Ansage
      </h2>
      {aktiv && (
        <div className="flex items-center justify-between gap-2 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-soft-ink">
          <span className="font-semibold">
            {aktiv}
            {stand?.ansage?.bis && ` · bis ${stand.ansage.bis}`}
          </span>
          <button className="font-semibold hover:underline" onClick={() => sendeBefehl({ cmd: "ansage", ansage: null })}>
            Beenden
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => pause(10)}>Pause 10 Min</Button>
        <Button variant="outline" size="sm" onClick={() => pause(15)}>Pause 15 Min</Button>
        <Button variant="outline" size="sm" onClick={() => pause(45)}>Mittag 45 Min</Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => sendeBefehl({ cmd: "ansage", ansage: { text: station.titel.replace(/^Gruppe: /, "Gruppenarbeit: "), bis: inMinuten(station.minuten) } })}
        >
          Arbeitsphase {station.minuten} Min
        </Button>
      </div>
      <form onSubmit={frei} className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Eigene Ansage, z. B. „Ergebnisse ins Padlet“" maxLength={120} />
        <Button type="submit" variant="outline" disabled={!text.trim()}>Zeigen</Button>
      </form>
    </section>
  );
}
