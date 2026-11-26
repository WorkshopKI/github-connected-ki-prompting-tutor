import { useEffect, useState } from "react";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { PraesentationBuehne } from "@/components/kurs/live/PraesentationBuehne";
import { PraesentationStart } from "@/components/kurs/live/PraesentationStart";
import { usePraesentation, vollbildUmschalten } from "@/hooks/usePraesentation";
import { setzeStand, starteLeitung, useKursLive } from "@/lib/kursLive";

/**
 * /kurs/praesentation — Präsentieren aus der App.
 * Folien als Bilder mit schrittweisem Aufbau; jeder Klick geht an den Leitstand der Kursleitung.
 * Spec: docs/specs/2026-11-22-kurs-fahrplan-live.md
 */
export default function KursPraesentation() {
  const live = useKursLive();
  // Rückkehr aus einer Demo-Seite: direkt wieder auf die Bühne (Vollbild bleibt erhalten).
  const [buehne, setBuehne] = useState(() => live.rolle === "leitung" && live.stand?.modus === "app");
  const p = usePraesentation(buehne);

  useEffect(() => {
    if (live.rolle !== "leitung") starteLeitung();
    else if (live.stand?.modus === "app") setzeStand({ modus: "folie", pfad: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (vonVorn: boolean) => {
    if (vonVorn) p.gehe(1);
    else setzeStand({ modus: "folie", pfad: undefined });
    setBuehne(true);
    if (!document.fullscreenElement) vollbildUmschalten();
  };

  const ende = () => {
    if (document.fullscreenElement) vollbildUmschalten();
    setBuehne(false);
  };

  if (buehne) return <PraesentationBuehne p={p} onEnde={ende} />;

  return (
    <KursLayout>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Für die Kursleitung"
          title="Präsentieren"
          description="Die Folien laufen hier in der App. Volle Folien bauen sich Schritt für Schritt auf. Notizen, Zeitplan und Fernbedienung hast du im Leitstand."
        />
        <PraesentationStart onStart={start} />
      </div>
    </KursLayout>
  );
}
