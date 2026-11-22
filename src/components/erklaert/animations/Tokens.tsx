import { useMemo, useState } from "react";
import { StepPlayer } from "../StepPlayer";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/**
 * Erklär-Animation 2: Text wird in Tokens zerlegt.
 * Vereinfachte Zerlegung zur Veranschaulichung (keine echte Tokenizer-Logik):
 * häufige kurze Wörter bleiben ganz, lange Wörter werden in Silben-ähnliche Stücke geteilt.
 */

const START = "Die Bundesgartenschau öffnet morgen um 9 Uhr.";
const FARBEN = ["bg-brand-soft", "bg-info/15", "bg-success/15", "bg-warning/20", "bg-chart-4/15"];

function zerlegen(text: string): string[] {
  const out: string[] = [];
  const teile = text.match(/\s*[\p{L}]+|\s*\d+|\s*[^\s\p{L}\d]/gu) ?? [];
  for (const t of teile) {
    const leer = t.match(/^\s*/)?.[0] ?? "";
    const wort = t.slice(leer.length);
    if (wort.length <= 6 || !/\p{L}/u.test(wort)) {
      out.push(leer + wort);
      continue;
    }
    // lange Wörter in Stücke von 3–5 Zeichen teilen, bevorzugt nach Vokal
    let rest = wort;
    let erstes = true;
    while (rest.length > 5) {
      let schnitt = 4;
      for (let k = 5; k >= 3; k--) {
        if (/[aeiouäöü]/i.test(rest[k - 1]) && !/[aeiouäöü]/i.test(rest[k])) { schnitt = k; break; }
      }
      out.push((erstes ? leer : "") + rest.slice(0, schnitt));
      rest = rest.slice(schnitt);
      erstes = false;
    }
    out.push((erstes ? leer : "") + rest);
  }
  return out;
}

function id(t: string) {
  let h = 7;
  for (const c of t) h = (h * 31 + c.charCodeAt(0)) % 100000;
  return h;
}

export default function Tokens() {
  const [text, setText] = useState(START);
  const tokens = useMemo(() => zerlegen(text), [text]);
  const woerter = text.trim() ? text.trim().split(/\s+/).length : 0;

  const captions = [
    <p key={0}>Für uns besteht ein Satz aus Wörtern. Ein Sprachmodell sieht ihn anders. Probier eigene Sätze im Textfeld aus.</p>,
    <>
      <p>Der Text wird in <strong>Tokens</strong> zerlegt: häufige Wörter bleiben ganz, seltene oder lange Wörter werden in Stücke geteilt.</p>
      <p>Deutsche Komposita wie „Bundesgartenschau“ ergeben oft mehrere Tokens.</p>
    </>,
    <>
      <p>Jedes Token ist für das Modell nur eine <strong>Nummer</strong> aus einem festen Wörterbuch. Mit diesen Nummern rechnet es.</p>
      <p>Darum tun sich Modelle manchmal schwer mit Buchstaben zählen oder Wörter rückwärts schreiben: Sie sehen die Buchstaben gar nicht einzeln.</p>
    </>,
    <>
      <p><strong>Tokens sind die Währung der KI.</strong> Kosten, Geschwindigkeit und das Kontextfenster werden in Tokens gemessen.</p>
      <p>Große Modelle verarbeiten heute rund eine Million Tokens auf einmal, das sind mehrere Bücher. Was nicht hineinpasst, sieht das Modell nicht.</p>
    </>,
  ];

  return (
    <StepPlayer
      captions={captions}
      controls={() => (
        <div className="grid gap-2">
          <Label htmlFor="tok-text" className="text-sm">Eigener Text</Label>
          <Textarea id="tok-text" value={text} onChange={(e) => setText(e.target.value)} rows={3} />
          <span className="text-xs text-muted-foreground">Vereinfachte Zerlegung zur Veranschaulichung.</span>
        </div>
      )}
    >
      {(step) => (
        <div className="grid gap-5">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold">{step === 0 ? "Text" : step === 1 ? "Tokens" : step === 2 ? "Tokens als Nummern" : "Gezählt"}</h3>
            {step === 0 ? (
              <p className="text-2xl leading-relaxed">{text}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {tokens.map((t, i) => (
                  <span key={i} className={`rounded-md px-1.5 py-1 font-mono text-lg ${FARBEN[i % FARBEN.length]} transition-all`}>
                    {step >= 2 ? id(t) : t.replace(/ /g, "·")}
                  </span>
                ))}
              </div>
            )}
          </div>
          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-4xl font-semibold tabular-nums">{woerter}</div>
                <div className="text-sm text-muted-foreground">Wörter</div>
              </div>
              <div className="rounded-lg border border-border bg-brand-soft p-5">
                <div className="text-4xl font-semibold tabular-nums">{tokens.length}</div>
                <div className="text-sm text-muted-foreground">Tokens (vereinfacht)</div>
              </div>
            </div>
          )}
          {step >= 1 && step < 3 && <p className="text-sm text-muted-foreground">Ein „·“ markiert ein Leerzeichen, das zum Token gehört.</p>}
        </div>
      )}
    </StepPlayer>
  );
}
